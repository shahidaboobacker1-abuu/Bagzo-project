// Context/CartProvider.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { api } from '../API/Axios';
import { useAuth } from './AuthProvider';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuth();

  // Fetch cart from JSON server when user changes
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      console.log('🔄 Fetching cart for user:', user.id);
      const response = await api.get(`/cart?userId=${user.id}`);
      
      console.log('📦 Raw cart data from server:', response.data);
      
      if (!response.data || response.data.length === 0) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      // Transform the flat cart items to match our product structure
      const cartItemsWithDetails = response.data.map(item => ({
        id: item.productId,
        quantity: item.quantity,
        cartItemId: item.id,
        addedAt: item.addedAt || new Date().toISOString()
      }));
      
      console.log('🛒 Cart items with details:', cartItemsWithDetails);

      // We need to fetch product details for each cart item
      const productsResponse = await api.get('/products');
      console.log('📦 All products:', productsResponse.data);
      
      const productsMap = {};
      productsResponse.data.forEach(product => {
        productsMap[product.id] = product;
      });

      console.log('🗺️ Products map:', productsMap);

      // Merge product details with cart items
      const completeCartItems = cartItemsWithDetails
        .map(cartItem => {
          const product = productsMap[cartItem.id];
          if (!product) {
            console.warn(`⚠️ Product ${cartItem.id} not found in products`);
            return null;
          }
          
          return {
            ...product,
            quantity: cartItem.quantity,
            cartItemId: cartItem.cartItemId,
            addedAt: cartItem.addedAt
          };
        })
        .filter(item => item !== null);

      console.log('✅ Complete cart items:', completeCartItems);
      setCartItems(completeCartItems);
      setLoading(false);
    } catch (error) {
      console.error('🚨 Error fetching cart:', error);
      setError('Failed to load cart. Please try again.');
      setLoading(false);
      setCartItems([]);
    }
  }, [user?.id, isAuthenticated]);

  // Load cart when user changes
  useEffect(() => {
    console.log('👤 User changed, fetching cart:', user?.id);
    fetchCart();
  }, [fetchCart]);

  // Add item to cart on JSON server
  const addToCart = async (product, quantity = 1) => {
    if (!isAuthenticated || !user?.id) {
      setError('Please login to add items to cart');
      alert('Please login to add items to cart');
      return;
    }

    if (!product || !product.id) {
      console.error('Invalid product:', product);
      return;
    }

    try {
      setLoading(true);
      console.log(`➕ Adding to cart: ${product.name}, quantity: ${quantity}, user: ${user.id}`);
      
      // Check if item already exists in cart
      const existingCartItem = cartItems.find(item => item.id === product.id);
      
      if (existingCartItem) {
        // Update quantity on server
        console.log(`📝 Updating quantity for existing item ${existingCartItem.cartItemId}`);
        const newQuantity = existingCartItem.quantity + quantity;
        await api.patch(`/cart/${existingCartItem.cartItemId}`, {
          quantity: newQuantity
        });
        console.log(`✅ Quantity updated to ${newQuantity}`);
      } else {
        // Add new item to server
        console.log(`📝 Adding new item to server`);
        await api.post('/cart', {
          userId: user.id,
          productId: product.id,
          quantity: quantity,
          addedAt: new Date().toISOString()
        });
        console.log(`✅ New item added`);
      }
      
      // Refresh cart from server
      await fetchCart();
      console.log(`🔄 Cart refreshed`);
      setLoading(false);
    } catch (error) {
      console.error('🚨 Error adding to cart:', error);
      setError('Failed to add item to cart');
      alert('Failed to add item to cart. Please try again.');
      setLoading(false);
    }
  };

  // Remove item from cart on JSON server
  const removeFromCart = async (productId) => {
    if (!isAuthenticated || !user?.id) {
      setError('Please login to modify cart');
      return;
    }

    try {
      setLoading(true);
      console.log(`🗑️ Removing from cart: productId ${productId}, user: ${user.id}`);
      
      const cartItem = cartItems.find(item => item.id === productId);
      
      if (cartItem?.cartItemId) {
        console.log(`📝 Deleting cart item ${cartItem.cartItemId}`);
        await api.delete(`/cart/${cartItem.cartItemId}`);
        console.log(`✅ Item deleted`);
      } else {
        console.warn(`⚠️ Cart item not found for product ${productId}`);
      }
      
      // Refresh cart from server
      await fetchCart();
      setLoading(false);
    } catch (error) {
      console.error('🚨 Error removing from cart:', error);
      setError('Failed to remove item from cart');
      setLoading(false);
    }
  };

  // Update item quantity on JSON server
  const updateQuantity = async (productId, newQuantity) => {
    if (!isAuthenticated || !user?.id) {
      setError('Please login to modify cart');
      return;
    }

    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    try {
      setLoading(true);
      console.log(`📝 Updating quantity: productId ${productId}, quantity: ${newQuantity}`);
      
      const cartItem = cartItems.find(item => item.id === productId);
      
      if (cartItem?.cartItemId) {
        await api.patch(`/cart/${cartItem.cartItemId}`, {
          quantity: newQuantity
        });
        console.log(`✅ Quantity updated`);
      } else {
        console.warn(`⚠️ Cart item not found for product ${productId}`);
        // If item doesn't exist in cart but we're trying to update it,
        // we need to add it first
        const product = cartItems.find(item => item.id === productId);
        if (product) {
          await addToCart(product, newQuantity);
        }
      }
      
      // Refresh cart from server
      await fetchCart();
      setLoading(false);
    } catch (error) {
      console.error('🚨 Error updating quantity:', error);
      setError('Failed to update quantity');
      setLoading(false);
    }
  };

  // Clear entire cart for current user on JSON server
  const clearCart = async () => {
    if (!isAuthenticated || !user?.id) {
      setError('Please login to clear cart');
      return;
    }

    try {
      setLoading(true);
      console.log(`🧹 Clearing cart for user: ${user.id}`);
      
      // Fetch all cart items for this user
      const response = await api.get(`/cart?userId=${user.id}`);
      const userCartItems = response.data;
      
      console.log(`🗑️ Deleting ${userCartItems.length} items`);
      
      // Delete each item
      await Promise.all(
        userCartItems.map(item => api.delete(`/cart/${item.id}`))
      );
      
      // Refresh cart from server
      await fetchCart();
      console.log(`✅ Cart cleared`);
      setLoading(false);
    } catch (error) {
      console.error('🚨 Error clearing cart:', error);
      setError('Failed to clear cart');
      setLoading(false);
    }
  };

  // Check if item is in cart
  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  // Calculate total items in cart
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Calculate total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  // Add order to history (local state only, or save to server if needed)
  const addToOrderHistory = async (orderData) => {
    if (!isAuthenticated || !user?.id) {
      setError('Please login to place order');
      return null;
    }

    try {
      const newOrder = {
        id: `BAGZO${Date.now()}`,
        userId: user.id,
        items: [...cartItems],
        total: getTotalPrice(),
        tax: getTotalPrice() * 0.1,
        shipping: 0,
        finalTotal: getTotalPrice() * 1.1,
        status: 'confirmed',
        date: new Date().toISOString(),
        ...orderData
      };
      
      // Save order to JSON server
      await api.post('/orders', newOrder);
      
      // Clear cart after successful order
      await clearCart();
      
      // Update local state
      setOrderHistory(prev => [newOrder, ...prev]);
      console.log('✅ Order added to history:', newOrder.id);
      return newOrder;
    } catch (error) {
      console.error('🚨 Error saving order:', error);
      setError('Failed to save order');
      return null;
    }
  };

  // Get order by ID
  const getOrderById = (orderId) => {
    return orderHistory.find(order => order.id === orderId);
  };

  // Get recent orders for current user
  const getRecentOrders = (limit = 5) => {
    if (!user?.id) return [];
    const userOrders = orderHistory.filter(order => order.userId === user.id);
    return userOrders.slice(0, limit);
  };

  // Clear order history (local state)
  const clearOrderHistory = () => {
    setOrderHistory([]);
  };

  // Calculate cart summary
  const getCartSummary = () => {
    const subtotal = getTotalPrice();
    const tax = subtotal * 0.1;
    const shipping = 0;
    const total = subtotal + tax + shipping;
    
    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      shipping: shipping.toFixed(2),
      total: total.toFixed(2),
      itemCount: getTotalItems()
    };
  };

  // Check if cart is empty
  const isCartEmpty = () => {
    return cartItems.length === 0;
  };

  // Get cart item count for a specific product
  const getItemQuantity = (productId) => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  // Clear error
  const clearError = () => setError('');

  // Refresh cart manually
  const refreshCart = () => {
    fetchCart();
  };

  // Debug function to check cart state
  const debugCart = () => {
    console.log('🔍 Current Cart State:', {
      user: user?.id,
      items: cartItems,
      totalItems: getTotalItems(),
      totalPrice: getTotalPrice(),
      loading: loading
    });
  };

  const value = {
    // Cart items and operations
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getTotalItems,
    getTotalPrice,
    getCartSummary,
    isCartEmpty,
    getItemQuantity,
    refreshCart,
    
    // Order history operations
    orderHistory,
    addToOrderHistory,
    getOrderById,
    getRecentOrders,
    clearOrderHistory,
    
    // Loading and error states
    loading,
    error,
    clearError,
    
    // Debug
    debugCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
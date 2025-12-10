// Context/WishlistProvider.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthProvider';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const storedWishlist = localStorage.getItem(`wishlist_${user.id}`);
      if (storedWishlist) {
        try {
          setWishlist(JSON.parse(storedWishlist));
        } catch (error) {
          console.error('Error parsing wishlist:', error);
          setWishlist([]);
        }
      }
    } else {
      setWishlist([]);
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(wishlist));
    }
  }, [wishlist, user, isAuthenticated]);

  const addToWishlist = (product) => {
    if (!isAuthenticated) {
      return { success: false, error: 'Please login to add items to wishlist' };
    }

    setLoading(true);
    try {
      const existingItem = wishlist.find(item => item.id === product.id);
      
      if (existingItem) {
        setLoading(false);
        return { success: false, error: 'Item already in wishlist' };
      }

      const newWishlist = [...wishlist, { ...product, addedAt: new Date().toISOString() }];
      setWishlist(newWishlist);
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, error: 'Failed to add item to wishlist' };
    }
  };

  const removeFromWishlist = (productId) => {
    setLoading(true);
    try {
      const newWishlist = wishlist.filter(item => item.id !== productId);
      setWishlist(newWishlist);
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, error: 'Failed to remove item from wishlist' };
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  const getWishlistCount = () => {
    return wishlist.length;
  };

  const value = {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    getWishlistCount,
    hasWishlistItems: wishlist.length > 0
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
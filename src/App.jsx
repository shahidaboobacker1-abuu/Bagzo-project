import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './Authentication/Login'
import Register from './Authentication/Register'
import { AuthProvider } from './Context/AuthProvider'
import Home from './Pages/Home'
import ProductPage from './Pages/ProductPage'
import ProductDetails from './Pages/Productdetails'
import CartPage from './Pages/CartPage'
import { CartProvider } from './Context/CartProvider'
import About from './Pages/About'
import Contact from './Pages/Contact'
import Wishlist from './Pages/Wishlist'
import { WishlistProvider } from './Context/WishlistProvider'
import CheckoutPage from './Pages/CheckOutPage'
import ProtectedRoute from './Admin/Component/ProtecteRoute'
import OrderSuccess from './Pages/Ordersuccsus'
import AdminHome from './Admin/pages/AdminHome'
import ProductManagement from './Admin/pages/ProductManagement'
import UserManagement from './Admin/pages/UserManagemant'
import OrderManagement from './Admin/pages/OrderMangement'
import UserOrders from './Pages/UserOrders'
import OrderDetails from './Pages/OrderDettails'

function App() {

  return (
    <>
    <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path='/' element={<Home />} />
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/register' element={<Register/>}/>
                    <Route path='/products' element={<ProductPage />}/> 
                    <Route path='/product/:id' element={<ProductDetails />}/>
                    <Route path='/cart' element={<CartPage />} />
                    <Route path='/about' element={<About />}/>
                    <Route path='/contact' element={<Contact />}/>
                    <Route path='/wishlist' element={<Wishlist />}/>
                    <Route path='/checkout' element={<CheckoutPage />}/>
                    <Route path='/Order-success' element={<OrderSuccess />}/>
                    <Route path='/orders' element={<UserOrders/>}/> {/* ADD THIS LINE */}
                    <Route path='/userorder' element={<UserOrders/>}/>
                    <Route path='/order/:orderId' element={<OrderDetails/>}/>
                    
                    <Route path='/admin/dashboard' element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminHome />
                      </ProtectedRoute>
                    } />
                    <Route path='/admin/products' element={
                      <ProtectedRoute requiredRole="admin">
                        <ProductManagement />
                      </ProtectedRoute>
                    } />
                    <Route path='/admin/users' element={
                      <ProtectedRoute requiredRole="admin">
                        <UserManagement />
                      </ProtectedRoute>
                    } />
                    <Route path='/admin/orders' element={
                      <ProtectedRoute requiredRole="admin">
                        <OrderManagement />
                      </ProtectedRoute>
                    } />

                    <Route path='/adminhome' element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminHome />
                      </ProtectedRoute>
                    } />
                    <Route path='/adminproducts' element={
                      <ProtectedRoute requiredRole="admin">
                        <ProductManagement />
                      </ProtectedRoute>
                    } />
                    <Route path='/adminuser' element={
                      <ProtectedRoute requiredRole="admin">
                        <UserManagement />
                      </ProtectedRoute>
                    } />
                    <Route path='/adminorder' element={
                      <ProtectedRoute requiredRole="admin">
                        <OrderManagement />
                      </ProtectedRoute>
                    } />
                </Routes>
            </BrowserRouter>
          </CartProvider>
        </WishlistProvider>
    </AuthProvider>
    </>
  )
}

export default App
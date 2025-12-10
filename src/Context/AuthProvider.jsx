// // Context/AuthProvider.js
// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { api } from '../API/Axios';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       try {
//         const userData = JSON.parse(storedUser);
//         setUser(userData);
//       } catch (error) {
//         localStorage.removeItem('user');
//         console.error('Error parsing stored user data:', error);
//       }
//     }
//     setLoading(false);
//   }, []);

//   const register = async (userData) => {
//     try {
//       setError('');
//       setLoading(true);

//       const { cpassword, ...registrationData } = userData;

//       const response = await api.post('/users', {
//         ...registrationData,
//         id: Date.now(),
//         createdAt: new Date().toISOString(),
//         role: 'user', // Default role is 'user'
//         isAdmin: false
//       });

//       const newUser = response.data;
//       setUser(newUser);
//       localStorage.setItem('user', JSON.stringify(newUser));
      
//       return { success: true, user: newUser };
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
//       setError(errorMessage);
//       return { success: false, error: errorMessage };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (email, password) => {
//     try {
//       setError('');
//       setLoading(true);

//       const response = await api.get('/users');
//       const users = response.data;
      
//       const user = users.find(u => u.email === email && u.password === password);
      
//       if (user) {
//         setUser(user);
//         localStorage.setItem('user', JSON.stringify(user));
//         return { success: true, user };
//       } else {
//         const errorMessage = 'Invalid email or password. Please try again.';
//         setError(errorMessage);
//         return { success: false, error: errorMessage };
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
//       setError(errorMessage);
//       return { success: false, error: errorMessage };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('user');
//   };

//   const clearError = () => setError('');

//   // Check user role
//   const isAdmin = () => {
//     return user?.role === 'admin' || user?.isAdmin === true;
//   };

//   const isUser = () => {
//     return user?.role === 'user';
//   };

//   const getUserRole = () => {
//     return user?.role || 'user';
//   };

//   const value = {
//     user,
//     loading,
//     error,
//     register,
//     login,
//     logout,
//     clearError,
//     isAuthenticated: !!user,
//     isAdmin: isAdmin(),
//     isUser: isUser(),
//     getUserRole
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };



// Context/AuthProvider.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../API/Axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // Check if user is blocked even if stored locally
        if (userData.isBlocked) {
          localStorage.removeItem('user');
          setError('Your account has been blocked. Please contact admin.');
          setUser(null);
        } else {
          setUser(userData);
        }
      } catch (error) {
        localStorage.removeItem('user');
        console.error('Error parsing stored user data:', error);
      }
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      setError('');
      setLoading(true);

      const { cpassword, ...registrationData } = userData;

      const response = await api.post('/users', {
        ...registrationData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        role: 'user',
        isAdmin: false,
        isActive: true,
        isBlocked: false
      });

      const newUser = response.data;
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return { success: true, user: newUser };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError('');
      setLoading(true);

      const response = await api.get('/users');
      const users = response.data;
      
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Check if user is blocked
        if (user.isBlocked) {
          const errorMessage = 'Your account has been blocked. Please contact admin.';
          setError(errorMessage);
          return { success: false, error: errorMessage };
        }
        
        // Update user status to active if not already
        if (!user.isActive) {
          await api.patch(`/users/${user.id}`, { isActive: true });
          user.isActive = true;
        }
        
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, user };
      } else {
        const errorMessage = 'Invalid email or password. Please try again.';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const clearError = () => setError('');

  // Check user role
  const isAdmin = () => {
    return user?.role === 'admin' || user?.isAdmin === true;
  };

  const isUser = () => {
    return user?.role === 'user' || user?.role === 'customer';
  };

  const getUserRole = () => {
    return user?.role || 'user';
  };

  // Check if user is blocked
  const isBlocked = () => {
    return user?.isBlocked || false;
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    clearError,
    isAuthenticated: !!user && !user.isBlocked,
    isAdmin: isAdmin(),
    isUser: isUser(),
    isBlocked: isBlocked(),
    getUserRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
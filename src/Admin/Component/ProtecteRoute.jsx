// components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthProvider';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00ADB5]"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check if user has the required role
    if (requiredRole === 'admin' && user.role !== 'admin' && !user.isAdmin) {
        return <Navigate to="/" replace />;
    }

    if (requiredRole === 'user' && (user.role === 'admin' || user.isAdmin)) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
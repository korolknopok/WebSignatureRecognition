import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error("Пользователь не авторизован");
        return <Navigate to="/auth" />;
    }
    return <>{children}</>;
};

export default PrivateRoute;

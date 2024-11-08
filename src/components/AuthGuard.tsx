import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import LoginForm from './LoginForm';

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

    if (!isAuthenticated) {
        return <LoginForm />;
    }

    return <>{children}</>;
}
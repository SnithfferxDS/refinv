import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { authService } from '../services/api';
import { useAuthStore } from '../store/authStore';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const setAuth = useAuthStore((state) => state.setAuth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authService.login({ email, password });
            setAuth(response.user, response.token);
            toast.success('Login successful!');
            window.location.href = '/dashboard';
        } catch (error) {
            toast.error('Invalid credentials');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="
            min-h-screen 
            flex 
            items-center 
            justify-center 
            bg-gradient-to-b 
            from-primary 
            to-secondary
            dark:from-primary-500
            dark:to-secondary-600">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6 text-center">Inicie sesión</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    <p className="text-center text-sm text-gray-500">
                        ¿No tienes una cuenta? <a href="/accounts/register" className="text-blue-500 hover:underline">Registrate</a>
                    </p>
                </form>
            </div>
        </div>
    );
}
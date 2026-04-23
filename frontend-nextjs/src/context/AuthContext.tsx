import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthResponse } from '../services/auth.service';

interface User {
    id: string;
    email: string;
    name: string;
    picture: string;
    role: string;
    phone?: string;
    address?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (authData: AuthResponse) => void;
    logout: () => void;
    isAuthenticated: boolean;
    updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // Rehydrate state from local storage on mount
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
            setToken(storedToken);
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) { /* ignore */ }
        }
    }, []);

    const persistUser = (nextUser: User | null) => {
        if (nextUser) {
            localStorage.setItem('user', JSON.stringify(nextUser));
        } else {
            localStorage.removeItem('user');
        }
    };

    const login = (authData: AuthResponse) => {
        setUser(authData.user);
        setToken(authData.token);
        localStorage.setItem('token', authData.token);
        persistUser(authData.user as User);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        persistUser(null);
    };

    const updateUser = (updates: Partial<User>) => {
        setUser((prev) => {
            if (!prev) return prev;
            const nextUser = { ...prev, ...updates };
            persistUser(nextUser);
            return nextUser;
        });
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

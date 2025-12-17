import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
    username: string;
    email: string;
    cedula: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (username: string, email: string, cedula: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Check for active session
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Check against "database" (localStorage)
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        // Check using EMAIL instead of username
        const foundUser = users.find((u: any) => u.email === email && u.password === password);

        if (foundUser) {
            const userData = {
                username: foundUser.username,
                email: foundUser.email,
                cedula: foundUser.cedula
            };
            setUser(userData);
            localStorage.setItem('currentUser', JSON.stringify(userData));
            return true;
        }
        return false;
    };

    const register = async (username: string, email: string, cedula: string, password: string): Promise<{ success: boolean; message?: string }> => {
        await new Promise(resolve => setTimeout(resolve, 500));

        const users = JSON.parse(localStorage.getItem('users') || '[]');

        // Check duplicates
        if (users.find((u: any) => u.email === email)) {
            return { success: false, message: 'El correo electrónico ya está registrado.' };
        }

        if (users.find((u: any) => u.cedula === cedula)) {
            return { success: false, message: 'La cédula ya está registrada.' };
        }

        const newUser = { username, email, cedula, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Auto login after register
        const userData = { username, email, cedula };
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));

        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
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

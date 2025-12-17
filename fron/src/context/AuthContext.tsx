import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
    username: string;
}

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<boolean>;
    register: (username: string, password: string) => Promise<boolean>;
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

    const login = async (username: string, password: string): Promise<boolean> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Check against "database" (localStorage)
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        // Simple check in array of objects
        const foundUser = users.find((u: any) => u.username === username && u.password === password);

        if (foundUser) {
            const userData = { username: foundUser.username };
            setUser(userData);
            localStorage.setItem('currentUser', JSON.stringify(userData));
            return true;
        }
        return false;
    };

    const register = async (username: string, password: string): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 500));

        const users = JSON.parse(localStorage.getItem('users') || '[]');

        if (users.find((u: any) => u.username === username)) {
            return false; // User exists
        }

        const newUser = { username, password }; // In real app, hash password!
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Auto login after register
        const userData = { username };
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));

        return true;
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

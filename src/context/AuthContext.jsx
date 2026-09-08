import { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

function decodeToken(token) {
    try {
        const payload = token.split(".")[1];
        return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    } catch {
        return null;
    }
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem("admin_user");
        if (savedUser) setUser(JSON.parse(savedUser));
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${API_URL}/auth/login`, { email, password });
            const message = res.data;

            if (typeof message === "string" && message.includes("Login Successful")) {
                const match = message.match(/Your token is:\s*(.+)/);
                const token = match ? match[1].trim() : null;

                if (token) {
                    const decoded = decodeToken(token);
                    if (decoded?.role !== "admin") {
                        toast.error("This account doesn't have admin access!");
                        return false;
                    }
                    const userData = { email, role: decoded.role };
                    localStorage.setItem("admin_token", token);
                    localStorage.setItem("admin_user", JSON.stringify(userData));
                    setUser(userData);
                    toast.success("Welcome back!");
                    return true;
                }
            }

            toast.error(message || "Invalid email or password!");
            return false;
        } catch (error) {
            toast.error(error.response?.data || "Something went wrong!");
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
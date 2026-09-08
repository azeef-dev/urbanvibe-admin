import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await login(email, password);
        setLoading(false);
        if (success) navigate("/products");
    };

    return (
        <div className="min-h-screen w-full bg-[#131121] flex items-center justify-center px-4">
            <div className="w-full max-w-sm bg-[#1c1a2b] border border-white/5 rounded-2xl p-8 shadow-2xl">
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center mb-4">
                        <ShieldCheck className="text-white" size={26} />
                    </div>
                    <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                    <p className="text-sm text-slate-400 mt-1">Sign in to manage your store</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="relative">
                        <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email address"
                            required
                            className="w-full h-11 pl-11 pr-4 rounded-xl bg-[#232135] text-white placeholder-slate-500 text-sm outline-none border border-transparent focus:border-blue-500 transition-colors"
                        />
                    </div>
                    <div className="relative">
                        <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            className="w-full h-11 pl-11 pr-11 rounded-xl bg-[#232135] text-white placeholder-slate-500 text-sm outline-none border border-transparent focus:border-blue-500 transition-colors"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((s) => !s)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white cursor-pointer"
                        >
                            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="h-11 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-2"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}
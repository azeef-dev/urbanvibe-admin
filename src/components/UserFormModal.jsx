import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function UserFormModal({ user, onSubmit, onClose }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setEmail(user.email || "");
            setRole(user.role || "user");
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;
        if (!user && !password) return;

        const data = { email, role };
        if (password) data.password = password;

        try {
            setLoading(true);
            await onSubmit(data);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-[#1c1a2b] border border-white/5 rounded-2xl w-full max-w-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">{user ? "Edit User" : "Add User"}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address"
                        required
                        className="h-10 px-4 rounded-lg bg-[#232135] text-white placeholder-slate-500 text-sm outline-none border border-transparent focus:border-blue-500"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={user ? "New password (leave blank to keep)" : "Password"}
                        className="h-10 px-4 rounded-lg bg-[#232135] text-white placeholder-slate-500 text-sm outline-none border border-transparent focus:border-blue-500"
                    />
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="h-10 px-4 rounded-lg bg-[#232135] text-white text-sm outline-none border border-transparent focus:border-blue-500 cursor-pointer"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>

                    <button type="submit" disabled={loading} className="h-11 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold cursor-pointer disabled:opacity-60 mt-2">
                        {loading ? "Saving..." : user ? "Update User" : "Add User"}
                    </button>
                </form>
            </div>
        </div>
    );
}
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/api";
import StatusBadge from "../components/StatusBadge";
import UserFormModal from "../components/UserFormModal";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get("/api/users");
            setUsers(res.data.users || []);
        } catch {
            toast.error("Failed to load users!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filtered = users.filter((u) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return u.email?.toLowerCase().includes(q) || u.role?.toLowerCase().includes(q);
    });

    const openAdd = () => {
        setEditing(null);
        setShowForm(true);
    };

    const openEdit = (u) => {
        setEditing(u);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this user?")) return;
        try {
            await api.delete(`/api/users/${id}`);
            setUsers((prev) => prev.filter((u) => u._id !== id));
            toast.success("User deleted!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete!");
        }
    };

    const handleSubmit = async (data) => {
        try {
            if (editing) {
                const res = await api.put(`/api/users/${editing._id}`, data);
                setUsers((prev) => prev.map((u) => (u._id === editing._id ? res.data.user : u)));
                toast.success("User updated!");
            } else {
                const res = await api.post("/api/users", data);
                setUsers((prev) => [res.data.user, ...prev]);
                toast.success("User created!");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save user!");
            throw error;
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-white">Users</h1>
                <button onClick={openAdd} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-colors">
                    <Plus size={16} /> Add New
                </button>
            </div>

            <div className="relative mb-4 max-w-xs">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by email or role"
                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#1c1a2b] border border-white/5 text-white placeholder-slate-500 text-sm outline-none focus:border-blue-500 transition-colors"
                />
            </div>

            <div className="bg-[#1c1a2b] border border-white/5 rounded-2xl overflow-hidden overflow-x-auto">
                <table className="w-full text-sm min-w-[560px]">
                    <thead className="text-slate-400 text-left text-xs uppercase tracking-wide">
                        <tr>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Joined</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan={4} className="p-6 text-center text-slate-500">Loading...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={4} className="p-6 text-center text-slate-500">{search ? "No users match your search" : "No users yet"}</td></tr>
                        ) : (
                            filtered.map((u) => (
                                <tr key={u._id} className="hover:bg-white/[0.03] transition-colors">
                                    <td className="p-4 font-medium text-white">{u.email}</td>
                                    <td className="p-4"><StatusBadge value={u.role} /></td>
                                    <td className="p-4 text-slate-400">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => openEdit(u)} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white cursor-pointer">
                                                <Pencil size={15} />
                                            </button>
                                            <button onClick={() => handleDelete(u._id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 cursor-pointer">
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <UserFormModal user={editing} onSubmit={handleSubmit} onClose={() => setShowForm(false)} />
            )}
        </div>
    );
}
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/api";
import { formatPrice } from "../lib/format";
import ProductFormModal from "../components/ProductFormModal";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await api.get("/api/products");
            setProducts(res.data.products || res.data || []);
        } catch {
            toast.error("Failed to load products!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filtered = products.filter((p) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q);
    });

    const openAdd = () => {
        setEditing(null);
        setShowForm(true);
    };

    const openEdit = (p) => {
        setEditing(p);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this product?")) return;
        try {
            await api.delete(`/api/products/${id}`);
            setProducts((prev) => prev.filter((p) => p.id !== id));
            toast.success("Product deleted!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete!");
        }
    };

    const handleSubmit = async (data) => {
        try {
            if (editing) {
                const res = await api.put(`/api/products/${editing.id}`, data);
                setProducts((prev) => prev.map((p) => (p.id === editing.id ? res.data : p)));
                toast.success("Product updated!");
            } else {
                const res = await api.post("/api/products", data);
                setProducts((prev) => [res.data, ...prev]);
                toast.success("Product added!");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save product!");
            throw error;
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-white">Products</h1>
                <button onClick={openAdd} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-colors">
                    <Plus size={16} /> Add New
                </button>
            </div>

            <div className="relative mb-4 max-w-xs">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search Product"
                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#1c1a2b] border border-white/5 text-white placeholder-slate-500 text-sm outline-none focus:border-blue-500 transition-colors"
                />
            </div>

            <div className="bg-[#1c1a2b] border border-white/5 rounded-2xl overflow-hidden overflow-x-auto">
                <table className="w-full text-sm min-w-160">
                    <thead className="text-slate-400 text-left text-xs uppercase tracking-wide">
                        <tr>
                            <th className="p-4">Product</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Rating</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan={5} className="p-6 text-center text-slate-500">Loading...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={5} className="p-6 text-center text-slate-500">{search ? "No products match your search" : "No products yet"}</td></tr>
                        ) : (
                            filtered.map((p) => (
                                <tr key={p.id} className="hover:bg-white/3 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-[#232135] shrink-0" />
                                            <span className="font-medium text-white">{p.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-400 capitalize">{p.category}</td>
                                    <td className="p-4 text-white font-medium">${formatPrice(p.price)}</td>
                                    <td className="p-4 text-slate-400">{p.rating}/5</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white cursor-pointer">
                                                <Pencil size={15} />
                                            </button>
                                            <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 cursor-pointer">
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
                <ProductFormModal product={editing} onSubmit={handleSubmit} onClose={() => setShowForm(false)} />
            )}
        </div>
    );
}
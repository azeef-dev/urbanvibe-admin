import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/api";
import { formatPrice } from "../lib/format";

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered"];

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await api.get("/api/orders");
            setOrders(res.data.orders || []);
        } catch {
            toast.error("Failed to load orders!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const filtered = orders.filter((o) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return (
            String(o.orderId).toLowerCase().includes(q) ||
            o.name?.toLowerCase().includes(q) ||
            o.email?.toLowerCase().includes(q)
        );
    });

    const handleStatusChange = async (id, status) => {
        try {
            const res = await api.put(`/api/orders/${id}/status`, { status });
            setOrders((prev) => prev.map((o) => (o._id === id ? res.data.order : o)));
            toast.success("Status updated!");
        } catch {
            toast.error("Failed to update status!");
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-white">Orders</h1>
            </div>

            <div className="relative mb-4 max-w-xs">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by Order ID, name or email"
                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#1c1a2b] border border-white/5 text-white placeholder-slate-500 text-sm outline-none focus:border-blue-500 transition-colors"
                />
            </div>

            <div className="bg-[#1c1a2b] border border-white/5 rounded-2xl overflow-hidden overflow-x-auto">
                <table className="w-full text-sm min-w-[560px]">
                    <thead className="text-slate-400 text-left text-xs uppercase tracking-wide">
                        <tr>
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan={4} className="p-6 text-center text-slate-500">Loading...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={4} className="p-6 text-center text-slate-500">{search ? "No orders match your search" : "No orders yet"}</td></tr>
                        ) : (
                            filtered.map((o) => (
                                <tr key={o._id} className="hover:bg-white/[0.03] transition-colors">
                                    <td className="p-4 font-medium text-white">#{o.orderId}</td>
                                    <td className="p-4">
                                        <p className="text-white">{o.name}</p>
                                        <p className="text-slate-500 text-xs">{o.email}</p>
                                    </td>
                                    <td className="p-4 text-white font-medium">${formatPrice(o.totalAmount)}</td>
                                    <td className="p-4">
                                        <select
                                            value={o.status || "pending"}
                                            onChange={(e) => handleStatusChange(o._id, e.target.value)}
                                            className="h-9 px-3 rounded-lg bg-[#232135] text-white text-xs outline-none border border-transparent focus:border-blue-500 cursor-pointer"
                                        >
                                            {STATUS_OPTIONS.map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
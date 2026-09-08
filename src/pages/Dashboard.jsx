import { useEffect, useState } from "react";
import { Package, Users, ShoppingBag, DollarSign } from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Legend,
} from "recharts";
import toast from "react-hot-toast";
import api from "../lib/api";
import { formatPrice } from "../lib/format";
import StatusBadge from "../components/StatusBadge";

function formatLabel(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const [statsRes, ordersRes] = await Promise.all([
                    api.get("/api/analytics/stats"),
                    api.get("/api/orders"),
                ]);
                setStats(statsRes.data);
                setOrders(ordersRes.data.orders || []);
            } catch {
                toast.error("Failed to load dashboard!");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const recentOrders = [...orders]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    const chartData = (stats?.signupsByDay || []).map((s, i) => ({
        label: formatLabel(s.date),
        signups: s.count,
        traffic: stats?.trafficByDay?.[i]?.count || 0,
    }));

    if (loading) {
        return (
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white mb-6">Dashboard</h1>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 rounded-2xl bg-[#1c1a2b] border border-white/5 animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-xl sm:text-2xl font-bold text-white">Dashboard</h1>

            {/* Big highlight cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl p-6 bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-between">
                    <div>
                        <p className="text-white/80 text-sm font-medium">Total Revenue</p>
                        <p className="text-white text-3xl font-bold mt-1">${formatPrice(totalRevenue)}</p>
                        <p className="text-white/60 text-xs mt-1">{orders.length} total orders</p>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                        <DollarSign className="text-white" size={26} />
                    </div>
                </div>
                <div className="rounded-2xl p-6 bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-between">
                    <div>
                        <p className="text-white/80 text-sm font-medium">Orders Received</p>
                        <p className="text-white text-3xl font-bold mt-1">{stats?.totalOrders ?? 0}</p>
                        <p className="text-white/60 text-xs mt-1">All time</p>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                        <ShoppingBag className="text-white" size={26} />
                    </div>
                </div>
            </div>

            {/* Small stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-[#1c1a2b] border border-white/5 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-blue-500/15 flex items-center justify-center shrink-0">
                        <Package className="text-blue-400" size={20} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-lg font-bold text-white truncate">{stats?.totalProducts ?? 0}</p>
                        <p className="text-xs text-slate-400">Products</p>
                    </div>
                </div>
                <div className="bg-[#1c1a2b] border border-white/5 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
                        <Users className="text-emerald-400" size={20} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-lg font-bold text-white truncate">{stats?.totalUsers ?? 0}</p>
                        <p className="text-xs text-slate-400">Users</p>
                    </div>
                </div>
                <div className="bg-[#1c1a2b] border border-white/5 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0">
                        <ShoppingBag className="text-amber-400" size={20} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-lg font-bold text-white truncate">{stats?.totalOrders ?? 0}</p>
                        <p className="text-xs text-slate-400">Orders</p>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-[#1c1a2b] border border-white/5 rounded-2xl p-5 sm:p-6">
                <h3 className="font-bold text-white mb-1">Signups & Traffic</h3>
                <p className="text-xs text-slate-500 mb-4">Last 14 days overview</p>
                <div className="w-full h-64 sm:h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="signupsFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="trafficFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#232135" />
                            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ background: "#1c1a2b", border: "1px solid #232135", borderRadius: 12, fontSize: 12, color: "#fff" }} />
                            <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
                            <Area type="monotone" dataKey="signups" name="New Signups" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#signupsFill)" />
                            <Area type="monotone" dataKey="traffic" name="Site Visits" stroke="#3b82f6" strokeWidth={2.5} fill="url(#trafficFill)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent orders */}
            <div className="bg-[#1c1a2b] border border-white/5 rounded-2xl overflow-hidden overflow-x-auto">
                <h3 className="font-bold text-white p-5 pb-0">Recent Orders</h3>
                <table className="w-full text-sm min-w-[520px] mt-4">
                    <thead className="text-slate-400 text-left text-xs uppercase tracking-wide">
                        <tr>
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {recentOrders.length === 0 ? (
                            <tr><td colSpan={4} className="p-6 text-center text-slate-500">No orders yet</td></tr>
                        ) : (
                            recentOrders.map((o) => (
                                <tr key={o._id} className="hover:bg-white/[0.03] transition-colors">
                                    <td className="p-4 font-medium text-white">#{o.orderId}</td>
                                    <td className="p-4">
                                        <p className="text-white">{o.name}</p>
                                        <p className="text-slate-500 text-xs">{o.email}</p>
                                    </td>
                                    <td className="p-4 text-white font-medium">${formatPrice(o.totalAmount)}</td>
                                    <td className="p-4"><StatusBadge value={o.status} /></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
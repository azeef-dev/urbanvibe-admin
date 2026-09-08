import { useState } from "react";
import { X } from "lucide-react";

export default function OrderFormModal({ onSubmit, onClose }) {
    const [form, setForm] = useState({ name: "", email: "", address: "", totalAmount: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.address || !form.totalAmount) return;

        try {
            setLoading(true);
            await onSubmit({
                name: form.name,
                email: form.email,
                address: form.address,
                totalAmount: Number(form.totalAmount),
                items: [],
            });
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-[#1c1a2b] border border-white/5 rounded-2xl w-full max-w-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">Add Order</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Customer name" required className="h-10 px-4 rounded-lg bg-[#232135] text-white placeholder-slate-500 text-sm outline-none border border-transparent focus:border-blue-500" />
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Customer email" required className="h-10 px-4 rounded-lg bg-[#232135] text-white placeholder-slate-500 text-sm outline-none border border-transparent focus:border-blue-500" />
                    <textarea name="address" value={form.address} onChange={handleChange} placeholder="Delivery address" rows={2} required className="px-4 py-3 rounded-lg bg-[#232135] text-white placeholder-slate-500 text-sm outline-none border border-transparent focus:border-blue-500 resize-none" />
                    <input name="totalAmount" type="number" value={form.totalAmount} onChange={handleChange} placeholder="Total amount" required className="h-10 px-4 rounded-lg bg-[#232135] text-white placeholder-slate-500 text-sm outline-none border border-transparent focus:border-blue-500" />

                    <button type="submit" disabled={loading} className="h-11 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold cursor-pointer disabled:opacity-60 mt-2">
                        {loading ? "Creating..." : "Create Order"}
                    </button>
                </form>
            </div>
        </div>
    );
}
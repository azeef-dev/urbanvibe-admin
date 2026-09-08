import { useState, useEffect } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { uploadToCloudinary } from "../lib/uploadToCloudinary";
import { parseDiscountNumber, formatDiscount } from "../lib/format";
import CustomSelect from "./CustomSelect";

const CATEGORY_OPTIONS = [
    { value: "new-arrivals", label: "New Arrivals" },
    { value: "top-selling", label: "Top Selling" },
    { value: "featured", label: "Featured" },
    { value: "you-might-like", label: "You Might Also Like" },
];

const emptyForm = {
    name: "",
    category: "new-arrivals",
    price: "",
    originalPrice: "",
    rating: "4.5",
    discount: "",
    description: "",
    colors: "",
    sizes: "",
};

export default function ProductFormModal({ product, onSubmit, onClose }) {
    const [form, setForm] = useState(emptyForm);
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(product?.image || null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (product) {
            setForm({
                name: product.name || "",
                category: product.category || "new-arrivals",
                price: product.price || "",
                originalPrice: product.originalPrice || "",
                rating: product.rating || "4.5",
                discount: parseDiscountNumber(product.discount),
                description: product.description || "",
                colors: (product.colors || []).join(", "),
                sizes: (product.sizes || []).join(", "),
            });
            setPreview(product.image || null);
        }
    }, [product]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.category || !form.price) return;
        if (!product && !imageFile) return;

        try {
            setLoading(true);
            let imageUrl = product?.image || null;
            if (imageFile) imageUrl = await uploadToCloudinary(imageFile);

            await onSubmit({
                name: form.name,
                category: form.category,
                price: Number(form.price),
                originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
                rating: form.rating ? Number(form.rating) : 4.5,
                discount: formatDiscount(form.discount),
                description: form.description,
                colors: form.colors.split(",").map((c) => c.trim()).filter(Boolean),
                sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
                image: imageUrl,
            });
            onClose();
        } catch {
            toast.error("Upload failed! Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-[#1c1a2b] border border-white/5 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">{product ? "Edit Product" : "Add Product"}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-[#232135] overflow-hidden flex items-center justify-center shrink-0">
                            {preview ? <img src={preview} alt="" className="w-full h-full object-cover" /> : <span className="text-[10px] text-slate-500">No image</span>}
                        </div>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="text-xs text-slate-400 cursor-pointer" />
                    </div>

                    <input name="name" value={form.name} onChange={handleChange} placeholder="Product name" required className="h-10 px-4 rounded-lg bg-[#232135] text-white placeholder-slate-500 text-sm outline-none border border-transparent focus:border-blue-500" />

                    <select name="category" value={form.category} onChange={handleChange} className="h-10 px-4 rounded-lg bg-[#232135] text-white text-sm outline-none border border-transparent focus:border-blue-500 cursor-pointer">
                        {CATEGORY_OPTIONS.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>

                    <div className="grid grid-cols-2 gap-3">
                        <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" required className="h-10 px-4 rounded-lg bg-[#232135] text-white placeholder-slate-500 text-sm outline-none border border-transparent focus:border-blue-500" />
                        <input name="originalPrice" type="number" value={form.originalPrice} onChange={handleChange} placeholder="Original price" className="h-10 px-4 rounded-lg bg-[#232135] text-white placeholder-slate-500 text-sm outline-none border border-transparent focus:border-blue-500" />

                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none">-</span>
                            <input name="discount" type="number" min="0" max="100" value={form.discount} onChange={handleChange} placeholder="20" className="h-10 w-full pl-6 pr-6 rounded-lg bg-[#232135] text-white placeholder-slate-500 text-sm outline-none border border-transparent focus:border-blue-500" />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none">%</span>
                        </div>
                        <input name="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={handleChange} placeholder="Rating" className="h-10 px-4 rounded-lg bg-[#232135] text-white placeholder-slate-500 text-sm outline-none border border-transparent focus:border-blue-500" />
                    </div>

                    <input name="colors" value={form.colors} onChange={handleChange} placeholder="Colors (comma separated hex)" className="h-10 px-4 rounded-lg bg-[#232135] text-white placeholder-slate-500 text-sm outline-none border border-transparent focus:border-blue-500" />
                    <input name="sizes" value={form.sizes} onChange={handleChange} placeholder="Sizes (comma separated)" className="h-10 px-4 rounded-lg bg-[#232135] text-white placeholder-slate-500 text-sm outline-none border border-transparent focus:border-blue-500" />
                    <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" rows={3} className="px-4 py-3 rounded-lg bg-[#232135] text-white placeholder-slate-500 text-sm outline-none border border-transparent focus:border-blue-500 resize-none" />

                    <button type="submit" disabled={loading} className="h-11 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2">
                        {loading ? "Saving..." : product ? "Update Product" : "Add Product"}
                    </button>
                </form>
            </div>
        </div>
    );
}
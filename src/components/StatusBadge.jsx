const STYLES = {
    pending: "bg-amber-500/15 text-amber-400",
    processing: "bg-blue-500/15 text-blue-400",
    shipped: "bg-violet-500/15 text-violet-400",
    delivered: "bg-emerald-500/15 text-emerald-400",
    admin: "bg-blue-500/15 text-blue-400",
    user: "bg-white/10 text-slate-300",
};

export default function StatusBadge({ value }) {
    const key = String(value || "").toLowerCase();
    const style = STYLES[key] || "bg-white/10 text-slate-300";
    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${style}`}>
            {value}
        </span>
    );
}
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export default function CustomSelect({ value, onChange, options, className = "" }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selected = options.find((o) => o.value === value);

    return (
        <div ref={ref} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="w-full h-9 px-3 rounded-lg bg-[#232135] text-white text-xs outline-none border border-transparent hover:border-white/10 focus:border-blue-500 cursor-pointer flex items-center justify-between gap-2 capitalize transition-colors"
            >
                {selected?.label || value}
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <div className="absolute z-30 mt-1.5 w-full min-w-max bg-[#1c1a2b] border border-white/10 rounded-lg shadow-xl overflow-hidden py-1">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                                onChange(opt.value);
                                setOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs capitalize cursor-pointer flex items-center justify-between gap-2 transition-colors ${opt.value === value ? "bg-blue-500 text-white" : "text-slate-300 hover:bg-white/5"
                                }`}
                        >
                            {opt.label}
                            {opt.value === value && <Check size={13} />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
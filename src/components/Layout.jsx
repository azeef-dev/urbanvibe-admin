import { useState, useContext } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, Users, ShoppingBag, LogOut, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/products", label: "Products", icon: Package },
    { to: "/users", label: "Users", icon: Users },
    { to: "/orders", label: "Orders", icon: ShoppingBag },
];

export default function Layout() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            logout();
            navigate("/login");
        }
    };

    return (
        <div className="min-h-screen flex bg-[#131121]">
            {/* DESKTOP SIDEBAR */}
            <aside
                className={`hidden lg:flex flex-col bg-[#0d0c16] border-r border-white/5 shrink-0 transition-all duration-200 ${collapsed ? "w-20" : "w-64"
                    }`}
            >
                <div className={`flex items-center h-16 border-b border-white/5 shrink-0 ${collapsed ? "justify-center" : "justify-between px-6"}`}>
                    {!collapsed && (
                        <span className="text-lg font-black text-white tracking-tight truncate">
                            URBAN<span className="text-blue-500">.ADMIN</span>
                        </span>
                    )}
                    <button
                        onClick={() => setCollapsed((c) => !c)}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white cursor-pointer shrink-0"
                    >
                        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>

                <nav className="flex-1 flex flex-col gap-1 p-4">
                    {navItems.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-colors ${collapsed ? "justify-center px-0" : ""
                                } ${isActive ? "bg-blue-500 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`
                            }
                        >
                            <Icon size={18} className="shrink-0" />
                            {!collapsed && label}
                        </NavLink>
                    ))}
                </nav>

                <div className="border-t border-white/5 p-4">
                    {!collapsed && (
                        <p className="text-xs text-slate-500 truncate mb-2 px-2">{user?.email}</p>
                    )}
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 cursor-pointer w-full ${collapsed ? "justify-center px-0" : ""
                            }`}
                    >
                        <LogOut size={18} className="shrink-0" />
                        {!collapsed && "Logout"}
                    </button>
                </div>
            </aside>

            {/* MOBILE TOPBAR */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[#0d0c16] border-b border-white/5 flex items-center justify-between px-4">
                <span className="text-base font-black text-white">
                    URBAN<span className="text-blue-500">.ADMIN</span>
                </span>
                <button onClick={() => setMobileOpen(true)} className="p-2 text-white cursor-pointer">
                    <Menu size={22} />
                </button>
            </div>

            {/* MOBILE SIDEBAR */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    <div className="w-64 bg-[#0d0c16] flex flex-col h-full">
                        <div className="flex items-center justify-between h-16 px-6 border-b border-white/5">
                            <span className="text-lg font-black text-white">
                                URBAN<span className="text-blue-500">.ADMIN</span>
                            </span>
                            <button onClick={() => setMobileOpen(false)} className="text-slate-400 cursor-pointer">
                                <X size={20} />
                            </button>
                        </div>
                        <nav className="flex-1 flex flex-col gap-1 p-4">
                            {navItems.map(({ to, label, icon: Icon }) => (
                                <NavLink
                                    key={to}
                                    to={to}
                                    onClick={() => setMobileOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer ${isActive ? "bg-blue-500 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
                                        }`
                                    }
                                >
                                    <Icon size={18} />
                                    {label}
                                </NavLink>
                            ))}
                        </nav>
                        <div className="border-t border-white/5 p-4">
                            <button
                                onClick={() => {
                                    setMobileOpen(false);
                                    handleLogout();
                                }}
                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 cursor-pointer w-full"
                            >
                                <LogOut size={18} />
                                Logout
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
                </div>
            )}

            {/* MAIN CONTENT */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 overflow-x-hidden min-w-0">
                <Outlet />
            </main>
        </div>
    );
}
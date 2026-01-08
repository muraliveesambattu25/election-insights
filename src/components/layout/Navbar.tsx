import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Vote, BarChart3, LayoutDashboard, Map, Sparkles, ChevronRight } from "lucide-react";

export function Navbar() {
    const location = useLocation();

    const navItems = [
        {
            name: "Constituencies",
            path: "/",
            icon: LayoutDashboard,
            color: "text-sky-400",
            glow: "shadow-sky-500/20",
        },
        {
            name: "Parties",
            path: "/party-performance",
            icon: BarChart3,
            color: "text-amber-400",
            glow: "shadow-amber-500/20",
        },
        {
            name: "Districts",
            path: "/district-performance",
            icon: Map,
            color: "text-emerald-400",
            glow: "shadow-emerald-500/20",
        },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 w-full animate-fade-in border-b border-white/5 bg-[#0a192f]/90 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] transition-all duration-700">
            <div className="container max-w-screen-2xl flex h-16 items-center justify-between px-6 sm:px-10">
                {/* Logo Section */}
                <Link
                    to="/"
                    className="flex items-center gap-4 group/logo shrink-0"
                >
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-xl blur opacity-25 group-hover/logo:opacity-60 transition duration-1000 group-hover/logo:duration-200"></div>
                        <div className="relative p-2.5 bg-slate-900/50 rounded-xl ring-1 ring-white/20 shadow-2xl backdrop-blur-sm">
                            <Vote className="h-6 w-6 text-blue-400 group-hover/logo:text-white transition-colors" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-black tracking-tighter text-white uppercase leading-none pb-1">
                            AP Election
                        </span>
                        <span className="text-sm font-bold text-sky-400 uppercase tracking-widest leading-none relative overflow-hidden group-hover/logo:text-cyan-300 transition-colors">
                            <span className="relative z-10 group-hover/logo:animate-shimmer bg-gradient-to-r from-sky-400 via-white to-sky-400 bg-[length:200%_100%] bg-clip-text text-transparent">
                                Insights 2024
                            </span>
                        </span>
                    </div>
                </Link>

                {/* Attractive Nav Items */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "relative flex items-center gap-3 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-500 group/item overflow-hidden",
                                    isActive
                                        ? "text-white bg-white/5 ring-1 ring-white/10 shadow-[0_0_20px_rgba(56,189,248,0.15)]"
                                        : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
                                )}
                            >
                                <div className="relative z-10 transition-transform duration-500 group-hover/item:scale-110 group-hover/item:-translate-y-0.5">
                                    <item.icon className={cn(
                                        "h-5 w-5 transition-all duration-500",
                                        isActive ? " " + item.color + " animate-glow" : "opacity-70 group-hover/item:opacity-100",
                                        !isActive && "group-hover/item:text-white"
                                    )} />
                                    {isActive && (
                                        <div className={cn("absolute inset-0 blur-lg opacity-40 scale-150", item.color.replace('text-', 'bg-'))}></div>
                                    )}
                                </div>
                                <span className="relative z-10 hidden lg:inline-block tracking-widest uppercase transition-all duration-500 group-hover/item:tracking-wider">
                                    {item.name}
                                </span>

                                {isActive ? (
                                    <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-transparent via-sky-400 to-transparent animate-pulse shadow-[0_0_10px_rgba(56,189,248,0.5)]" />
                                ) : (
                                    <div className="absolute inset-x-0 bottom-0 h-[2px] w-0 bg-white/20 transition-all duration-300 group-hover/item:w-full" />
                                )}

                                {isActive && (
                                    <div className="absolute -right-2 -top-2 w-8 h-8 bg-sky-500/10 blur-xl rounded-full animate-pulse" />
                                )}
                            </Link>
                        );
                    })}

                    {/* Live Indicator Section */}
                    <div className="ml-4 pl-4 border-l border-white/5 hidden xl:flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                Live
                            </span>
                        </div>
                        <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                    </div>
                </div>
            </div>
        </nav>
    );
}

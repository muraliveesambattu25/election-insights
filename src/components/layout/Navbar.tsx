import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Vote, BarChart3, LayoutDashboard, Map } from "lucide-react";

export function Navbar() {
    const location = useLocation();

    const navItems = [
        {
            name: "Overview",
            path: "/",
            icon: LayoutDashboard,
        },
        {
            name: "Party Performance",
            path: "/party-performance",
            icon: BarChart3,
        },
        {
            name: "District Analysis",
            path: "/district-performance",
            icon: Map,
        },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <Link to="/" className="mr-6 flex items-center space-x-2">
                    <div className="p-1.5 bg-primary rounded-md">
                        <Vote className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="hidden font-bold sm:inline-block">
                        AP Assembly Elections 2024
                    </span>
                </Link>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <nav className="flex items-center space-x-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center text-sm font-medium transition-colors hover:text-foreground/80",
                                    location.pathname === item.path
                                        ? "text-foreground"
                                        : "text-foreground/60"
                                )}
                            >
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </nav>
    );
}

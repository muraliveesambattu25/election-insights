import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export function Layout() {
    return (
        <div className="relative min-h-screen flex flex-col bg-slate-50">
            <Navbar />
            <main className="flex-1 pt-16">
                <Outlet />
            </main>
        </div>
    );
}

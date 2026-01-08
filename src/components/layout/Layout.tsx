import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export function Layout() {
    return (
        <div className="relative min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1">
                <Outlet />
            </div>
        </div>
    );
}

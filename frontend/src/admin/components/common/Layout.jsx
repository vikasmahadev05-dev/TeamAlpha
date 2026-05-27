import { useState, useEffect, useRef, Suspense, useMemo } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Menu, X } from "lucide-react";
import Breadcrumbs from "../../../components/common/Breadcrumbs";
import PageTransition from "../../../components/common/PageTransition";


export default function Layout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isFocusMode, setIsFocusMode] = useState(false);
    
    // Removed complex scroll visibility logic as per user request to prevent overlapping.
    const isVisible = true;

    const backgroundStyle = useMemo(() => ({
        background: `
            radial-gradient(circle at top left, #CFE8D5 0%, transparent 40%),
            radial-gradient(circle at top right, #F6E6B4 0%, transparent 40%),
            radial-gradient(circle at bottom left, #D9CDEB 0%, transparent 40%),
            #FFFFFF
        `,
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
    }), []);

    return (
        <div 
            className="flex min-h-screen font-sans selection:bg-mutedbrown/20 relative"
            style={backgroundStyle}
        >
            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .floating-card-animation {
                    animation: fadeIn 0.4s ease forwards;
                }
                `}
            </style>

            {/* Desktop Sidebar Container (Floating) */}
            {!isFocusMode && (
                <div className="hidden lg:block fixed left-0 top-0 h-screen z-50 p-5 pointer-events-none">
                    <div className="h-full pointer-events-auto floating-card-animation">
                        <Sidebar />
                    </div>
                </div>
            )}

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && !isFocusMode && (
                <div
                    className="lg:hidden fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-[90] animate-in fade-in duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar Content */}
            {!isFocusMode && (
                <div className={`
                    lg:hidden fixed left-0 top-0 h-screen z-[100] transition-transform duration-500 ease-in-out
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                `}>
                    <div className="h-full floating-card-animation">
                        <Sidebar onClose={() => setIsSidebarOpen(false)} />
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className={`flex-1 transition-all duration-500 flex flex-col min-w-0 ${!isFocusMode ? "lg:ml-[280px]" : "ml-0"}`}>
                <div className={`relative z-40 pt-4 md:pt-8 px-4 md:px-10 pb-4 flex flex-col-reverse md:flex-row md:items-center justify-between gap-4 ${isFocusMode ? "hidden" : ""}`}>
                    <div className="floating-card-animation flex justify-center md:justify-start w-full md:w-auto">
                        {!isFocusMode && <Breadcrumbs />}
                    </div>
                    <div className="floating-card-animation w-full md:w-auto flex justify-center md:justify-end">
                        <Topbar onMenuClick={() => setIsSidebarOpen(true)} isVisibleProp={isVisible} />
                    </div>
                </div>

                <main className={`w-full mx-auto transition-all duration-500 ${isFocusMode ? "p-0 max-w-none h-screen flex flex-col justify-center" : "px-4 pt-8 md:px-10 lg:px-12 max-w-[1600px] animate-in fade-in slide-in-from-top-4 duration-1000"}`}>
                    <PageTransition>
                        <Suspense fallback={<div className="flex h-64 w-full items-center justify-center text-xl opacity-50">Loading Dashboard...</div>}>
                            <Outlet context={{ setIsFocusMode }} />
                        </Suspense>
                    </PageTransition>
                </main>

                {!isFocusMode && (
                    <footer className="mt-auto p-8 border-t border-[#e6e3df] text-center">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-warmgray font-bold">
                            Team Alpha Photography © 2026 • Luxury Studio Management
                        </p>
                    </footer>
                )}
            </div>
        </div>
    );
}

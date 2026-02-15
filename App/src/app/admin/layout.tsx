import Link from 'next/link'
import { Shield, Users, BookOpen, LayoutDashboard, LogOut } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20">
            {/* Admin Top Navigation */}
            <nav className="bg-zinc-900 text-white sticky top-0 z-50 shadow-md">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    {/* Logo Area */}
                    <div className="flex items-center gap-6">
                        <Link href="/admin" className="font-bold text-lg flex items-center gap-2 hover:text-indigo-400 transition-colors">
                            <Shield className="w-5 h-5 text-red-500" />
                            Admin Console
                        </Link>

                        <div className="h-6 w-px bg-zinc-700 mx-2 hidden md:block"></div>

                        {/* Main Links */}
                        <div className="hidden md:flex items-center gap-1">
                            <Link
                                href="/admin"
                                className="px-3 py-2 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white text-sm font-medium flex items-center gap-2"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Cockpit
                            </Link>
                            <Link
                                href="/admin/users"
                                className="px-3 py-2 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white text-sm font-medium flex items-center gap-2"
                            >
                                <Users className="w-4 h-4" />
                                User
                            </Link>
                            <Link
                                href="/admin/content"
                                className="px-3 py-2 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white text-sm font-medium flex items-center gap-2"
                            >
                                <BookOpen className="w-4 h-4" />
                                Content
                            </Link>
                        </div>
                    </div>

                    {/* Right Side */}
                    <Link
                        href="/dashboard"
                        className="text-sm font-bold bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Zur App
                    </Link>
                </div>
            </nav>

            {/* Page Content */}
            <main>
                {children}
            </main>
        </div>
    )
}

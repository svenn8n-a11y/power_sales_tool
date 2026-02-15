import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, BookOpen, Trophy, Settings, LogOut, LifeBuoy, Users, Brain, Book } from 'lucide-react'
import LevelProgress from '@/components/dashboard/LevelProgress'
import SidebarLinks from '@/components/dashboard/SidebarLinks'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    // Fetch Profile for Gamification
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="flex h-screen bg-zinc-50 dark:bg-black">
            {/* Sidebar */}
            <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 hidden md:flex flex-col">
                <div className="p-6">
                    <Link href="/dashboard">
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 cursor-pointer hover:opacity-80 transition-opacity">
                            Sales Dojo 🥋
                        </h1>
                    </Link>
                </div>

                <div className="px-6 mb-6">
                    <LevelProgress
                        xp={profile?.xp || 0}
                        level={profile?.level || 1}
                        maxXp={(profile?.level || 1) * 1000}
                    />
                </div>

                <SidebarLinks />

                <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                    <form action="/auth/signout" method="post">
                        <button className="flex items-center gap-3 px-4 py-3 w-full text-zinc-600 hover:bg-zinc-100 rounded-xl dark:text-zinc-400 dark:hover:bg-zinc-900 transition-colors">
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}

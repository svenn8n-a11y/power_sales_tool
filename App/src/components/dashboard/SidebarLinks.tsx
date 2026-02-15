'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BookOpen, Trophy, Settings, LogOut, LifeBuoy, Users, Brain, Book } from 'lucide-react'

export default function SidebarLinks() {
    const pathname = usePathname()

    const isActive = (path: string) => {
        if (path === '/dashboard' && pathname === '/dashboard') return true
        if (path !== '/dashboard' && pathname.startsWith(path)) return true
        return false
    }

    const linkClass = (path: string) => `flex items-center gap-3 px-3 py-2 rounded-lg transition font-medium ${isActive(path)
            ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
        }`

    return (
        <nav className="flex-1 px-4 space-y-2">
            <Link href="/dashboard" className={linkClass('/dashboard')}>
                <LayoutDashboard className="w-5 h-5" />
                <span>Overview</span>
            </Link>
            <Link href="/dashboard/training" className={linkClass('/dashboard/training')}>
                <BookOpen className="w-5 h-5" />
                <span>Training</span>
            </Link>
            <Link href="/dashboard/helper" className={linkClass('/dashboard/helper')}>
                <LifeBuoy className="w-5 h-5" />
                <span>Sales Helper</span>
            </Link>

            <div className="pt-4 pb-2">
                <p className="px-3 text-xs font-bold text-zinc-400 uppercase tracking-wider">Wissen</p>
            </div>

            <Link href="/dashboard/guide/disg" className={linkClass('/dashboard/guide/disg')}>
                <Users className="w-5 h-5" />
                <span>DISG Typen</span>
            </Link>
            <Link href="/dashboard/guide/vark" className={linkClass('/dashboard/guide/vark')}>
                <Brain className="w-5 h-5" />
                <span>Lerntypen</span>
            </Link>
            <Link href="/dashboard/guide/glossary" className={linkClass('/dashboard/guide/glossary')}>
                <Book className="w-5 h-5" />
                <span>Glossar</span>
            </Link>

            <div className="pt-4">
                <Link href="/dashboard/leaderboard" className={linkClass('/dashboard/leaderboard')}>
                    <Trophy className="w-5 h-5" />
                    <span>Leaderboard</span>
                </Link>
            </div>
        </nav>
    )
}

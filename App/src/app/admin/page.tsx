import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Users, BookOpen, Shield, Activity, BarChart3, Settings } from 'lucide-react'

// Admin Dashboard Landing Page
export default async function AdminPage() {
    const supabase = await createClient()

    // 1. Security Check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    // 2. Access Check (DB Role OR Hardcoded Email)
    const isAdmin = profile?.role === 'admin' || user.email === 'sven.n8n@gmail.com'

    if (!isAdmin) {
        return redirect('/dashboard') // Picknicker müssen draußen bleiben
    }

    // 2. Fetch Stats
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
    const { count: lessonCount } = await supabase.from('lessons').select('*', { count: 'exact', head: true })

    // (Optional) Logs / Recent Activity placeholder
    // const { data: logs } = ...

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8">
            <header className="mb-12 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                        <Shield className="text-red-600" />
                        Mission Control
                    </h1>
                    <p className="text-zinc-500">System-Status und Verwaltung.</p>
                </div>
                <Link href="/dashboard" className="text-sm font-bold text-indigo-600 hover:underline">
                    &larr; Zurück zur App
                </Link>
            </header>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-zinc-500 font-bold uppercase">User Gesamt</p>
                            <p className="text-3xl font-bold">{userCount || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-zinc-500 font-bold uppercase">Lektionen</p>
                            <p className="text-3xl font-bold">{lessonCount || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-zinc-500 font-bold uppercase">System Status</p>
                            <p className="text-3xl font-bold text-green-600">Online</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Grid */}
            <h2 className="text-xl font-bold mb-6">Verwaltung</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/admin/content" className="group bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 transition-colors">
                    <div className="flex items-start gap-4">
                        <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-1">Content Manager</h3>
                            <p className="text-zinc-500">Lektionen bearbeiten, neue erstellen oder KI-Texte anpassen.</p>
                        </div>
                    </div>
                </Link>

                <Link href="/admin/users" className="group bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 transition-colors">
                    <div className="flex items-start gap-4">
                        <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                            <Users className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-1">User Verwaltung</h3>
                            <p className="text-zinc-500">Nutzern Levels freischalten, Badges vergeben oder Profile einsehen.</p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    )
}

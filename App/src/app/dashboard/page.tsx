import { createClient } from '@/utils/supabase/server'
import { LayoutDashboard, BookOpen, Trophy, Settings, LogOut, Flame, Zap, ArrowRight, LifeBuoy, Users, Book } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Profil laden
    let profile = null
    if (user) {
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
        profile = data
    }

    // Load User Progress
    const { data: progress } = await supabase
        .from('user_level_progress')
        .select('*')
        .eq('user_id', user.id)
        .single()

    const currentStreak = progress?.current_streak || 0
    const level = profile?.level || 1
    const xp = profile?.xp || 0
    const nextLevelXp = level * 1000
    const progressPercent = Math.min(100, (xp / nextLevelXp) * 100)

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {/* Header / Gamification Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Stats Card */}
                <div className="md:col-span-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Trophy className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-3xl font-bold mb-1">Willkommen zurück! 👋</h1>
                                <p className="text-indigo-100">Bereit für die nächste Session?</p>
                            </div>
                            <div className="text-right bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                                <div className="text-2xl font-bold flex items-center justify-end gap-2">
                                    {currentStreak} <Flame className="w-6 h-6 text-orange-400 fill-orange-400 animate-pulse" />
                                </div>
                                <div className="text-xs font-medium text-indigo-200 uppercase tracking-wider">Tage Streak</div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span>Level {level}</span>
                                <span>{xp} / {nextLevelXp} XP</span>
                            </div>
                            <div className="h-3 bg-black/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${progressPercent}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-indigo-200 mt-2">Noch {nextLevelXp - xp} XP bis Level {level + 1}</p>
                        </div>
                    </div>
                </div>

                {/* Daily Challenge / Action */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-amber-500" />
                            Heute anstehend
                        </h3>
                        <div className="space-y-3">
                            <Link href="/dashboard/training" className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl hover:bg-zinc-100 transition cursor-pointer group">
                                <div className="p-2 bg-white dark:bg-zinc-700 rounded-lg shadow-sm group-hover:scale-110 transition">
                                    <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-zinc-700 dark:text-zinc-200">Training fortsetzen</div>
                                    <div className="text-xs text-zinc-500">Level {level} • Einwandbehandlung</div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-indigo-500" />
                            </Link>

                            <Link href="/dashboard/guide/disg" className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl hover:bg-zinc-100 transition cursor-pointer group">
                                <div className="p-2 bg-white dark:bg-zinc-700 rounded-lg shadow-sm group-hover:scale-110 transition">
                                    <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-zinc-700 dark:text-zinc-200">Wissen auffrischen</div>
                                    <div className="text-xs text-zinc-500">DISG-Profile wiederholen</div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-emerald-500" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Results or Onboarding */}
            {profile?.vark_primary && profile?.disg_primary ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* VARK Result */}
                    <div className="p-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-lg font-medium text-indigo-100">Dein Lernstil (VARK)</h3>
                            <p className="mt-2 text-4xl font-bold">{profile.vark_primary}-Typ</p>
                            <p className="mt-4 text-indigo-100 text-sm opacity-90">
                                {profile.vark_primary === 'V' && 'Visuell - Du lernst durch Sehen.'}
                                {profile.vark_primary === 'A' && 'Auditiv - Du lernst durch Hören.'}
                                {profile.vark_primary === 'R' && 'Read/Write - Du lernst durch Lesen.'}
                                {profile.vark_primary === 'K' && 'Kinästhetisch - Du lernst durch Tun.'}
                            </p>
                        </div>
                        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                    </div>

                    {/* DISG Result */}
                    <div className="p-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl text-white shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-lg font-medium text-emerald-100">Dein Profil (DISG)</h3>
                            <p className="mt-2 text-4xl font-bold">{profile.disg_primary}-Typ</p>
                            <p className="mt-4 text-emerald-100 text-sm opacity-90">
                                {profile.disg_primary === 'D' && 'Dominant - Zielorientiert & direkt.'}
                                {profile.disg_primary === 'I' && 'Initiativ - Begeisternd & kommunikativ.'}
                                {profile.disg_primary === 'S' && 'Stetig - Geduldig & loyal.'}
                                {profile.disg_primary === 'G' && 'Gewissenhaft - Analytisch & präzise.'}
                            </p>
                        </div>
                        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                    </div>
                </div>
            ) : (
                <div className="p-8 mt-8 bg-indigo-50 border border-indigo-100 rounded-2xl dark:bg-indigo-900/20 dark:border-indigo-800 text-center">
                    <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-100">Der Sprechende Hut wartet 🧙‍♂️</h3>
                    <p className="mt-2 text-indigo-700 dark:text-indigo-300">
                        Wir kennen deinen Lerntyp noch nicht. Mach den Test, um das Training freizuschalten.
                    </p>
                    <Link href="/onboarding" className="inline-block mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                        Test starten
                    </Link>
                </div>
            )}

            {/* Quick Access Grid */}
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Schnellzugriff</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/dashboard/helper" className="p-6 bg-gradient-to-br from-indigo-50 to-white dark:from-zinc-800 dark:to-zinc-900 border border-indigo-100 dark:border-zinc-700 rounded-2xl hover:shadow-lg hover:border-indigo-300 transition-all group text-center">
                    <LifeBuoy className="w-8 h-8 mx-auto mb-3 text-indigo-600 group-hover:scale-110 transition" />
                    <div className="font-bold text-gray-900 dark:text-white">Sales Helper</div>
                    <div className="text-xs text-zinc-500 mt-1">Live-Einwand Hilfe</div>
                </Link>
                <Link href="/dashboard/training" className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:shadow-lg hover:border-zinc-300 transition-all group text-center">
                    <BookOpen className="w-8 h-8 mx-auto mb-3 text-zinc-600 dark:text-zinc-400 group-hover:scale-110 transition" />
                    <div className="font-bold text-gray-900 dark:text-white">Academy</div>
                    <div className="text-xs text-zinc-500 mt-1">Alle Lektionen</div>
                </Link>
                <Link href="/dashboard/guide/disg" className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:shadow-lg hover:border-zinc-300 transition-all group text-center">
                    <Users className="w-8 h-8 mx-auto mb-3 text-zinc-600 dark:text-zinc-400 group-hover:scale-110 transition" />
                    <div className="font-bold text-gray-900 dark:text-white">DISG Typen</div>
                    <div className="text-xs text-zinc-500 mt-1">Verhaltens-Profile</div>
                </Link>
                <Link href="/dashboard/guide/glossary" className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:shadow-lg hover:border-zinc-300 transition-all group text-center">
                    <Book className="w-8 h-8 mx-auto mb-3 text-zinc-600 dark:text-zinc-400 group-hover:scale-110 transition" />
                    <div className="font-bold text-gray-900 dark:text-white">Glossar</div>
                    <div className="text-xs text-zinc-500 mt-1">Fachbegriffe A-Z</div>
                </Link>
            </div>
        </div>
    )
}

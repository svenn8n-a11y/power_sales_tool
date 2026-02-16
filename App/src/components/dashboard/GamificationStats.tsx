import { Flame, Trophy, Award, Star } from 'lucide-react'

export default function GamificationStats({ streak, badges, totalXp }: any) {
    // Current Streak Data
    const currentStreak = streak?.current_streak || 0
    const isFire = currentStreak > 0

    // Sort badges by date (newest first)
    const recentBadges = badges?.sort((a: any, b: any) => new Date(b.earned_at).getTime() - new Date(a.earned_at).getTime()).slice(0, 3) || []

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

            {/* STREAK CARD */}
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg shadow-orange-500/20 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2 opacity-80">
                        <Flame className="w-5 h-5" />
                        <span className="text-sm font-bold uppercase tracking-wider">Daily Streak</span>
                    </div>
                    <div className="text-4xl font-black flex items-baseline gap-2">
                        {currentStreak}
                        <span className="text-lg font-medium opacity-80">Tage</span>
                    </div>
                    <p className="text-xs mt-2 opacity-70">Bleib dran! Jeder Tag zählt.</p>
                </div>
                <Flame className="absolute -bottom-4 -right-4 w-32 h-32 text-orange-400 opacity-20 rotate-12" />
            </div>

            {/* XP CARD */}
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2 opacity-80">
                        <Star className="w-5 h-5" />
                        <span className="text-sm font-bold uppercase tracking-wider">Total XP</span>
                    </div>
                    <div className="text-4xl font-black flex items-baseline gap-2">
                        {totalXp}
                        <span className="text-lg font-medium opacity-80">XP</span>
                    </div>
                    <p className="text-xs mt-2 opacity-70">Level-Aufstieg in Kürze...</p>
                </div>
                <Star className="absolute -bottom-4 -right-4 w-32 h-32 text-indigo-400 opacity-20 rotate-12" />
            </div>

            {/* BADGES PREVIEW */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 relative">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-zinc-500">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm font-bold uppercase tracking-wider">Trophäen</span>
                    </div>
                    <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded font-mono text-zinc-500">
                        {badges?.length || 0}
                    </span>
                </div>

                <div className="flex gap-2">
                    {recentBadges.length > 0 ? recentBadges.map((b: any) => (
                        <div key={b.id} className="w-12 h-12 rounded-full bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 flex items-center justify-center text-2xl" title={b.badges?.name}>
                            {/* Map Icons based on name or use generic */}
                            {b.badges?.icon === 'Flame' && '🔥'}
                            {b.badges?.icon === 'Brain' && '🧠'}
                            {b.badges?.icon === 'User' && '👋'}
                            {b.badges?.icon === 'Zap' && '⚡️'}
                            {!['Flame', 'Brain', 'User', 'Zap'].includes(b.badges?.icon) && '🏆'}
                        </div>
                    )) : (
                        <p className="text-sm text-zinc-400 italic">Noch keine Trophäen.</p>
                    )}
                </div>
            </div>

        </div>
    )
}

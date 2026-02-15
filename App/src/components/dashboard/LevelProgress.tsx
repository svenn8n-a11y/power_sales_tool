'use client'

import { Trophy, Star } from 'lucide-react'

interface LevelProgressProps {
    xp: number
    level: number
    maxXp?: number // XP needed for next level (default 1000?)
}

export default function LevelProgress({ xp, level, maxXp = 1000 }: LevelProgressProps) {
    const progress = Math.min(100, (xp / maxXp) * 100)

    return (
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-xl p-4 text-white shadow-lg border border-indigo-700">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400">
                        <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-xs text-indigo-200 uppercase font-bold tracking-wider">Level</span>
                        <div className="text-2xl font-bold leading-none">{level}</div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-indigo-300 mb-1">{xp} / {maxXp} XP</div>
                    <div className="flex gap-0.5">
                        {[...Array(Math.min(3, level))].map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-indigo-950 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <p className="mt-2 text-[10px] text-center text-indigo-300">
                Noch {maxXp - xp} XP bis Level {level + 1}
            </p>
        </div>
    )
}

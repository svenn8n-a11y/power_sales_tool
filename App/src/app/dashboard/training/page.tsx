import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { BookOpen, CheckCircle, Star, Lock, Trophy, HandMetal, MessageCircle, Brain } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
    title: 'Training | Sales Academy',
    description: 'Wähle dein Szenario',
}

// Helper Component for Level Sections
const LevelSection = ({ title, color, icon: Icon, items, description, isLocked, progressMap }: any) => (
    <div className={`mb-16 ${isLocked ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
        <div className="flex items-center gap-4 mb-6">
            <div className={`p-3 rounded-xl ${color} text-white shadow-lg`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                    {title}
                    {isLocked && <span className="text-xs bg-zinc-200 text-zinc-500 px-2 py-1 rounded ml-2">🔒 Locked</span>}
                </h2>
                <p className="text-zinc-500">{description}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items && items.length > 0 ? items.map((lesson: any) => {
                const progress = progressMap.get(lesson.id)
                const isCompleted = progress?.completed
                const completedTypes = progress?.completed_types || []
                const currentScore = progress?.score || 0
                // Default Points per Level (approx)
                const maxScore = lesson.level === 1 ? 20 : lesson.level === 2 ? 40 : 80

                // Color Logic for Bar
                const getTypeColor = (type: string) => {
                    switch (type) {
                        case 'D': return 'bg-red-500'
                        case 'I': return 'bg-yellow-400'
                        case 'S': return 'bg-green-500'
                        case 'G': return 'bg-blue-500'
                        default: return 'bg-zinc-200'
                    }
                }

                return (
                    <div
                        key={lesson.id}
                        className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full relative"
                    >
                        {/* Link Wrap */}
                        <Link href={`/dashboard/training/${lesson.slug}`} className="absolute inset-0 z-10" />

                        {/* Status Badge Top Right */}
                        <div className="absolute top-4 right-4 flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-lg text-xs font-bold z-20">
                            <span className={isCompleted ? 'text-yellow-500' : 'text-zinc-400'}>
                                {currentScore}/{maxScore}
                            </span>
                            {isCompleted && <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />}
                        </div>

                        <div className="mb-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                                {lesson.category} • {lesson.slug.split('_')[0]}
                            </span>
                            <h3 className="font-bold text-lg mt-1 group-hover:text-indigo-600 transition-colors">
                                {lesson.title}
                            </h3>
                        </div>

                        {/* Progress Bar Mini */}
                        <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                            <div className="flex h-2 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                {['D', 'I', 'S', 'G'].map(t => (
                                    <div key={t} className={`flex-1 transition-colors ${completedTypes.includes(t) ? getTypeColor(t) : 'bg-transparent'}`} />
                                ))}
                            </div>
                            <div className="flex justify-between text-xs text-zinc-400">
                                <span>{completedTypes.length}/4 Typen</span>
                                {isCompleted ? <span className="text-green-500 font-bold">Meister!</span> : <span>In Arbeit</span>}
                            </div>
                        </div>
                    </div>
                )
            }) : (
                <div className="col-span-full py-8 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-zinc-200">
                    <p className="text-zinc-500 italic">Noch keine Lektionen in diesem Level.</p>
                </div>
            )}
        </div>
    </div>
)

export default async function TrainingPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // 1. Load Lessons
    const { data: lessons } = await supabase
        .from('lessons')
        .select('*')
        .order('slug', { ascending: true }) // Order by P-Number

    // 2. Load Progress
    const { data: allProgress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user?.id)

    const progressMap = new Map(allProgress?.map(p => [p.lesson_id, p]))

    // 3. Stats Calculation
    const totalLessons = lessons?.length || 0
    const completedLessons = allProgress?.filter(p => p.completed).length || 0
    const totalPoints = allProgress?.reduce((acc, curr) => acc + (curr.score || 0), 0) || 0

    // 4. Manual Grouping (Robust & Case Insensitive)

    // Helper to clean up junk (e.g. 'batch 1', 'p001' duplicates)
    // We only want slugs that look like 'p001_...' OR are clearly valid.
    const validLessons = lessons?.filter(l =>
        !l.slug.startsWith('batch') &&
        l.slug.length > 5 // "p001" is 4 chars, "p001_" is 5+. 
    ) || []

    const level1 = validLessons.filter(l => {
        const s = l.slug.toUpperCase()
        return l.level === 1 || (s >= 'P001' && s <= 'P012_Z') // _Z padding to include P012_something
    })

    const level2 = validLessons.filter(l => {
        const s = l.slug.toUpperCase()
        return l.level === 2 || (s >= 'P031' && s <= 'P060_Z')
    })

    const level3 = validLessons.filter(l => {
        const s = l.slug.toUpperCase()
        return l.level === 3 || (s >= 'P061' && s <= 'P100_Z')
    })

    const level4 = validLessons.filter(l => {
        const s = l.slug.toUpperCase()
        return l.level === 4 || s >= 'P101'
    })

    return (
        <div className="max-w-7xl mx-auto pb-20 space-y-12">

            {/* Header Stats */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-zinc-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-4xl font-black tracking-tight mb-2">Training Center 🥋</h1>
                    <p className="text-zinc-400">Meistere die 4 Stufen des Verkaufs.</p>
                </div>

                <div className="flex gap-8 relative z-10">
                    <div className="text-center">
                        <div className="text-3xl font-black text-yellow-400">{totalPoints}</div>
                        <div className="text-xs uppercase font-bold tracking-wider opacity-60">XP Punkte</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-black text-indigo-400">{completedLessons}/{totalLessons}</div>
                        <div className="text-xs uppercase font-bold tracking-wider opacity-60">Lektionen</div>
                    </div>
                </div>

                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            </div>

            {/* LEVELS */}
            <LevelSection
                title="Level 1: Typ erkennen (Awareness)"
                description="Lerne zu hören, welcher Persönlichkeitstyp (DISG) vor dir steht."
                color="bg-emerald-500"
                icon={Brain}
                items={level1}
                progressMap={progressMap}
                isLocked={false}
            />

            <LevelSection
                title="Level 2: Einstieg & Pitch"
                description="Der perfekte erste Eindruck."
                color="bg-amber-500"
                icon={MessageCircle}
                items={level2}
                progressMap={progressMap}
                isLocked={false} // Todo: Lock based on Level 1 completion
            />

            <LevelSection
                title="Level 3: Einwandbehandlung"
                description="Die Königsdisziplin. Kontern Sie jeden Einwand."
                color="bg-red-500"
                icon={HandMetal}
                items={level3}
                progressMap={progressMap}
                isLocked={false}
            />

            <LevelSection
                title="Level 4: Closing"
                description="Den Sack zumachen."
                color="bg-purple-600"
                icon={CheckCircle}
                items={level4}
                progressMap={progressMap}
                isLocked={false}
            />

            {/* DEBUG SECTION (User Requested) */}
            <div className="mt-20 p-8 bg-zinc-100 border border-zinc-300 rounded overflow-auto font-mono text-xs">
                <h3 className="font-bold mb-2 text-red-600">🛠 DEBUG INFO</h3>
                <p>Total Lessons: {lessons?.length}</p>
                <p>Level 1 Count: {level1.length}</p>
                <p>Level 2 Count: {level2.length}</p>
                <p>Level 3 Count: {level3.length}</p>
                <p>Level 4 Count: {level4.length}</p>
                <div className="mt-4">
                    <strong>Sample Slugs (First 10):</strong>
                    <ul className="list-disc pl-4">
                        {lessons?.slice(0, 10).map(l => (
                            <li key={l.id}>{l.slug} (Level in DB: {l.level})</li>
                        ))}
                    </ul>
                </div>
            </div>

        </div>
    )
}

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Play, CheckCircle, Brain, MessageCircle, HandMetal } from 'lucide-react'

// Helper Component for Level Sections
const LevelSection = ({ title, color, icon: Icon, items, description, isLocked }: any) => (
    <div className={`mb-12 ${isLocked ? 'opacity-50 grayscale' : ''}`}>
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
                // const isCompleted = lesson.completed_lessons?.length > 0
                const isCompleted = false // Temporarily disabled
                return (
                    <div
                        key={lesson.id}
                        className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>
                                {isCompleted ? 'Gelöst ✅' : 'Offen'}
                            </span>
                            <span className="text-xs font-mono text-zinc-400">{lesson.slug}</span>
                        </div>

                        <h3 className="font-bold text-lg mb-2 flex-1">
                            {lesson.title}
                        </h3>

                        <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                            {isLocked ? (
                                <div className="flex items-center gap-2 text-sm text-zinc-500 cursor-not-allowed">
                                    <span>🔒 Benötigt Level-Up</span>
                                </div>
                            ) : (
                                <Link
                                    href={`/dashboard/training/${lesson.slug}`}
                                    className="flex items-center justify-center gap-2 w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg font-bold transition text-sm"
                                >
                                    <Play className="w-4 h-4 fill-current" />
                                    Lektion starten
                                </Link>
                            )}
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

    if (!user) return redirect('/login')

    // Load User Profile for Level Check
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Load all Lessons
    // REMOVED completed_lessons join for stability
    const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .order('title', { ascending: true })

    console.log('--- DEEP DEBUG LESSONS ---')
    if (lessons && lessons.length > 0) {
        const l = lessons[0]
        console.log('Sample Lesson:', {
            id: l.id,
            slug: l.slug,
            level: l.level,
            stage: l.stage,
            is_locked_check: (!l.stage && !l.level)
        })
    } else {
        console.log('No lessons found in array')
    }
    console.log('---------------------')

    // Group lessons by stage
    // Note: If migration wasn't run, stage/level might be null. We treat null as Objection (Level 3) or Intro (Level 1) depending on fallback logic.
    // Here we use explicit checks.
    // Group lessons by stage
    // Note: If migration wasn't run, stage/level might be null.
    // KEY FIX: Treat unclassified lessons as Intro (Level 1) so they are unlocked.
    const stages = {
        intro: lessons?.filter(l => l.stage === 'intro' || l.level === 1 || (!l.stage && !l.level)) || [], // Fallback here
        pitch: lessons?.filter(l => l.stage === 'pitch' || l.level === 2) || [],
        objection: lessons?.filter(l => l.stage === 'objection' || l.level === 3) || [],
        closing: lessons?.filter(l => l.stage === 'closing' || l.level === 4) || []
    }

    const userLevel = profile?.level || 1

    return (
        <div className="max-w-7xl mx-auto pb-20">
            <div className="mb-12">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Training Center 🥋</h1>
                <p className="text-zinc-500">Meistern Sie die 4 Stufen des Verkaufs.</p>
            </div>

            <LevelSection
                title="Level 1: Grundlagen & Mindset"
                color="bg-emerald-500"
                icon={Brain}
                items={stages.intro}
                description="Wie Sie professionell auftreten und Vertrauen aufbauen."
                isLocked={false}
            />

            <LevelSection
                title="Level 2: Eröffnung & Pitch"
                color="bg-amber-500"
                icon={MessageCircle}
                items={stages.pitch}
                description="Der perfekte Einstieg und die Bedarfsanalyse."
                isLocked={userLevel < 2}
            />

            <LevelSection
                title="Level 3: Einwandbehandlung"
                color="bg-red-500"
                icon={HandMetal}
                items={stages.objection}
                description="Herzstück: Die 125 häufigsten Einwände meistern."
                isLocked={userLevel < 3}
            />

            <LevelSection
                title="Level 4: Closing & Verhandlung"
                color="bg-purple-600"
                icon={CheckCircle}
                items={stages.closing}
                description="Den Sack zumachen und Konditionen verhandeln."
                isLocked={userLevel < 4}
            />
        </div>
    )
}

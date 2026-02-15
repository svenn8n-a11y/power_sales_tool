import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Play, FileText, Mic, HandMetal } from 'lucide-react'

export default async function TrainingPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return redirect('/login')

    // Profil laden für Anpassung
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    const varkType = profile?.vark_primary || 'R' // Default: Read
    const disgType = profile?.disg_primary || 'D' // Default: Dominant

    // Mock Content basierend auf Typ
    const getContentRecommendation = () => {
        if (varkType === 'V') return { icon: Play, text: 'Video-Lektion', desc: 'Schau dir die Techniken an.' }
        if (varkType === 'A') return { icon: Mic, text: 'Audio-Training', desc: 'Hör dir echte Gespräche an.' }
        if (varkType === 'K') return { icon: HandMetal, text: 'Interaktives Rollenspiel', desc: 'Probier es direkt aus.' }
        return { icon: FileText, text: 'Lese-Material', desc: 'Lies die Strategie-Details.' }
    }

    const rec = getContentRecommendation()
    const Icon = rec.icon

    // Load Lessons
    const { data: lessons } = await supabase
        .from('lessons')
        .select('id, title, slug, category, meta_json')
        .order('id', { ascending: true })

    const featuredLesson = lessons?.find(l => l.slug.includes('001')) || lessons?.[0]

    return (
        <div className="space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Dein Trainings-Plan</h1>
                <p className="mt-2 text-zinc-500">
                    Maßgeschneidert für deinen
                    <span className="font-bold text-indigo-600 dark:text-indigo-400"> {varkType}-Lernstil</span> und
                    <span className="font-bold text-emerald-600 dark:text-emerald-400"> {disgType}-Persönlichkeit</span>.
                </p>
            </div>

            {/* Featured Lesson */}
            {featuredLesson && (
                <div className="relative overflow-hidden rounded-2xl bg-zinc-900 shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 mix-blend-overlay"></div>
                    <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-4 max-w-xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium ring-1 ring-indigo-500/20">
                                <Icon className="w-4 h-4" />
                                {rec.text}
                            </div>
                            <h2 className="text-3xl font-bold text-white">{featuredLesson.title}</h2>
                            <p className="text-zinc-300 text-lg">
                                {featuredLesson.meta_json?.disg_profile || 'Meistere diesen Einwand mit der perfekten Strategie.'}
                            </p>
                            <Link href={`/dashboard/training/${featuredLesson.slug}`} className="mt-4 px-6 py-3 bg-white text-zinc-900 rounded-lg font-bold hover:bg-zinc-100 transition flex items-center gap-2 inline-flex">
                                <Play className="w-5 h-5 fill-current" />
                                Jetzt Starten
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Modules Grid */}
            <h2 className="text-xl font-bold mt-12 mb-6">Alle Module ({lessons?.length || 0})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lessons?.map((lesson) => (
                    <Link key={lesson.id} href={`/dashboard/training/${lesson.slug}`} className="group block p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition cursor-pointer">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                                <span className="font-bold">{lesson.id}</span>
                            </div>
                            <span className="text-xs font-bold px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-500">
                                {lesson.category || 'Basics'}
                            </span>
                        </div>
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {lesson.title}
                        </h3>
                        <p className="text-sm text-zinc-500 line-clamp-2">
                            {lesson.meta_json?.disg_profile || 'Klicke hier, um das Modul zu starten.'}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

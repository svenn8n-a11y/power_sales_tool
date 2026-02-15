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

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Dein Trainings-Plan</h1>
                <p className="mt-2 text-zinc-500">
                    Maßgeschneidert für deinen
                    <span className="font-bold text-indigo-600 dark:text-indigo-400"> {varkType}-Lernstil</span> und
                    <span className="font-bold text-emerald-600 dark:text-emerald-400"> {disgType}-Persönlichkeit</span>.
                </p>
            </div>

            {/* Featured Lesson */}
            <div className="relative overflow-hidden rounded-2xl bg-zinc-900 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 mix-blend-overlay"></div>
                <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4 max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium ring-1 ring-indigo-500/20">
                            <Icon className="w-4 h-4" />
                            {rec.text}
                        </div>
                        <h2 className="text-3xl font-bold text-white">Einwandbehandlung: "Zu teuer"</h2>
                        <p className="text-zinc-300 text-lg">
                            {disgType === 'D' || disgType === 'G'
                                ? 'Faktenbasiert: Der ROI-Rechner zeigt dem Kunden mathematisch, warum er Geld verliert, wenn er nicht kauft.'
                                : 'Beziehungsbasiert: Wie du dem Kunden das Gefühl gibst, eine smarte Investition in seine Zukunft zu tätigen.'}
                        </p>
                        <Link href="/dashboard/training/1" className="mt-4 px-6 py-3 bg-white text-zinc-900 rounded-lg font-bold hover:bg-zinc-100 transition flex items-center gap-2 inline-flex">
                            <Play className="w-5 h-5 fill-current" />
                            Jetzt Starten
                        </Link>
                    </div>
                </div>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="group p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition cursor-pointer">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                                <span className="font-bold">{i}</span>
                            </div>
                            <span className="text-xs font-mono text-zinc-400">15 min</span>
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Modul {i}: Grundlagen</h3>
                        <p className="text-sm text-zinc-500 line-clamp-2">
                            Lerne die Basics der modernen Verkaufspsychologie kennen.
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

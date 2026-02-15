import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ArrowLeft, Calculator, MessageCircle, Play, CheckCircle, HandMetal, FileText } from 'lucide-react'
import Link from 'next/link'
import LessonInteractive from './LessonInteractive'
import AdaptiveText from '@/components/dashboard/AdaptiveText'
// import { adaptLessonContent } from '@/app/actions/ai' // REMOVED (not needed here anymore)

export default async function LessonPage({ params }: { params: { lessonId: string } }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return redirect('/login')

    // Profil laden
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    const vark = profile?.vark_primary || 'R'
    const disg = profile?.disg_primary || 'D'

    // Load Lesson Content
    const { data: lesson, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('slug', params.lessonId)
        .single()

    if (error || !lesson) {
        // Fallback or Redirect
        return <div className="p-8 text-center text-red-500">Lektion nicht gefunden: {params.lessonId}</div>
    }

    // Parse Content if needed (it comes as JSONB from DB, Supabase types might handle it)
    // We expect lesson to have: title, subtitle (maybe in meta_json?), disg_matrix, vark_content

    // --- AI ADAPTATION LAYER ---
    const industry = profile?.industry || 'Workwear'
    const product = profile?.product_details?.name || 'Workwear Management'
    const targetAudience = profile?.product_details?.target || 'Geschäftsführer'

    // 1. Adapt Strategy (DISG)
    const rawStrategy = lesson.disg_matrix?.[disg]?.intent || 'Strategie laden...'
    const adaptedStrategy = await adaptLessonContent(rawStrategy, industry, product, targetAudience)

    // 2. Adapt Scenario (VARK)
    const rawScenario = lesson.vark_content?.[vark] || lesson.vark_content?.['R'] || ''
    const adaptedScenario = await adaptLessonContent(rawScenario, industry, product, targetAudience)

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div>
                <Link href="/dashboard/training" className="text-sm text-zinc-500 hover:text-indigo-600 flex items-center gap-2 mb-4">
                    <ArrowLeft className="w-4 h-4" /> Zurück zur Übersicht
                </Link>
                <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider dark:bg-indigo-900/30 dark:text-indigo-300">
                        Modul 1
                    </span>
                    <span className="text-zinc-400 text-sm">Adaptiv angepasst für: {disg}-{vark}</span>
                </div>
                <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">{lesson.title}</h1>
                <p className="mt-4 text-xl text-zinc-600 dark:text-zinc-300">
                    {lesson.meta_json?.disg_profile || 'Lerne diesen Einwand zu meistern.'}
                </p>
            </div>

            {/* ADAPTIVE SECTION: DISG (Personality) */}
            <div className={`p-8 rounded-2xl border-l-4 shadow-sm ${disg === 'G' || disg === 'D'
                ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/10'
                : 'bg-amber-50 border-amber-500 dark:bg-amber-900/10'
                }`}>
                <h3 className={`text-lg font-bold mb-4 ${disg === 'G' || disg === 'D' ? 'text-blue-900 dark:text-blue-100' : 'text-amber-900 dark:text-amber-100'
                    }`}>
                    {disg === 'G' ? '📊 Fakten & Logik (Für den Gewissenhaften)' :
                        disg === 'D' ? '🎯 Bottom Line (Für den Dominanten)' :
                            disg === 'I' ? '✨ Die Story (Für den Initiativen)' :
                                '🤝 Beziehungsebene (Für den Stetigen)'}
                </h3>

                <div className="prose dark:prose-invert">
                    {/* Dynamic DISG Content */}
                    <p className="text-lg italic mb-4">
                        "<AdaptiveText initialText={rawStrategy} context={context} />"
                    </p>

                    <div className="bg-white/50 dark:bg-black/20 p-4 rounded-lg">
                        <h4 className="font-bold text-sm uppercase opacity-70 mb-2">Deine Strategie:</h4>
                        <p>{lesson.disg_matrix?.[disg]?.tone || 'Sei professionell.'}</p>
                    </div>

                    <div className="mt-4">
                        <h4 className="font-bold text-sm uppercase opacity-70 mb-2">Körpersprache & Wording:</h4>
                        <p>{lesson.disg_matrix?.[disg]?.body_lang}</p>
                        <p className="font-mono text-sm mt-2 bg-zinc-100 dark:bg-zinc-800 p-2 rounded">
                            "{lesson.disg_matrix?.[disg]?.wording}"
                        </p>
                    </div>
                </div>
            </div>

            {/* ADAPTIVE SECTION: VARK (Learning Style) */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    {vark === 'K' ? <HandMetal className="w-6 h-6 text-purple-600" /> :
                        vark === 'V' ? <Play className="w-6 h-6 text-purple-600" /> :
                            <FileText className="w-6 h-6 text-purple-600" />}

                    {vark === 'K' ? 'Deine Übung (Praxis)' :
                        vark === 'V' ? 'Videomaterial' :
                            'Theorie & Text'}
                </h3>

                {/* INTERACTIVE COMPONENT - Client Side */}
                <LessonInteractive
                    lessonId={params.lessonId}
                    vark={vark}
                    disg={disg}
                    userId={user.id}
                    varkContent={{ ...lesson.vark_content, [vark]: rawScenario }}
                // context={context} // TODO: Update LessonInteractive to use context if we want deep adaptation inside options
                />
            </div>

            {/* Standard Strategy (Always visible) */}
            <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <h3 className="text-xl font-bold mb-4">Die Kern-Strategie</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <span className="text-2xl mb-2 block">👂</span>
                        <h4 className="font-bold">1. Zuhören</h4>
                        <p className="text-sm text-zinc-500">Nicht unterbrechen. Ausreden lassen.</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <span className="text-2xl mb-2 block">🔍</span>
                        <h4 className="font-bold">2. Hinterfragen</h4>
                        <p className="text-sm text-zinc-500">"Womit genau vergleichen Sie uns?"</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <span className="text-2xl mb-2 block">🚀</span>
                        <h4 className="font-bold">3. Wert zeigen</h4>
                        <p className="text-sm text-zinc-500">ROI steht im Mittelpunkt.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}


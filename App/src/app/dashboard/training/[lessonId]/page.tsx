import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ArrowLeft, Calculator, MessageCircle, Play, CheckCircle, HandMetal, FileText } from 'lucide-react'
import Link from 'next/link'
import LessonInteractive from './LessonInteractive'
import AdaptiveText from '@/components/dashboard/AdaptiveText'
// import { adaptLessonContent } from '@/app/actions/ai' // REMOVED (not needed here anymore)

export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
    const { lessonId } = await params
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

    // Decode Slug (URL safe -> Human readable)
    const slug = decodeURIComponent(lessonId)
    console.log("Loading Lesson:", slug)

    // Load Lesson Content
    const { data: lesson, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('slug', slug)
        .single()

    if (error || !lesson) {
        console.error("Lesson fetch error:", error, slug)
        return (
            <div className="p-12 text-center">
                <h2 className="text-xl font-bold text-red-500 mb-2">Lektion nicht gefunden 😕</h2>
                <p className="text-zinc-500 mb-4">Gesucht wurde nach: <code className="bg-zinc-100 p-1 rounded pr-12">{slug}</code></p>
                <Link href="/dashboard/training" className="text-indigo-600 hover:underline">
                    &larr; Zurück zur Übersicht
                </Link>
            </div>
        )
    }

    // Parse Content if needed (it comes as JSONB from DB, Supabase types might handle it)
    // We expect lesson to have: title, subtitle (maybe in meta_json?), disg_matrix, vark_content

    // --- AI ADAPTATION LAYER ---
    const context = {
        industry: profile?.industry || 'Workwear',
        product: profile?.product_details?.name || 'Workwear Management',
        target: profile?.product_details?.target || 'Geschäftsführer',
        disg: disg
    }

    // 4. Load User Progress (for "Completed Types")
    const { data: progress } = await supabase
        .from('user_progress')
        .select('completed_types, completed')
        .match({ user_id: user.id, lesson_id: lessonId })
        .single()

    const completedTypes = progress?.completed_types || []

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div>
                <Link href="/dashboard/training" className="text-sm text-zinc-500 hover:text-indigo-600 flex items-center gap-2 mb-4">
                    <ArrowLeft className="w-4 h-4" /> Zurück zur Übersicht
                </Link>
                <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider dark:bg-indigo-900/30 dark:text-indigo-300">
                        {lesson.stage || 'Training'}
                    </span>
                    {progress?.completed && (
                        <span className="flex items-center gap-1 text-green-600 font-bold text-sm">
                            <CheckCircle className="w-4 h-4" /> Abgeschlossen
                        </span>
                    )}
                </div>
                <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">{lesson.title}</h1>
                <p className="mt-4 text-xl text-zinc-600 dark:text-zinc-300">
                    {lesson.meta_json?.disg_profile || 'Meistere diesen Einwand für alle Persönlichkeitstypen.'}
                </p>
            </div>

            {/* NEW INTERACTIVE TYPE TRAINING */}
            <LessonInteractive
                lessonId={lessonId}
                userId={user.id}
                disgMatrix={lesson.disg_matrix}
                fullContent={lesson.content}
                initialCompletedTypes={completedTypes}
            />

        </div>
    )
}


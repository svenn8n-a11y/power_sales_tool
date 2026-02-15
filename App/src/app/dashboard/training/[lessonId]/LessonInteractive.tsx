'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { HandMetal, Play, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface LessonInteractiveProps {
    lessonId: string
    vark: string
    disg: string
    userId: string
    varkContent: any // JSON from DB
}

export default function LessonInteractive({ lessonId, vark, disg, userId, varkContent }: LessonInteractiveProps) {
    const supabase = createClient()
    const router = useRouter()
    const [selectedOption, setSelectedOption] = useState<string | null>(null)
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string, detail: string } | null>(null)
    const [loading, setLoading] = useState(false)

    // Szenario: "Zu teuer"
    // Je nach DISG Typ könnte man die "richtige" Antwort leicht variieren, 
    // aber hier nehmen wir eine universell gute "Best Practice" Antwort, 
    // die aber stilistisch zum Typ passt? 
    // Vereinfachung: Eine fachlich richtige Antwort, aber die User müssen den "Ton" treffen?
    // Oder einfach: Fachlich richtiges Verhalten (Isolieren, Wert zeigen).

    // TODO: Load real options from DB (requires schema update)
    // For now, we reuse the "Too Expensive" options as placeholders for logic testing.
    const options = [
        {
            id: 'A',
            text: "Das verstehe ich. Aber bedenken Sie unsere hohe Qualität und den Premium-Support, den Sie sonst nirgends bekommen.",
            isCorrect: false,
            feedback: "Zu defensiv! Du rechtfertigst den Preis sofort ('Aber...'). Das wirkt unsicher. Der Kunde hört nur: 'Ja, wir sind teuer.'",
        },
        {
            id: 'B',
            text: "Verstehe. Wenn wir den Preis mal kurz beiseite lassen – passt die Lösung denn ansonsten technisch genau für Sie?",
            isCorrect: true,
            feedback: "Perfekt! Du isolierst den Einwand. Wenn er 'Ja' sagt, ist es nur noch Verhandlungssache. Wenn er 'Nein' sagt, war der Preis nur ein Vorwand.",
        },
        {
            id: 'C',
            text: "Okay, das ist natürlich ein Punkt. Wo genau liegt denn Ihre Schmerzgrenze? Vielleicht kann ich am Preis noch was machen.",
            isCorrect: false,
            feedback: "Vorsicht! Du bietest sofort Rabatt an, ohne den Wert verteidigt zu haben. Du verbrennst Marge und wirkst bedürftig.",
        }
    ]

    const handleSelect = async (optionId: string) => {
        if (loading) return
        setSelectedOption(optionId)

        const option = options.find(o => o.id === optionId)!

        if (option.isCorrect) {
            setFeedback({
                type: 'success',
                message: 'Stark!',
                detail: option.feedback
            })
            // Save Progress
            await saveProgress(100)
        } else {
            setFeedback({
                type: 'error',
                message: 'Nicht ganz...',
                detail: option.feedback
            })
            // Save Attempt (Score 0)
            await saveProgress(0)
        }
    }

    const saveProgress = async (score: number) => {
        setLoading(true)
        try {
            // Upsert Progress
            // Wir nutzen upsert, um bestehende Scores zu überschreiben oder Attempts zu inkrementieren
            // Complex Logic: Holen wir erst den alten Progress?
            // Vereinfacht: Einfach Score updaten. Wünschenswert wäre MAX Score zu behalten.

            // Check existing
            const { data: existing } = await supabase
                .from('user_progress')
                .select('score, attempts')
                .match({ user_id: userId, lesson_id: lessonId })
                .single()

            const newAttempts = (existing?.attempts || 0) + 1
            const bestScore = Math.max(existing?.score || 0, score)
            const completed = bestScore >= 100

            await supabase
                .from('user_progress')
                .upsert({
                    user_id: userId,
                    lesson_id: lessonId,
                    score: bestScore,
                    attempts: newAttempts,
                    completed: completed,
                    last_attempt_at: new Date().toISOString()
                }, { onConflict: 'user_id, lesson_id' })

            if (score >= 100) {
                // Trigger Confetti or something?
                router.refresh() // Update Server Components (e.g. Stats)
            }

        } catch (err) {
            console.error('Save error:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* KINESTHETIC / INTERACTIVE CONTAINER */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <div className="p-6 bg-indigo-600 text-white">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                            {vark === 'K' ? 'K' : 'Ü'}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">
                                {vark === 'K' ? 'Deine Simulation' : 'Praxis-Übung'}
                            </h3>
                            <p className="text-indigo-200 text-sm">Entscheide dich für die beste Reaktion.</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    {/* Scenario */}
                    <div className="mb-8 p-4 bg-zinc-50 dark:bg-black rounded-lg border-l-4 border-indigo-500 italic text-zinc-700 dark:text-zinc-300">
                        "{varkContent?.[vark] || varkContent?.['R'] || 'Szenario wird geladen...'}"
                    </div>

                    <p className="font-bold mb-4 text-zinc-900 dark:text-white">Wie reagierst du?</p>

                    <div className="space-y-3">
                        {options.map((opt) => {
                            const isSelected = selectedOption === opt.id
                            const showResult = !!feedback && isSelected

                            // Style Logic:
                            // Neutral if nothing selected or this wasn't selected
                            // If selected and feedback exists: Green if correct, Red if wrong

                            let borderClass = "border-zinc-200 dark:border-zinc-700 hover:border-indigo-500"
                            let bgClass = "bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
                            let icon = null

                            if (isSelected && feedback) {
                                if (feedback.type === 'success') {
                                    borderClass = "border-green-500 bg-green-50 dark:bg-green-900/10"
                                    icon = <CheckCircle className="w-5 h-5 text-green-500" />
                                } else {
                                    borderClass = "border-red-500 bg-red-50 dark:bg-red-900/10"
                                    icon = <XCircle className="w-5 h-5 text-red-500" />
                                }
                            } else if (feedback) {
                                // Deactivate others
                                bgClass = "opacity-50 cursor-not-allowed bg-zinc-50 dark:bg-zinc-900"
                            }

                            return (
                                <button
                                    key={opt.id}
                                    onClick={() => !feedback && handleSelect(opt.id)}
                                    disabled={!!feedback}
                                    className={`w-full text-left p-5 rounded-xl border-2 transition-all group relative ${borderClass} ${bgClass}`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm shrink-0 
                                            ${isSelected ? (feedback?.type === 'success' ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600') : 'border-zinc-300 text-zinc-400'}
                                        `}>
                                            {opt.id}
                                        </div>
                                        <div className="flex-1">
                                            <span className={`block ${isSelected && feedback ? 'font-bold' : ''}`}>
                                                {opt.text}
                                            </span>
                                        </div>
                                        {icon}
                                    </div>
                                </button>
                            )
                        })}
                    </div>

                    {/* FEEDBACK AREA */}
                    {feedback && (
                        <div className={`mt-8 p-6 rounded-xl animate-in fade-in slide-in-from-bottom-4 ${feedback.type === 'success'
                            ? 'bg-green-100 text-green-900 dark:bg-green-900/20 dark:text-green-100'
                            : 'bg-red-100 text-red-900 dark:bg-red-900/20 dark:text-red-100'
                            }`}>
                            <h4 className="font-bold text-lg flex items-center gap-2 mb-2">
                                {feedback.type === 'success' ? 'Richtig!' : 'Vorsicht!'}
                            </h4>
                            <p className="text-lg">{feedback.detail}</p>

                            {feedback.type === 'error' && (
                                <button
                                    onClick={() => {
                                        setFeedback(null)
                                        setSelectedOption(null)
                                    }}
                                    className="mt-4 px-4 py-2 bg-white text-red-900 text-sm font-bold rounded-lg shadow-sm hover:bg-red-50 transition"
                                >
                                    Nochmal versuchen
                                </button>
                            )}

                            {feedback.type === 'success' && (
                                <div className="mt-4 flex gap-4">
                                    <button
                                        className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition shadow-lg"
                                        onClick={() => router.push('/dashboard/training')}
                                    >
                                        Lektion abschließen
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

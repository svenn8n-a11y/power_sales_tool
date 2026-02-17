'use client'

import { useState, useMemo } from 'react'
import { createClient } from '@/utils/supabase/client'
import { CheckCircle, Trophy, XCircle, ChevronRight, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import DeepContent from './DeepContent'
import confetti from 'canvas-confetti'
import { generateFlashcardsForLesson } from '@/app/actions/spaced_repetition'

interface LessonInteractiveProps {
    lessonId: string
    userId: string
    disgMatrix: any // The full DISG matrix from DB
    fullContent: any // The deep content (psychology etc)
    initialCompletedTypes: string[] // 'D', 'I' etc.
    level?: number // Current Level (1, 2, 3) to calc points
}

export default function LessonInteractive({ lessonId, userId, disgMatrix, fullContent, initialCompletedTypes, level = 1 }: LessonInteractiveProps) {
    const supabase = createClient()
    const router = useRouter()

    // State
    const [selectedType, setSelectedType] = useState<string | null>(null)
    const [completedTypes, setCompletedTypes] = useState<string[]>(initialCompletedTypes || [])
    const [quizState, setQuizState] = useState<'IDLE' | 'ANSWERED_CORRECT' | 'ANSWERED_WRONG'>('IDLE')
    const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    // Derived Constants
    const allTypes = ['D', 'I', 'S', 'G']
    const isLessonComplete = allTypes.every(t => completedTypes.includes(t))
    const pointsPerType = level === 1 ? 5 : level === 2 ? 10 : 20
    const maxPoints = pointsPerType * 4
    const currentPoints = completedTypes.length * pointsPerType

    // --- QUIZ GENERATION (The Matrix Hack) ---
    const quizOptions = useMemo(() => {
        if (!selectedType || !disgMatrix) return []

        // Content Logic:
        // Level 1: "Typ erkennen" -> Show Customer Quote (wording)
        // Level 3+: "Einwand behandeln" -> Show Strategy/Intent (as proxy for answer)
        const useIntentAsAnswer = level >= 3

        const getAnswerText = (type: string) => {
            const data = disgMatrix[type]
            if (!data) return "Keine Daten."

            // NEW: Use Response Framework if available (Prioritize Anchor)
            if (data.response_framework) {
                if (data.response_framework['Anchor']) return "⚓️ " + data.response_framework['Anchor']
                if (data.response_framework['Power-Satz']) return "💪 " + data.response_framework['Power-Satz']
                // Fallback: Use the first available value
                return Object.values(data.response_framework)[0] as string
            }

            if (useIntentAsAnswer) {
                return data.intent || "Strategie..."
            } else {
                return data.quote || data.wording || "Zitat..."
            }
        }

        const correctAnswer = {
            id: selectedType,
            text: getAnswerText(selectedType),
            isCorrect: true,
            type: selectedType
        }

        const wrongAnswers = allTypes
            .filter(t => t !== selectedType)
            .map(t => ({
                id: t,
                text: getAnswerText(t),
                isCorrect: false,
                type: t
            }))

        // Shuffle
        return [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5)
    }, [selectedType, disgMatrix, level])

    // --- HANDLERS ---

    const handleSelectType = (type: string) => {
        // If switching types, reset quiz unless already completed
        if (selectedType !== type) {
            setSelectedType(type)
            if (completedTypes.includes(type)) {
                setQuizState('ANSWERED_CORRECT') // Show content directly if already done
            } else {
                setQuizState('IDLE')
                setSelectedAnswerId(null)
            }
        }
    }

    const handleAnswer = async (answerId: string, isCorrect: boolean) => {
        if (loading || quizState === 'ANSWERED_CORRECT') return
        setSelectedAnswerId(answerId)

        if (isCorrect) {
            setQuizState('ANSWERED_CORRECT')
            if (selectedType && !completedTypes.includes(selectedType)) {
                // Save Progress
                const newCompleted = [...completedTypes, selectedType]
                setCompletedTypes(newCompleted)
                await saveProgress(newCompleted)

                // Trigger Confetti if this was the last one
                if (newCompleted.length === 4) {
                    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
                }
            }
        } else {
            setQuizState('ANSWERED_WRONG')
        }
    }

    const saveProgress = async (newCompletedTypes: string[]) => {
        setLoading(true)
        try {
            const isNowComplete = newCompletedTypes.length === 4
            const score = newCompletedTypes.length * pointsPerType

            await supabase.from('user_progress').upsert({
                user_id: userId,
                lesson_id: lessonId,
                completed_types: newCompletedTypes,
                completed: isNowComplete,
                last_attempt_at: new Date().toISOString(),
                score: score
            }, { onConflict: 'user_id, lesson_id' })

            if (isNowComplete) {
                // Trigger for all 4 types
                // We cast to any to avoid strict type checks on the matrix structure for now
                Object.values(disgMatrix as any).forEach((data: any) => {
                    generateFlashcardsForLesson(lessonId, data)
                })

                router.refresh()
            }
        } catch (err) {
            console.error('Save error:', err)
        } finally {
            setLoading(false)
        }
    }

    // Colors Helper
    const getTypeColor = (type: string) => {
        switch (type) {
            case 'D': return 'bg-red-500 border-red-600 text-white'
            case 'I': return 'bg-yellow-400 border-yellow-500 text-black'
            case 'S': return 'bg-green-500 border-green-600 text-white'
            case 'G': return 'bg-blue-500 border-blue-600 text-white'
            default: return 'bg-zinc-200'
        }
    }

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'D': return 'Dominant (Rot)'
            case 'I': return 'Initiativ (Gelb)'
            case 'S': return 'Stetig (Grün)'
            case 'G': return 'Gewissenhaft (Blau)'
            default: return type
        }
    }

    return (
        <div className="space-y-8">

            {/* 1. PROGRESS BAR & STATUS */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm flex items-center justify-between">
                <div>
                    <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Dein Punktestand</div>
                    <div className={`text-2xl font-black flex items-center gap-2 ${isLessonComplete ? 'text-yellow-500' : 'text-zinc-700 dark:text-zinc-200'}`}>
                        {currentPoints} <span className="text-zinc-400 text-sm font-normal">/ {maxPoints}</span>
                        {isLessonComplete && <Star className="fill-yellow-500 text-yellow-500 w-6 h-6 animate-pulse" />}
                    </div>
                </div>

                {/* Visual Segments */}
                <div className="flex gap-1">
                    {allTypes.map(t => (
                        <div key={t} className={`w-8 h-2 rounded-full transition-all ${completedTypes.includes(t) ? getTypeColor(t).split(' ')[0] : 'bg-zinc-200 dark:bg-zinc-800'}`} />
                    ))}
                </div>
            </div>

            {/* 2. TYPE SELECTOR (Cockpit) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {allTypes.map(type => {
                    const isActive = selectedType === type
                    const isDone = completedTypes.includes(type)

                    return (
                        <button
                            key={type}
                            onClick={() => handleSelectType(type)}
                            className={`
                                relative p-6 rounded-xl border-b-4 transition-all duration-200 transform hover:-translate-y-1 text-left
                                ${isActive ? 'ring-2 ring-offset-2 ring-indigo-500 scale-105 shadow-xl z-10' : 'hover:shadow-md opacity-90 hover:opacity-100'}
                                ${getTypeColor(type)}
                                ${isDone && !isActive ? 'opacity-60 saturate-50' : ''}
                            `}
                        >
                            {isDone && <CheckCircle className="absolute top-2 right-2 w-5 h-5 opacity-50" />}
                            <span className="text-2xl font-black block mb-1">{type}</span>
                            <span className="text-xs uppercase font-bold opacity-80">{getTypeLabel(type)}</span>
                        </button>
                    )
                })}
            </div>

            {/* 3. QUIZ AREA */}
            {selectedType && disgMatrix?.[selectedType] && (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-lg">

                        <div className="mb-8">
                            <h3 className="text-xl font-bold mb-2">Der Kunde ({getTypeLabel(selectedType)}) sagt:</h3>
                            <div className="text-lg italic text-zinc-600 dark:text-zinc-400 border-l-4 border-indigo-500 pl-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-r">
                                "{disgMatrix[selectedType]?.intent || "Ich bin skeptisch..."}"
                            </div>
                            <p className="mt-4 font-bold text-zinc-800 dark:text-white">
                                Welche Antwort überzeugt diesen Typen am meisten?
                            </p>
                        </div>

                        {/* ANSWER OPTIONS */}
                        <div className="space-y-3">
                            {quizOptions.map((opt) => {
                                const isSelected = selectedAnswerId === opt.id
                                const showResult = quizState !== 'IDLE'

                                let containerClass = "border-zinc-200 hover:border-indigo-400 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                                if (showResult) {
                                    if (opt.isCorrect && (isSelected || quizState === 'ANSWERED_CORRECT')) {
                                        containerClass = "border-green-500 bg-green-50 dark:bg-green-900/20"
                                    } else if (isSelected && !opt.isCorrect) {
                                        containerClass = "border-red-500 bg-red-50 dark:bg-red-900/20"
                                    } else {
                                        containerClass = "opacity-50 grayscale"
                                    }
                                }

                                return (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleAnswer(opt.id, opt.isCorrect)}
                                        disabled={showResult}
                                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${containerClass}`}
                                    >
                                        <div className="flex gap-3">
                                            <div className="mt-1">
                                                {showResult && opt.isCorrect ? <CheckCircle className="text-green-500 w-5 h-5" /> :
                                                    showResult && isSelected && !opt.isCorrect ? <XCircle className="text-red-500 w-5 h-5" /> :
                                                        <div className="w-5 h-5 rounded-full border border-zinc-300" />}
                                            </div>
                                            <span className="text-zinc-800 dark:text-zinc-200">{opt.text}</span>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>

                        {/* WRONG ANSWER FEEDBACK */}
                        {quizState === 'ANSWERED_WRONG' && (
                            <div className="mt-6 p-4 bg-red-50 text-red-800 rounded-lg animate-in fade-in">
                                <strong>Das passt nicht ganz!</strong><br />
                                Diese Antwort würde eher zu einem anderen Typen passen. Überlege: Was braucht ein <u>{getTypeLabel(selectedType)}</u>?
                                <button onClick={() => { setQuizState('IDLE'); setSelectedAnswerId(null) }} className="block mt-2 text-red-600 underline font-bold">Nochmal versuchen</button>
                            </div>
                        )}

                    </div>

                    {/* 4. UNLOCKED DEEP CONTENT */}
                    {quizState === 'ANSWERED_CORRECT' && (
                        <div className="mt-8 animate-in slide-in-from-bottom-8 duration-500">
                            <div className="flex items-center gap-2 mb-4 text-green-600 font-bold">
                                <Trophy className="w-6 h-6" />
                                <span>Klasse! Framework freigeschaltet.</span>
                            </div>
                            <DeepContent
                                content={fullContent}
                                selectedDisg={selectedType}
                                disgContent={disgMatrix[selectedType]} // Pass specific data
                            />
                        </div>
                    )}
                </div>
            )}

            {/* 5. COMPLETION SCREEN (Winner's Circle) */}
            {isLessonComplete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-500">
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 max-w-lg w-full shadow-2xl border-4 border-yellow-400 text-center relative overflow-hidden">

                        {/* Decor */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500" />
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none" />

                        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-bounce" />

                        <h2 className="text-3xl font-black mb-2 text-zinc-900 dark:text-white">Lektion gemeistert!</h2>
                        <p className="text-zinc-500 mb-6 text-lg">
                            Du hast alle 4 Typen erfolgreich erkannt/bearbeitet.
                            <br />
                            <span className="font-bold text-green-600 flex items-center justify-center gap-1 mt-2">
                                <CheckCircle className="w-4 h-4" /> Fortschritt gespeichert.
                            </span>
                        </p>

                        <div className="grid gap-3">
                            <button
                                onClick={() => router.push('/dashboard/training')}
                                className="w-full py-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                Zurück zur Übersicht
                            </button>

                            {/* TODO: Logic for Next Lesson ID */}
                            <button
                                onClick={() => router.push('/dashboard/training')} // Placeholder for Next
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                            >
                                Nächste Lektion <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {!selectedType && (
                <div className="text-center py-12 text-zinc-400">
                    <p>Wähle einen Typen um das Training zu starten.</p>
                </div>
            )}

            {/* DATA DEBUGGER */}
            <div className="mt-12 p-4 bg-gray-100 rounded text-xs font-mono overflow-auto max-h-64 border border-gray-300">
                <strong>DEBUG DATA (Matrix):</strong>
                <pre>{JSON.stringify(disgMatrix, null, 2)}</pre>
            </div>

        </div>
    )
}

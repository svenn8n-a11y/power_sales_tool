import { createClient } from '@/utils/supabase/server'
import { CheckCircle, Clock, Brain, RotateCcw, ThumbsUp, ThumbsDown } from 'lucide-react'
import DailyReviewClient from './DailyReviewClient'

export default async function DailyReviewPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return <div>Bitte einloggen.</div>

    // Fetch due cards
    // Logic: next_review_at <= NOW() OR next_review_at IS NULL (new cards)
    const now = new Date().toISOString()

    const { data: cards } = await supabase
        .from('user_flashcards')
        .select('*')
        .eq('user_id', user.id)
        .or(`next_review_at.lte.${now},next_review_at.is.null`)
        .order('next_review_at', { ascending: true })
        .limit(20) // Limit daily load

    return (
        <div className="max-w-2xl mx-auto pb-20">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-black text-zinc-900 dark:text-white flex items-center justify-center gap-2">
                    <Brain className="w-8 h-8 text-indigo-500" />
                    Daily Review
                </h1>
                <p className="text-zinc-500">
                    {cards && cards.length > 0
                        ? `${cards.length} Karten warten auf dich.`
                        : "Alles erledigt für heute! 🎉"}
                </p>
            </div>

            {cards && cards.length > 0 ? (
                <DailyReviewClient cards={cards} />
            ) : (
                <div className="text-center p-12 bg-green-50 rounded-2xl border border-green-100">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-green-800">Klasse gemacht!</h3>
                    <p className="text-green-600">Du hast dein Pensum für heute erfüllt.</p>
                </div>
            )}
        </div>
    )
}

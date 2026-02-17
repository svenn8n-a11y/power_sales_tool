'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// SM-2 Algorithm Implementation
// Returns new interval, repetition count, and easiness factor
export async function calculateSM2(
    quality: number, // 0-5 rating from user
    prevInterval: number,
    prevRepetitions: number,
    prevEasiness: number
) {
    let interval = 0
    let repetitions = prevRepetitions
    let easiness = prevEasiness

    if (quality >= 3) {
        if (prevRepetitions === 0) {
            interval = 1
        } else if (prevRepetitions === 1) {
            interval = 6
        } else {
            interval = Math.round(prevInterval * prevEasiness)
        }
        repetitions += 1
    } else {
        repetitions = 0
        interval = 1
    }

    easiness = prevEasiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    if (easiness < 1.3) easiness = 1.3

    return { interval, repetitions, easiness }
}

// Action: Generate Flashcards from a Lesson
export async function generateFlashcardsForLesson(lessonId: string, disgContent: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Extract key learnings from DISG content
    // We create 2 cards: Anchor & Power-Satz
    const cards = []

    if (disgContent.response_framework) {
        if (disgContent.response_framework['Anchor']) {
            cards.push({
                user_id: user.id,
                lesson_id: lessonId,
                front: `⚓️ Anker-Technik für diesen Typen?`,
                back: disgContent.response_framework['Anchor'],
                category: 'Anchor'
            })
        }
        if (disgContent.response_framework['Power-Satz']) {
            cards.push({
                user_id: user.id,
                lesson_id: lessonId,
                front: `💪 Power-Satz für diesen Typen?`,
                back: disgContent.response_framework['Power-Satz'],
                category: 'Power-Satz'
            })
        }
    }

    if (cards.length > 0) {
        const { error } = await supabase.from('user_flashcards').insert(cards)
        if (error) console.error('Error generating cards:', error)
        else console.log(`Generated ${cards.length} flashcards for lesson ${lessonId}`)
    }
}

// Action: Submit a Review
export async function submitCardReview(cardId: string, quality: number) {
    const supabase = await createClient()

    // 1. Get current card state
    const { data: card } = await supabase.from('user_flashcards').select('*').eq('id', cardId).single()
    if (!card) return

    // 2. Calculate new state
    const { interval, repetitions, easiness } = await calculateSM2(
        quality,
        card.interval || 0,
        card.repetitions || 0,
        card.easiness_factor || 2.5
    )

    // 3. Set next review date
    const nextReview = new Date()
    nextReview.setDate(nextReview.getDate() + interval)

    // 4. Update DB
    await supabase.from('user_flashcards').update({
        interval,
        repetitions,
        easiness_factor: easiness,
        next_review_at: nextReview.toISOString(),
        last_reviewed_at: new Date().toISOString()
    }).eq('id', cardId)

    revalidatePath('/dashboard/daily')
}

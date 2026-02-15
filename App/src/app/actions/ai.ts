'use server'

import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { createClient } from '@/utils/supabase/server'

export async function adaptLessonContent(
    originalText: string,
    industry: string,
    product: string,
    targetAudience: string
) {
    if (!originalText) return ''
    if (!industry || industry === 'Workwear') return originalText // No adaptation needed

    try {
        const { text } = await generateText({
            model: openai('gpt-4o-mini'),
            system: `You are a sales training expert. 
            Your task is to rewrite a sales objection scenario to fit a specific industry context.
            Keep the didactic meaning, the length, and the tone exactly the same. 
            Only change the product-specific nouns and verbs.
            
            Current Context: Selling 'Workwear Management' (Textiles, Laundry Service)
            Target Context: Selling '${product}' in the '${industry}' industry to '${targetAudience}'.
            
            Return ONLY the rewritten text. No explanations.`,
            prompt: originalText,
            temperature: 0.7,
        })

        return text
    } catch (error) {
        console.error("AI Adaptation Failed:", error)
        return originalText // Fallback to original
    }
}

export async function generateHelperResponse(
    userId: string,
    objection: string,
    type: string,
    industry: string
) {
    const supabase = await createClient()
    const today = new Date().toISOString().split('T')[0]

    // 1. Check Rate Limit
    const { data: usage } = await supabase
        .from('daily_ai_usage')
        .select('count')
        .eq('user_id', userId)
        .eq('usage_date', today)
        .single()

    const count = usage?.count || 0
    if (count >= 3) {
        throw new Error("Tageslimit erreicht (3/3). Komm morgen wieder! 🌙")
    }

    // 2. Generate Content
    const systemPrompt = `You are a world-class sales coach specializing in the DISG model.
    The user is facing an objection in the '${industry}' industry.
    Target Personality: '${type}' (D, I, S, or G).
    
    Task: Provide a short, tactical response strategy.
    Structure:
    1. Analysis: Why they say this (1 sentence).
    2. Strategy: How to react (keywords).
    3. Word-for-Word: A perfect sentence to say back.
    
    Keep it concise and practical.`

    const { text } = await generateText({
        model: openai('gpt-4o-mini'),
        system: systemPrompt,
        prompt: `Objection: "${objection}"`,
        temperature: 0.7,
    })

    // 3. Increment Usage
    if (usage) {
        await supabase.from('daily_ai_usage').update({ count: count + 1 }).eq('user_id', userId).eq('usage_date', today)
    } else {
        await supabase.from('daily_ai_usage').insert({ user_id: userId, usage_date: today, count: 1 })
    }

    return text
}

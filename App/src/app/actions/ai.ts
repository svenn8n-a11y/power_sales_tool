'use server'

import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

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

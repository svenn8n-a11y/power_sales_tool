'use client'

import { useState, useEffect } from 'react'
import { Sparkles, RefreshCcw } from 'lucide-react'
import { adaptLessonContent } from '@/app/actions/ai'

interface AdaptiveTextProps {
    initialText: string
    context: {
        industry: string
        product: string
        target: string
        disg: string
    }
    fallback?: string
}

export default function AdaptiveText({ initialText, context, fallback }: AdaptiveTextProps) {
    const [adaptedText, setAdaptedText] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let isMounted = true

        const fetchAdaptation = async () => {
            // Don't adapt if standard context
            if (context.industry === 'Workwear' || !initialText) {
                setLoading(false)
                return
            }

            try {
                // Call Server Action
                const text = await adaptLessonContent(
                    initialText,
                    context.industry,
                    context.product,
                    context.target
                )
                if (isMounted) setAdaptedText(text)
            } catch (err) {
                console.error("AI Adaptation failed", err)
            } finally {
                if (isMounted) setLoading(false)
            }
        }

        fetchAdaptation()

        return () => { isMounted = false }
    }, [initialText, context.industry]) // Re-run if context changes

    if (context.industry === 'Workwear') {
        return <span>{initialText}</span>
    }

    if (loading) {
        return (
            <span className="animate-pulse bg-indigo-50 dark:bg-indigo-900/20 rounded px-1">
                {initialText}
                <Sparkles className="inline-block w-3 h-3 ml-1 text-indigo-400 animate-spin" />
            </span>
        )
    }

    return (
        <span className="relative group cursor-help">
            <span className="text-indigo-900 dark:text-indigo-100 font-medium decoration-indigo-200 underline decoration-dotted underline-offset-4">
                {adaptedText || initialText}
            </span>
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                Original (Workwear): "{initialText}"
            </span>
        </span>
    )
}

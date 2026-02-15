'use client'

import { useState } from 'react'
import { Search, Sparkles, BookOpen, Save } from 'lucide-react'
import { generateHelperResponse } from '@/app/actions/ai'
import { createClient } from '@/utils/supabase/client'

export default function HelperPage() {
    const [query, setQuery] = useState('')
    const [type, setType] = useState('D')
    const [results, setResults] = useState<any[]>([])
    const [generated, setGenerated] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [aiLoading, setAiLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Search in DB
    const handleSearch = async () => {
        setLoading(true)
        setGenerated(null)
        setError(null)
        const supabase = createClient()

        try {
            // Search in title and category
            const { data, error } = await supabase
                .from('lessons')
                .select('*')
                .or(`title.ilike.%${query}%,category.ilike.%${query}%`)
                .limit(5)

            if (error) throw error
            setResults(data || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // Generate with AI
    const handleGenerate = async () => {
        setAiLoading(true)
        setError(null)
        try {
            const { data: { user } } = await createClient().auth.getUser()
            if (!user) return

            // Get profile for context
            const supabase = createClient()
            const { data: profile } = await supabase.from('profiles').select('industry').eq('id', user.id).single()

            const text = await generateHelperResponse(
                user.id,
                query,
                type,
                profile?.industry || 'General'
            )
            setGenerated(text)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setAiLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                    <Sparkles className="text-indigo-500" />
                    Sales Helper
                </h1>
                <p className="text-zinc-500 mt-2">
                    Dein Spickzettel für das echte Leben. Suche nach Einwänden oder nutze den KI-Joker (3x täglich).
                </p>
            </div>

            {/* Input Area */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">Was sagt der Kunde?</label>
                        <input
                            type="text"
                            placeholder="z.B. 'Das haben wir intern schon gelöst'..."
                            className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                    <div className="w-full md:w-48">
                        <label className="block text-sm font-medium mb-1">Typ (DISG)</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                        >
                            <option value="D">Dominant (Rot)</option>
                            <option value="I">Initiativ (Gelb)</option>
                            <option value="S">Stetig (Grün)</option>
                            <option value="G">Gewissenhaft (Blau)</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-4 mt-6">
                    <button
                        onClick={handleSearch}
                        disabled={!query || loading}
                        className="flex-1 py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
                    >
                        <Search className="w-5 h-5" />
                        In Bibliothek suchen
                    </button>
                    <button
                        onClick={handleGenerate}
                        disabled={!query || aiLoading}
                        className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                    >
                        <Sparkles className="w-5 h-5" />
                        KI generieren (Joker)
                    </button>
                </div>
                {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
            </div>

            {/* Results */}
            <div className="space-y-6">
                {/* Generated Result */}
                {generated && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-800 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl text-indigo-600">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-100 mb-2">KI-Strategie Generator</h3>
                                <div className="prose dark:prose-invert text-zinc-700 dark:text-zinc-300">
                                    <p className="whitespace-pre-wrap">{generated}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Database Results */}
                {results.map(lesson => (
                    <div key={lesson.id} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-start gap-4">
                        <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                            <BookOpen className="w-6 h-6 text-zinc-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-1">{lesson.title}</h3>
                            <p className="text-zinc-500 text-sm mb-4">{lesson.meta_json?.disg_profile}</p>

                            {/* Short Preview of Strategy for Selected Type */}
                            <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-lg text-sm border-l-4 border-indigo-500">
                                <p className="font-bold mb-1 text-indigo-900 dark:text-indigo-200">Strategie ({type}):</p>
                                <p className="italic">"{lesson.disg_matrix?.[type]?.intent || 'Siehe Lektion...'}"</p>
                            </div>

                            <a href={`/dashboard/training/${lesson.slug}`} className="text-indigo-600 font-bold text-sm mt-4 inline-block hover:underline">
                                Zur ganzen Lektion &rarr;
                            </a>
                        </div>
                    </div>
                ))}

                {results.length === 0 && !loading && !generated && query && (
                    <div className="text-center text-zinc-500 py-12">
                        Nichts in der Bibliothek gefunden. Probier den Joker! 🃏
                    </div>
                )}
            </div>
        </div>
    )
}

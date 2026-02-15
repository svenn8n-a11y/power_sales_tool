'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

// Frage-Datenbank (6 VARK, 6 DISG)
const questions = [
    // --- VARK (1-6) ---
    {
        id: 1,
        category: 'VARK',
        text: "Du hast ein neues technisches Gerät gekauft. Was machst du zuerst?",
        options: [
            { text: "Ich schaue mir die Bilder/Skizzen in der Anleitung an.", value: "V" },
            { text: "Ich lese die detaillierte Beschreibung.", value: "R" },
            { text: "Ich drücke alle Knöpfe und probiere es aus.", value: "K" },
            { text: "Ich frage jemanden, wie es funktioniert.", value: "A" }
        ]
    },
    {
        id: 2,
        category: 'VARK',
        text: "Du willst einem Kollegen den Weg zum Kunden erklären...",
        options: [
            { text: "Du zeichnet eine Skizze.", value: "V" },
            { text: "Du schreibst die Adressen und Abbiegungen auf.", value: "R" },
            { text: "Du gehst es mit ihm gedanklich durch ('Da wo wir immer essen...').", value: "K" },
            { text: "Du erzählst es ihm einfach.", value: "A" }
        ]
    },
    {
        id: 3,
        category: 'VARK',
        text: "Du planst deinen Urlaub. Was ist dir am wichtigsten?",
        options: [
            { text: "Fotos vom Hotel und Strand.", value: "V" },
            { text: "Bewertungen und Reiseführer lesen.", value: "R" },
            { text: "Aktivitäten und Ausflüge vor Ort.", value: "K" },
            { text: "Empfehlungen von Freunden hören.", value: "A" }
        ]
    },
    {
        id: 4,
        category: 'VARK',
        text: "Ein Kunde beschwert sich am Telefon. Was hilft dir?",
        options: [
            { text: "Ich stelle mir sein Gesicht vor.", value: "V" },
            { text: "Ich mache mir Notizen.", value: "R" },
            { text: "Ich laufe beim Telefonieren herum.", value: "K" },
            { text: "Ich höre genau auf seine Stimmlage.", value: "A" }
        ]
    },
    {
        id: 5,
        category: 'VARK',
        text: "Du musst dir eine komplexe Strategie merken.",
        options: [
            { text: "Ich mache eine Mindmap / Diagramm.", value: "V" },
            { text: "Ich schreibe eine Zusammenfassung.", value: "R" },
            { text: "Ich spiele die Situation durch.", value: "K" },
            { text: "Ich erkläre sie jemandem laut.", value: "A" }
        ]
    },
    {
        id: 6,
        category: 'VARK',
        text: "Welche Webseite gefällt dir besser?",
        options: [
            { text: "Eine mit vielen Bildern und Grafiken.", value: "V" },
            { text: "Eine textlastige mit viel Information.", value: "R" },
            { text: "Eine interaktive mit Buttons/Slidern.", value: "K" },
            { text: "Eine mit Erklär-Videos/Audio.", value: "A" }
        ]
    },

    // --- DISG (7-12) ---
    {
        id: 7,
        category: 'DISG',
        text: "Was nervt dich im Meeting am meisten?",
        options: [
            { text: "Wenn wir Zeit verschwenden und nicht zum Punkt kommen.", value: "D" },
            { text: "Wenn die Stimmung schlecht ist und keiner lacht.", value: "I" },
            { text: "Wenn es Streit gibt und wir uns nicht einigen.", value: "S" },
            { text: "Wenn Entscheidungen ohne Fakten getroffen werden.", value: "G" }
        ]
    },
    {
        id: 8,
        category: 'DISG',
        text: "Dein perfekter Verkaufstag...",
        options: [
            { text: "Ich habe 3 Abschlüsse gemacht und den Rekord gebrochen!", value: "D" },
            { text: "Ich hatte super Gespräche und habe mein Netzwerk erweitert.", value: "I" },
            { text: "Ich konnte einem schwierigen Kunden wirklich helfen.", value: "S" },
            { text: "Ich habe meine Pipeline sauber geplant und alles erledigt.", value: "G" }
        ]
    },
    {
        id: 9,
        category: 'DISG',
        text: "Wie gehst du an ein neues Projekt ran?",
        options: [
            { text: "Ich übernehme die Führung und lege los.", value: "D" },
            { text: "Ich begeistere andere dafür mitzumachen.", value: "I" },
            { text: "Ich sorge dafür, dass wir ruhig und stabil vorankommen.", value: "S" },
            { text: "Ich analysiere erst alle Risiken und Details.", value: "G" }
        ]
    },
    {
        id: 10,
        category: 'DISG',
        text: "Ein Kunde sagt 'Nein'. Was denkst du?",
        options: [
            { text: "Jetzt erst recht! Ich überzeuge ihn.", value: "D" },
            { text: "Schade, vielleicht passt es wann anders.", value: "I" },
            { text: "Habe ich etwas falsch gemacht? Ich frage nach.", value: "S" },
            { text: "Welche rationale Begründung hat er?", value: "G" }
        ]
    },
    {
        id: 11,
        category: 'DISG',
        text: "Was motiviert dich am meisten?",
        options: [
            { text: "Sieg, Macht, Ergebnis.", value: "D" },
            { text: "Anerkennung, Spaß, Freiheit.", value: "I" },
            { text: "Harmonie, Sicherheit, Beständigkeit.", value: "S" },
            { text: "Qualität, Ordnung, Logik.", value: "G" }
        ]
    },
    {
        id: 12,
        category: 'DISG',
        text: "Dein größter Albtraum im Job?",
        options: [
            { text: "Kontrollverlust und Stillstand.", value: "D" },
            { text: "Ablehnung und Langeweile.", value: "I" },
            { text: "Konflikte und plötzliche Änderungen.", value: "S" },
            { text: "Chaos und Fehler.", value: "G" }
        ]
    }
]

export default function OnboardingPage() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(0)
    const [answers, setAnswers] = useState<Record<string, number>>({}) // { V: 0, A: 0, D: 0, ... }
    const [loading, setLoading] = useState(false)
    const [productContext, setProductContext] = useState({
        industry: 'Workwear',
        product: '',
        target: ''
    })

    const handleAnswer = (value: string) => {
        // Score erhöhen
        setAnswers(prev => ({
            ...prev,
            [value]: (prev[value] || 0) + 1
        }))

        // Nächster Schritt
        setCurrentStep(prev => prev + 1)
    }

    const handleProductSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        finishOnboarding()
    }

    const finishOnboarding = async () => {
        setLoading(true)

        // Berechne Top VARK
        const varkKeys = ['V', 'A', 'R', 'K']
        const topVark = varkKeys.reduce((a, b) => (answers[a] || 0) > (answers[b] || 0) ? a : b)

        // Berechne Top DISG
        const disgKeys = ['D', 'I', 'S', 'G']
        const topDisg = disgKeys.reduce((a, b) => (answers[a] || 0) > (answers[b] || 0) ? a : b)

        try {
            const { data: { user } } = await createClient().auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }

            // Save to Database
            const { error } = await createClient()
                .from('profiles')
                .upsert({
                    id: user.id,
                    vark_primary: topVark,
                    vark_scores: answers,
                    disg_primary: topDisg,
                    disg_scores: answers,
                    // New Context Fields
                    industry: productContext.industry,
                    product_details: {
                        name: productContext.product,
                        target: productContext.target
                    }
                })

            if (error) throw error

            router.push('/dashboard')

        } catch (err: any) {
            console.error('Onboarding Error:', err)
            const msg = err.message || JSON.stringify(err)
            alert(`Fehler beim Speichern: ${msg}`)
        } finally {
            setLoading(false)
        }
    }

    const isQuizComplete = currentStep === questions.length
    const progress = Math.min(100, ((currentStep + 1) / (questions.length + 1)) * 100)

    if (isQuizComplete) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4">
                <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 border border-zinc-100 dark:border-zinc-800">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Fast geschafft! 🚀</h2>
                    <p className="mb-6 text-zinc-600 dark:text-zinc-400">Damit wir das Training für dich anpassen können, sag uns kurz, was du verkaufst.</p>

                    <form onSubmit={handleProductSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Branche</label>
                            <select
                                value={productContext.industry}
                                onChange={(e) => setProductContext({ ...productContext, industry: e.target.value })}
                                className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                            >
                                <option value="Workwear">Workwear (Standard)</option>
                                <option value="Tools">Werkzeug & Maschinen</option>
                                <option value="SaaS">Software / SaaS</option>
                                <option value="Consulting">Beratung / Dienstleistung</option>
                                <option value="Other">Andere</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Dein Produkt / Service</label>
                            <input
                                type="text"
                                required
                                placeholder="z.B. CNC-Fräsmaschine X500"
                                value={productContext.product}
                                onChange={(e) => setProductContext({ ...productContext, product: e.target.value })}
                                className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Deine Zielgruppe (Wer kauft?)</label>
                            <input
                                type="text"
                                required
                                placeholder="z.B. Produktionsleiter im Mittelstand"
                                value={productContext.target}
                                onChange={(e) => setProductContext({ ...productContext, target: e.target.value })}
                                className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 mt-4"
                        >
                            {loading ? 'Hut denkt nach... 🧙‍♂️' : 'Training starten 🏁'}
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    const q = questions[currentStep]

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4">
            <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 border border-zinc-100 dark:border-zinc-800">

                {/* Progress Bar */}
                <div className="w-full bg-zinc-200 rounded-full h-2.5 mb-8 dark:bg-zinc-700">
                    <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>

                {/* Question */}
                <div className="mb-8">
                    <span className="text-xs font-bold tracking-wider text-indigo-500 uppercase mb-2 block">
                        {q.category === 'VARK' ? 'Lernstil Analyse' : 'Persönlichkeits Profil'}
                        Wait, logic error in rendering? No.
                    </span>
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                        {q.text}
                    </h2>
                </div>

                {/* Options */}
                <div className="grid gap-4">
                    {q.options.map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => handleAnswer(opt.value)}
                            disabled={loading}
                            className="text-left p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all group"
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-zinc-700 dark:text-zinc-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
                                    {opt.text}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>

                {loading && (
                    <div className="mt-8 text-center text-zinc-500 animate-pulse">
                        Der Sprechende Hut denkt nach... 🧙‍♂️
                    </div>
                )}

            </div>
        </div>
    )
}

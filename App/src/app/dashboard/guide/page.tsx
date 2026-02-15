import Link from 'next/link'
import { BookOpen, Brain, Users, HelpCircle } from 'lucide-react'

export default function GuideOverviewPage() {
    return (
        <div className="max-w-4xl mx-auto pb-20">
            <h1 className="text-3xl font-bold mb-8 text-zinc-900 dark:text-white">Wissens-Datenbank 📚</h1>

            <div className="grid md:grid-cols-2 gap-6">
                {/* DISG */}
                <Link href="/dashboard/guide/disg" className="block p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 transition-colors group">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                        <Users className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">DISG Modell</h2>
                    <p className="text-zinc-500 text-sm">Verstehe die 4 Persönlichkeitstypen und wie du sie im Verkauf optimal ansprichst.</p>
                </Link>

                {/* VARK */}
                <Link href="/dashboard/guide/vark" className="block p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 transition-colors group">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                        <Brain className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">VARK Lernstile</h2>
                    <p className="text-zinc-500 text-sm">Warum manche Kunden Bilder brauchen und andere lieber Texte lesen.</p>
                </Link>

                {/* Tool Guide */}
                <Link href="/dashboard/guide/tool" className="block p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 transition-colors group">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Tool Anleitung</h2>
                    <p className="text-zinc-500 text-sm">So nutzt du diesen Trainer effektiv für deinen Erfolg.</p>
                </Link>

                {/* Glossary */}
                <Link href="/dashboard/guide/glossary" className="block p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 transition-colors group">
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-4 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                        <HelpCircle className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Sales Glossar</h2>
                    <p className="text-zinc-500 text-sm">Begriffe und Definitionen rund um Verkauf und Psychologie.</p>
                </Link>
            </div>
        </div>
    )
}

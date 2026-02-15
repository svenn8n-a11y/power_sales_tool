import { ChevronDown, BookOpen, Brain, Target, BarChart2 } from 'lucide-react'

interface DeepContentProps {
    content: any
    selectedDisg: string | null
}

export default function DeepContent({ content, selectedDisg }: DeepContentProps) {
    if (!content) return null

    // Helper to get color based on selected type
    const getHeaderColor = () => {
        switch (selectedDisg) {
            case 'D': return 'text-red-600 dark:text-red-400'
            case 'I': return 'text-yellow-600 dark:text-yellow-400'
            case 'S': return 'text-green-600 dark:text-green-400'
            case 'G': return 'text-blue-600 dark:text-blue-400'
            default: return 'text-zinc-600 dark:text-zinc-400'
        }
    }

    return (
        <div className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Psychologie Box */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
                    <Brain className={`w-5 h-5 ${getHeaderColor()}`} />
                    <h3 className="font-bold text-zinc-800 dark:text-zinc-200">Psychologische Analyse</h3>
                </div>
                <div className="p-6 prose dark:prose-invert max-w-none prose-sm">
                    {/* Render Markdown content */}
                    <div dangerouslySetInnerHTML={{ __html: content.psychology_md || '<p>Keine psychologischen Daten verfügbar.</p>' }} />
                </div>
            </div>

            {/* Framework Steps */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
                    <Target className={`w-5 h-5 ${getHeaderColor()}`} />
                    <h3 className="font-bold text-zinc-800 dark:text-zinc-200">Lösungs-Strategie (Framework)</h3>
                </div>
                <div className="p-6 prose dark:prose-invert max-w-none prose-sm">
                    <div dangerouslySetInnerHTML={{ __html: content.framework_md || '<p>Kein Framework verfügbar.</p>' }} />
                </div>
            </div>

            {/* Metrics / KPI */}
            {content.metrics_md && (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                    <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
                        <BarChart2 className={`w-5 h-5 ${getHeaderColor()}`} />
                        <h3 className="font-bold text-zinc-800 dark:text-zinc-200">Erfolgs-Metriken</h3>
                    </div>
                    <div className="p-6 prose dark:prose-invert max-w-none prose-sm">
                        <div dangerouslySetInnerHTML={{ __html: content.metrics_md }} />
                    </div>
                </div>
            )}
        </div>
    )
}

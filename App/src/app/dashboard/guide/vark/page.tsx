export default function VarkPage() {
    return (
        <div className="max-w-3xl mx-auto pb-20 prose dark:prose-invert">
            <h1>VARK Lernstile</h1>
            <p className="lead">Jeder lernt anders. Wir passen das Training an dein Gehirn an.</p>

            <div className="space-y-6 my-8 not-prose">
                <div className="flex gap-4 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <div className="text-2xl">👁️</div>
                    <div>
                        <h3 className="font-bold">V - Visuell</h3>
                        <p className="text-sm text-zinc-500">Du lernst durch Bilder, Grafiken und Skizzen.</p>
                    </div>
                </div>
                <div className="flex gap-4 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <div className="text-2xl">👂</div>
                    <div>
                        <h3 className="font-bold">A - Auditiv</h3>
                        <p className="text-sm text-zinc-500">Du lernst durch Zuhören und Sprechen (Podcasts, Diskussionen).</p>
                    </div>
                </div>
                <div className="flex gap-4 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <div className="text-2xl">📖</div>
                    <div>
                        <h3 className="font-bold">R - Read/Write</h3>
                        <p className="text-sm text-zinc-500">Du lernst durch Lesen und Schreiben (Listen, Texte).</p>
                    </div>
                </div>
                <div className="flex gap-4 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <div className="text-2xl">✋</div>
                    <div>
                        <h3 className="font-bold">K - Kinästhetisch</h3>
                        <p className="text-sm text-zinc-500">Du lernst durch Machen ("Learning by Doing", Simulationen).</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

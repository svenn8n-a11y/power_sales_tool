export default function GlossaryPage() {
    const terms = [
        { term: 'Einwandvorwegnahme', def: 'Technik, bei der man einen bekannten Einwand selbst anspricht, bevor der Kunde es tut.' },
        { term: 'DISG', def: 'Persönlichkeitsmodell (Dominant, Initiativ, Stetig, Gewissenhaft).' },
        { term: 'VARK', def: 'Lernstil-Modell (Visuell, Auditiv, Read/Write, Kinästhetisch).' },
        { term: 'Closing', def: 'Der Abschluss eines Verkaufsgesprächs.' },
        { term: 'Frame', def: 'Der psychologische Rahmen, in dem ein Gespräch stattfindet.' },
        { term: 'Pacing', def: 'Sich dem Tempo und Stil des Gesprächspartners anpassen.' },
        { term: 'Leading', def: 'Nach erfolgreichem Pacing die Führung im Gespräch übernehmen.' },
    ]

    return (
        <div className="max-w-3xl mx-auto pb-20">
            <h1 className="text-3xl font-bold mb-8 text-zinc-900 dark:text-white">Sales Glossar 📖</h1>
            <div className="space-y-4">
                {terms.sort((a, b) => a.term.localeCompare(b.term)).map((item, i) => (
                    <div key={i} className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                        <h3 className="font-bold text-indigo-600 dark:text-indigo-400 mb-1">{item.term}</h3>
                        <p className="text-zinc-600 dark:text-zinc-400">{item.def}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function DisgPage() {
    return (
        <div className="max-w-3xl mx-auto pb-20 prose dark:prose-invert">
            <h1>Das DISG-Modell im Verkauf</h1>
            <p className="lead">Wie du jeden Kundentyp sofort erkennst und knackst.</p>

            <div className="grid md:grid-cols-2 gap-4 not-prose my-8">
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <h3 className="text-red-900 font-bold text-lg mb-2">D - Dominant</h3>
                    <ul className="text-sm text-red-800 space-y-1">
                        <li>• Direkt, bestimmt, fordernd</li>
                        <li>• Will Ergebnisse, keine Details</li>
                        <li>• Motto: "Mach es kurz!"</li>
                    </ul>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <h3 className="text-yellow-900 font-bold text-lg mb-2">I - Initiativ</h3>
                    <ul className="text-sm text-yellow-800 space-y-1">
                        <li>• Redselig, optimistisch, emotional</li>
                        <li>• Will Beziehung, Spaß, Anerkennung</li>
                        <li>• Motto: "Lass uns das zusammen machen!"</li>
                    </ul>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <h3 className="text-green-900 font-bold text-lg mb-2">S - Stetig</h3>
                    <ul className="text-sm text-green-800 space-y-1">
                        <li>• Ruhig, loyal, harmoniebedürftig</li>
                        <li>• Will Sicherheit, keine Experimente</li>
                        <li>• Motto: "Gehen wir es langsam an."</li>
                    </ul>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <h3 className="text-blue-900 font-bold text-lg mb-2">G - Gewissenhaft</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Analytisch, kritisch, faktisch</li>
                        <li>• Will Beweise, Daten, Qualität</li>
                        <li>• Motto: "Ist das korrekt?"</li>
                    </ul>
                </div>
            </div>

            <h2>Anwendung</h2>
            <p>Jede Lektion in diesem Tool passt sich automatisch deinem primären DISG-Typ an. Wenn du z.B. ein "D"-Typ bist, bekommst du kurze, knackige Handlungsempfehlungen. Als "G"-Typ eher detaillierte Analysen.</p>
        </div>
    )
}

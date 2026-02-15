'use client'

import { useState } from 'react'
import {
    Zap, Sparkles, Handshake, Microscope,
    Mic, Activity, MessageSquare, Eye, Brain, Shirt,
    Info, X, ChevronRight, CheckCircle2, AlertTriangle
} from 'lucide-react'

// --- Data Structure ---
const P: Record<string, any> = {
    D: {
        label: "Dominant", color: "Rot", hex: "text-red-600", bg: "bg-red-600", border: "border-red-600", soft: "bg-red-50 dark:bg-red-900/20",
        icon: Zap,
        kernmotiv: "Kontrolle & Ergebnis", motto: "Was bringt es mir – und zwar jetzt?",
        marston: "Dominance – aktive Umweltgestaltung bei wahrgenommener Überlegenheit",
        para: {
            tempo: { w: "4.5–6.0 Silben/s", d: "Überdurchschnittlich schnell, beschleunigt bei Ungeduld. Tempo-Varianz: ansteigend bei Widerstand." },
            mod: { w: "Abfallend ↘", d: "Tonhöhe sinkt am Satzende – Befehlston. Lautstärke steigt bei Widerstand." },
            bet: { w: "Wortakzente auf Verben", d: "Betont Handlungsverben: MACHEN, ENTSCHEIDEN, JETZT. Kurze rhetorische Pausen." },
            laut: { w: "Überdurchschnittlich", d: "Projiziert Stimme raumfüllend. Lautstärke als Dominanzsignal." },
            cr: "Unterbricht häufig, beendet Sätze anderer, Stakkato-Rhythmus"
        },
        bio: {
            atm: { w: "Hochfrequente Brustatmung", d: "Sympathikus-dominiert. Flache, schnelle Atmung. 16–20/min." },
            halt: { w: "Vorwärtsneigung 10–15°", d: "Lehnt sich hinein. Territorial-Verhalten. Breitbeinig." },
            gest: { w: "Direktiv & raumgreifend", d: "Zeigegesten, Handkantenschläge, Faust-zu-Fläche." },
            mim: { w: "Zusammengezogene Brauen", d: "Ekman AU4 (M. corrugator). Fester Kiefer. Blickkontakt >70%." },
            hand: { w: "Fest, kurz, bestimmend", d: "Greift zuerst, Hand oben (Dominanz-Rotation)." },
            cr: "Körper zeigt zur Tür, Uhrblick bei Langeweile"
        },
        ling: {
            praed: { t: "Visuell dominant", b: ["Ich SEHE das anders", "Zeigen Sie mir die Lösung", "Der Überblick fehlt", "Das Bild ist klar"] },
            meta: [{ n: "Proaktiv", d: "Handelt sofort" }, { n: "Hin-zu", d: "Fokus auf Ziele/Gewinne" }, { n: "Global", d: "Big Picture First" }, { n: "Internal", d: "Entscheidet selbst" }, { n: "Matching", d: "Eigene Standards" }],
            satz: { t: "Ellipsen & Imperative", d: "Kurze Sätze, Satzfragmente, selten Konjunktiv." },
            sig: ["Ergebnis", "sofort", "Bottom Line", "Kontrolle", "Entscheidung", "schnell", "direkt"],
            cr: "Sagt ‚Kommen Sie zum Punkt‘ oder ‚Was ist die Quintessenz?‘"
        },
        auge: {
            pri: "Oben rechts → Visuell konstruiert", sek: "Oben links → Visuell erinnert",
            d: "Konstruiert Zukunftsszenarien. Selten unten rechts (Gefühle vermieden).",
            sal: "Visualisiert das Ergebnis, bevor Argumente gehört wurden."
        },
        ent: {
            bed: "Kontrolle & Zeitgewinn",
            ja: "Wenn er die Entscheidung selbst getroffen hat. Max. 2 Optionen.",
            no: "Kontrollverlust, Zeitverschwendung, Inkompetenz, zu viele Details",
            mot: "ROI, Geschwindigkeit, Wettbewerbsvorteil", dau: "Schnell (oft 1. Sitzung)",
            cr: "Fängt an, selbst Lösungen vorzuschlagen → kauft mental"
        },
        ww: {
            schmerz: "„Warum brauche ich für 200 Leute drei Systeme? Das kostet mich Stunden.“",
            zeit: "Sofort ansprechbar. ‚Wie viel Zeit genau?‘ → Will Zahlen, kein Gefühl.",
            verw: "Nur wenn SEINE Kontrolle steigt. ‚Kann ich das System selbst steuern?‘",
            dont: "Keine langen Einführungen. Kein Smalltalk >90s. Nie: ‚Das muss ich klären.‘",
            ein: "„Herr Müller, wie viel Ihrer Zeit geht für Arbeitskleidungs-Verwaltung drauf?“",
            cls: "Alternativ-Close: ‚Standort A oder direkt alle drei?‘"
        }
    },
    I: {
        label: "Initiativ", color: "Gelb", hex: "text-amber-500", bg: "bg-amber-500", border: "border-amber-500", soft: "bg-amber-50 dark:bg-amber-900/20",
        icon: Sparkles,
        kernmotiv: "Anerkennung & Begeisterung", motto: "Wie fühlt sich das an – und wer findet das noch gut?",
        marston: "Inducement – Beeinflussung durch Begeisterung",
        para: {
            tempo: { w: "5.0–7.0 Silben/s", d: "Am schnellsten. Starke Varianz: schneller bei Begeisterung." },
            mod: { w: "Stark schwankend ↗↘↗", d: "Melodisch. Hohe Varianz in Tonhöhe und Lautstärke." },
            bet: { w: "Emotionale Adjektive", d: "FANTASTISCH, UNGLAUBLICH, das BESTE. Rhetorische Fragen." },
            laut: { w: "Variabel, laut", d: "Lauter bei Begeisterung. Flüstert für Dramatik." },
            cr: "Springt zwischen Themen, Anekdoten, lacht häufig"
        },
        bio: {
            atm: { w: "Unregelmäßig, thorakal", d: "Schnell/flach bei Aufregung. Vergisst zu atmen." },
            halt: { w: "Dynamisch, offen", d: "Wechselt Position. Offene Arme, sichtbare Handflächen." },
            gest: { w: "Ausladend & expressiv", d: "Große Gesten, zeichnet in Luft, berührt Gegenüber." },
            mim: { w: "Hochmobil", d: "Duchenne-Lächeln (AU6+12). Hochgezogene Brauen." },
            hand: { w: "Warm, beidhändig", d: "Beide Hände. Hält länger. Verbindungssignal." },
            cr: "Berührt eigene Haare, spiegelt Gegenüber"
        },
        ling: {
            praed: { t: "Auditiv & Kinästhetisch", b: ["Das KLINGT großartig", "Ich FÜHLE mich wohl", "Guter KLANG", "Erzählen Sie mehr"] },
            meta: [{ n: "Proaktiv", d: "Springt auf Ideen" }, { n: "Hin-zu", d: "Positive Visionen" }, { n: "Global", d: "Großes Bild" }, { n: "External", d: "Braucht Bestätigung" }, { n: "Mismatching", d: "Sucht Neues" }],
            satz: { t: "Parataxen & Anekdoten", d: "Verkettete Sätze, assoziativ, Themen-Sprünge." },
            sig: ["spannend", "Begeisterung", "Team", "Innovation", "Vision", "Erlebnis", "neu"],
            cr: "Sagt ‚Das erinnert mich an...‘ und erzählt 3 Minuten"
        },
        auge: {
            pri: "Mitte links → Auditiv erinnert", sek: "Oben rechts → Visuell konstruiert",
            d: "Erinnert Gespräche. Häufig unten rechts (Emotionen).",
            sal: "Argumente müssen ‚sich gut anfühlen‘."
        },
        ent: {
            bed: "Anerkennung & Neuheit",
            ja: "Begeistert UND steht bei anderen gut da. Testimonials = Gold.",
            no: "Langeweile, zu viele Details, steife Atmosphäre, kein persönlicher Bezug",
            mot: "Status, Innovation, Team-Benefit, First Mover", dau: "Schnell emotional, aber wechselhaft",
            cr: "Erzählt anderen davon → Kaufsignal. Wird still → Verlust."
        },
        ww: {
            schmerz: "„Meine Leute beschweren sich – Jacke passt nicht, ist hässlich. Ich will, dass sie STOLZ sind.“",
            zeit: "Mäßig. Relevant wenn = mehr Zeit für Team/Kreatives.",
            verw: "Als modernes System: ‚Mitarbeiter bestellen selbst per App – cool!‘",
            dont: "Keine Excel-Tabellen. Keine Produktlisten. Nie: ‚Standard in der Branche.‘",
            ein: "„Frau Schmidt, Glückwunsch zum Innovation Award! Andere innovative Firmen machen...“",
            cls: "Social Proof: ‚Firma XY war begeistert. Wollen Sie das auch?‘"
        }
    },
    S: {
        label: "Stetig", color: "Grün", hex: "text-emerald-600", bg: "bg-emerald-600", border: "border-emerald-600", soft: "bg-emerald-50 dark:bg-emerald-900/20",
        icon: Handshake,
        kernmotiv: "Sicherheit & Harmonie", motto: "Wie wirkt sich das auf mein Team aus?",
        marston: "Steadiness – passive Anpassung an freundliche Umwelt",
        para: {
            tempo: { w: "2.5–3.5 Silben/s", d: "Am langsamsten. Gleichmäßig, verlangsamt bei Unsicherheit." },
            mod: { w: "Flach, gleichmäßig →", d: "Sanfte, warme Stimme. Leicht ansteigend am Satzende." },
            bet: { w: "Weiche Betonungen", d: "Betont: gemeinsam, Team, alle. Häufige Rückfragen." },
            laut: { w: "Unterdurchschnittlich", d: "Leise bei Meinungen. Noch leiser bei Konfrontation." },
            cr: "Lange Pausen, ‚Hmm...‘, Rückfragen an Kollegen"
        },
        bio: {
            atm: { w: "Tiefe Bauchatmung", d: "Parasympathikus-dominiert. 12–14/min. Seufzt bei Unsicherheit." },
            halt: { w: "Zurückgelehnt, geschlossen", d: "Wenig Raum. Arme verschränkt (Schutz). 0–5° zurück." },
            gest: { w: "Minimal, selbstberuhigend", d: "Kleine Gesten. Berührt eigenen Arm. Nickt häufig." },
            mim: { w: "Freundlich-neutral", d: "Soziales Lächeln (AU12 ohne AU6). Blickkontakt 40–50%." },
            hand: { w: "Sanft, anpassend", d: "Passt Druck an. Kurzer Kontakt, schneller Rückzug." },
            cr: "Schaut zu Kollegen, nickt auch bei Bedenken"
        },
        ling: {
            praed: { t: "Kinästhetisch dominant", b: ["Das FÜHLT sich richtig an", "Ich SPÜRE Unsicherheit", "Das BERÜHRT mich", "Gutes GEFÜHL"] },
            meta: [{ n: "Reaktiv", d: "Wartet ab, beobachtet" }, { n: "Weg-von", d: "Vermeidet Risiken" }, { n: "Detail", d: "Schritt für Schritt" }, { n: "External", d: "Braucht Team-Bestätigung" }, { n: "Matching", d: "Sucht Gemeinsamkeiten" }],
            satz: { t: "Konjunktiv & Absicherung", d: "‚Man könnte‘, ‚vielleicht wäre es...‘, ‚Wenn das Team das gut findet...‘" },
            sig: ["Team", "gemeinsam", "sicher", "bewährt", "Vertrauen", "stabil", "Schritt für Schritt"],
            cr: "Sagt ‚Ich muss mein Team fragen‘ oder ‚Wie machen das andere?‘"
        },
        auge: {
            pri: "Unten rechts → Kinästhetisch (Gefühle)", sek: "Mitte links → Auditiv erinnert",
            d: "Verarbeitet über Gefühle. Erinnert Versprechen.",
            sal: "Muss sich emotional sicher fühlen, bevor Logik zählt."
        },
        ent: {
            bed: "Sicherheit & Gruppenkonsens",
            ja: "Team profitiert + Risiko minimal + andere nutzen es bereits.",
            no: "Druck, Ultimaten, Konfrontation, fehlende Referenzen, zu schnell",
            mot: "Team-Zufriedenheit, Stabilität, Risikominimierung", dau: "Langsam (2–3 Gespräche)",
            cr: "‚Das klingt gut‘ ohne Handlung → braucht mehr Sicherheit"
        },
        ww: {
            schmerz: "„Mitarbeiter unzufrieden, aber ich will nichts überstürzen. Ein Wechsel betrifft alle.“",
            zeit: "Relevant wenn = weniger Stress fürs Team: ‚Alles kommt automatisch.‘",
            verw: "Sanfter Übergang: ‚Wir begleiten Sie Schritt für Schritt.‘",
            dont: "Kein Druck. Keine Deadlines. Bestehendes nie schlecht reden.",
            ein: "„Herr Weber, wie zufrieden ist Ihr Team? Ganz ohne Zeitdruck.“",
            cls: "Testimonial + Garantie: ‚Firma ABC – keine einzige Beschwerde. Testlauf?‘"
        }
    },
    G: {
        label: "Gewissenhaft", color: "Blau", hex: "text-blue-600", bg: "bg-blue-600", border: "border-blue-600", soft: "bg-blue-50 dark:bg-blue-900/20",
        icon: Microscope,
        kernmotiv: "Logik & Qualität", motto: "Welche Daten belegen das – und wo ist der Haken?",
        marston: "Compliance – Fokus auf Regeln und Standards",
        para: {
            tempo: { w: "3.0–4.0 Silben/s", d: "Mittleres Tempo. Pausiert gezielt zum Nachdenken." },
            mod: { w: "Monoton →", d: "Sachlich, nüchtern. Keine Tonhöhenwechsel." },
            bet: { w: "Analytische Wortakzente", d: "PROZESSOPTIMIERUNG, KENNZAHL. Pausen 2–3 Sek." },
            laut: { w: "Kontrolliert", d: "Moderater Pegel. Leiser bei Unsicherheit, nicht lauter bei Ärger." },
            cr: "Denkpausen >3s, präzise Wortwahl, Selbstkorrektur"
        },
        bio: {
            atm: { w: "Kontrolliert, flach", d: "Bewusst reguliert. 14–16/min, gleichmäßig." },
            halt: { w: "Aufrecht, distanziert", d: "Gerade. Distanzzone >80cm. Beine parallel." },
            gest: { w: "Minimiert & präzise", d: "Kirchturmgeste (Finger zusammen = Analyse)." },
            mim: { w: "Kontrolliert-neutral", d: "AU4 Stirnfalten (Analyse). AU44 zusammengekniffene Augen (Skepsis)." },
            hand: { w: "Korrekt, kurz", d: "Angemessener Druck. Keine Extra-Gesten." },
            cr: "Macht Notizen, ordnet Unterlagen, bringt eigene Daten mit"
        },
        ling: {
            praed: { t: "Neutral/Digital", b: ["Ich VERSTEHE die Logik", "ANALYSIEREN wir das", "Daten ZEIGEN", "ERGIBT keinen Sinn"] },
            meta: [{ n: "Reaktiv", d: "Analysiert vollständig" }, { n: "Weg-von", d: "Sucht Fehler/Risiken" }, { n: "Detail", d: "Braucht alle Infos" }, { n: "Internal", d: "Vertraut eigener Analyse" }, { n: "Mismatching", d: "Sucht Widersprüche" }],
            satz: { t: "Hypotaxen & Konditionalsätze", d: "‚Wenn man bedenkt, dass... unter der Voraussetzung...‘ Fachterminologie." },
            sig: ["Daten", "Analyse", "Prozess", "Standard", "Qualität", "nachweisbar", "Kennzahl"],
            cr: "Fragt ‚Haben Sie eine Studie?‘ oder ‚Fehlerquote genau?‘"
        },
        auge: {
            pri: "Unten links → Interner Dialog", sek: "Oben links → Visuell erinnert",
            d: "Selbstgespräche, wägt ab. Selten unten rechts (rationalisiert Gefühle).",
            sal: "Stille = widerlegt gerade innerlich Ihre Argumente."
        },
        ent: {
            bed: "Vollständige Daten & Logik",
            ja: "Alle Fragen beantwortet, Daten schlüssig, kein Widerspruch.",
            no: "Ungenauigkeiten, übertriebene Versprechen, fehlende Daten, emotionaler Druck",
            mot: "Qualität, Prozessoptimierung, Fehlerreduktion, Compliance", dau: "Am längsten (eigene Analyse)",
            cr: "Erstellt eigene Vergleichstabelle → kurz vor Entscheidung"
        },
        ww: {
            schmerz: "„Excel hat 47 Spalten, trotzdem fehlen Infos. Fehlerquote: ca. 12%.“",
            zeit: "Nur mit Zahlen: ‚14,3 Stunden/Monat. Auswertung von 23 Kunden.‘",
            verw: "Prozessoptimierung: ‚87% weniger manuelle Eingaben, Fehlerquote <1%.‘",
            dont: "Kein ‚ungefähr‘. Kein ‚Vertrauen Sie mir‘. Keine Emotionalisierung.",
            ein: "„Herr Dr. Fischer, drei Optimierungspotenziale identifiziert. Darf ich die Daten zeigen?“",
            cls: "Pilot 90 Tage, KPIs: Fehlerquote, Zeitaufwand, Zufriedenheit. Ergebnisse entscheiden."
        }
    }
}

const cats = [
    { k: "para", l: "Paralinguistik", i: Mic },
    { k: "bio", l: "Bio-Physiologie", i: Activity },
    { k: "ling", l: "Linguistik", i: MessageSquare },
    { k: "auge", l: "Augenmuster", i: Eye },
    { k: "ent", l: "Entscheidung", i: Brain },
    { k: "ww", l: "Workwear", i: Shirt }
]

function DR({ label, wert, desc }: { label: string, wert: string, desc?: string }) {
    return (
        <div className="py-3 border-b border-zinc-100 last:border-0 dark:border-zinc-800">
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                <span className="font-bold text-zinc-700 dark:text-zinc-300 w-32 shrink-0 text-sm">{label}:</span>
                <span className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-800 dark:text-zinc-200">
                    {wert}
                </span>
            </div>
            {desc && <div className="text-xs text-zinc-500 mt-1 ml-0 sm:ml-34">{desc}</div>}
        </div>
    )
}

function Badge({ name, desc }: { name: string, desc: string }) {
    const [open, setOpen] = useState(false)
    return (
        <div className="relative inline-block m-1">
            <button
                onClick={() => setOpen(!open)}
                className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold rounded-full transition"
            >
                {name}
            </button>
            {open && (
                <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-xl rounded-lg text-xs animate-in zoom-in-95">
                    <p className="text-zinc-600 dark:text-zinc-400 mb-2">{desc}</p>
                    <button onClick={() => setOpen(false)} className="text-indigo-500 hover:text-indigo-600 font-bold">
                        Schließen
                    </button>
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-white dark:bg-zinc-900 border-b border-r border-zinc-200 dark:border-zinc-700 rotate-45"></div>
                </div>
            )}
            {open && <div className="fixed inset-0 z-10" onClick={() => setOpen(false)}></div>}
        </div>
    )
}

function SectionContent({ cat, type }: { cat: string, type: string }) {
    const d = P[type][cat]
    const p = P[type]

    if (cat === "para") return (
        <div>
            <DR label="Sprechtempo" wert={d.tempo.w} desc={d.tempo.d} />
            <DR label="Modulation" wert={d.mod.w} desc={d.mod.d} />
            <DR label="Betonung" wert={d.bet.w} desc={d.bet.d} />
            <DR label="Lautstärke" wert={d.laut.w} desc={d.laut.d} />
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/50 rounded-lg text-xs">
                <strong className="text-yellow-800 dark:text-yellow-500 block mb-1">🕵️ Cold-Reading:</strong>
                <span className="text-yellow-900/80 dark:text-yellow-200/80">{d.cr}</span>
            </div>
        </div>
    )

    if (cat === "bio") return (
        <div>
            <DR label="Atmung" wert={d.atm.w} desc={d.atm.d} />
            <DR label="Haltung" wert={d.halt.w} desc={d.halt.d} />
            <DR label="Gestik" wert={d.gest.w} desc={d.gest.d} />
            <DR label="Mimik (FACS)" wert={d.mim.w} desc={d.mim.d} />
            <DR label="Händedruck" wert={d.hand.w} desc={d.hand.d} />
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/50 rounded-lg text-xs">
                <strong className="text-yellow-800 dark:text-yellow-500 block mb-1">🕵️ Cold-Reading:</strong>
                <span className="text-yellow-900/80 dark:text-yellow-200/80">{d.cr}</span>
            </div>
        </div>
    )

    if (cat === "ling") return (
        <div>
            <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">VAKOG-Prädikate: {d.praed.t}</h4>
            <div className="flex flex-wrap gap-2 mb-6">
                {d.praed.b.map((b: string, i: number) => (
                    <span key={i} className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded text-xs">
                        {b}
                    </span>
                ))}
            </div>

            <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">Metaprogramme</h4>
            <div className="mb-6">
                {d.meta.map((m: any, i: number) => <Badge key={i} name={m.n} desc={m.d} />)}
            </div>

            <DR label="Satzstruktur" wert={d.satz.t} desc={d.satz.d} />

            <div className="mt-6">
                <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">Signalwörter</h4>
                <div className="flex flex-wrap gap-1">
                    {d.sig.map((s: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-md font-mono text-xs">
                            #{s}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )

    if (cat === "auge") return (
        <div>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-lg">
                    <div className="text-xs font-bold text-indigo-600 mb-1 uppercase">Primär</div>
                    <div className="text-sm">{d.pri}</div>
                </div>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg">
                    <div className="text-xs font-bold text-zinc-500 mb-1 uppercase">Sekundär</div>
                    <div className="text-sm">{d.sek}</div>
                </div>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 italic mb-4">{d.d}</p>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-lg text-xs">
                <strong className="text-indigo-800 dark:text-indigo-400 block mb-1">🧠 Sales-Bedeutung:</strong>
                {d.sal}
            </div>
        </div>
    )

    if (cat === "ent") return (
        <div>
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-lg">
                    <div className="text-xs font-bold text-green-700 dark:text-green-500 mb-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> JA-SIGNAL
                    </div>
                    <div className="text-sm text-zinc-700 dark:text-zinc-300">{d.ja}</div>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg">
                    <div className="text-xs font-bold text-red-700 dark:text-red-500 mb-1 flex items-center gap-1">
                        <X className="w-3 h-3" /> ABBRUCH
                    </div>
                    <div className="text-sm text-zinc-700 dark:text-zinc-300">{d.no}</div>
                </div>
            </div>
            <DR label="Kernbedürfnis" wert={d.bed} />
            <DR label="Kaufmotiv" wert={d.mot} />
            <DR label="Dauer" wert={d.dau} />
        </div>
    )

    if (cat === "ww") return (
        <div className="space-y-4">
            <div className="p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-900/30 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <AlertTriangle className="w-12 h-12 text-orange-500" />
                </div>
                <div className="text-xs font-bold text-orange-700 dark:text-orange-500 mb-1 uppercase tracking-wider">Typischer Schmerzausdruck</div>
                <div className="font-serif italic text-lg text-zinc-800 dark:text-zinc-200">"{d.schmerz}"</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                    <div className="text-xs font-bold text-blue-700 dark:text-blue-500 mb-1">Reaktion: Zeit</div>
                    <div className="text-xs">{d.zeit}</div>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                    <div className="text-xs font-bold text-blue-700 dark:text-blue-500 mb-1">Reaktion: Verwaltung</div>
                    <div className="text-xs">{d.verw}</div>
                </div>
            </div>

            <div className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 rounded-lg">
                <div className="text-xs font-bold text-red-700 mb-1">⚠️ DO NOT</div>
                <div className="text-xs">{d.dont}</div>
            </div>

            <div className="p-3 bg-green-50 dark:bg-green-900/10 border border-green-100 rounded-lg">
                <div className="text-xs font-bold text-green-700 mb-1">✅ Guter Einstieg</div>
                <div className="text-xs italic">"{d.ein}"</div>
            </div>

            <div className="p-3 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 rounded-lg">
                <div className="text-xs font-bold text-purple-700 mb-1">🚀 Closing</div>
                <div className="text-xs">{d.cls}</div>
            </div>
        </div>
    )

    return null
}

export default function DisgProfiling() {
    const [type, setType] = useState('D')
    const [cat, setCat] = useState('para')

    const p = P[type]
    const activeCat = cats.find(c => c.k === cat) || cats[0]

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">DISG x NLP Profiling</h1>
                <p className="text-zinc-500">Kriminologisches Verhaltens-Profiling für den B2B-Sales.</p>
            </div>

            {/* Type Selector Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {Object.entries(P).map(([key, data]) => {
                    const isActive = type === key
                    const Icon = data.icon
                    return (
                        <button
                            key={key}
                            onClick={() => setType(key)}
                            className={`relative text-left p-4 rounded-xl border-2 transition-all ${isActive
                                    ? `${data.border} ${data.soft}`
                                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300'
                                }`}
                        >
                            <div className={`mb-3 w-10 h-10 rounded-lg flex items-center justify-center ${isActive ? 'bg-white/50' : 'bg-zinc-100 dark:bg-zinc-800'} ${data.hex}`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div className={`font-bold text-lg ${isActive ? data.hex : 'text-zinc-700 dark:text-zinc-300'}`}>
                                {data.color}
                            </div>
                            <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">{data.label}</div>
                            <div className="text-xs opacity-70 leading-tight">{data.kernmotiv}</div>
                        </button>
                    )
                })}
            </div>

            {/* Main Content Area */}
            <div className={`rounded-3xl border-2 overflow-hidden bg-white dark:bg-zinc-900 transition-colors ${p.border}`}>

                {/* Header */}
                <div className={`p-6 border-b ${p.soft} ${p.border}`}>
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className={`text-2xl font-bold flex items-center gap-3 ${p.hex}`}>
                                <p.icon className="w-8 h-8" />
                                {p.color} – {p.label}
                            </h2>
                            <p className="text-lg italic text-zinc-700 dark:text-zinc-300 mt-2 font-serif">"{p.motto}"</p>
                        </div>
                        <div className="hidden md:block text-right">
                            <span className="text-xs font-bold uppercase tracking-wider opacity-50">Marston Definition</span>
                            <p className="text-sm max-w-xs">{p.marston}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row">
                    {/* Category Sidebar */}
                    <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 p-2 bg-zinc-50/50 dark:bg-black/20">
                        {cats.map(c => {
                            const CatIcon = c.i
                            const isCatActive = cat === c.k
                            return (
                                <button
                                    key={c.k}
                                    onClick={() => setCat(c.k)}
                                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-colors mb-1 ${isCatActive
                                            ? `${p.bg} text-white shadow-md`
                                            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                        }`}
                                >
                                    <CatIcon className="w-4 h-4" />
                                    {c.l}
                                    {isCatActive && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
                                </button>
                            )
                        })}
                    </div>

                    {/* Content Detail */}
                    <div className="flex-1 p-6 md:p-8 min-h-[400px]">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                            <div className={`p-2 rounded-lg ${p.soft}`}>
                                <activeCat.i className={`w-5 h-5 ${p.hex}`} />
                            </div>
                            <h3 className="text-xl font-bold">{activeCat.l}</h3>
                        </div>

                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <SectionContent cat={cat} type={type} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center text-xs text-zinc-400">
                Quellen: Marston (DISG) | Ekman (FACS) | Bandler/Grinder (NLP) | Kahneman | Cialdini | Schulz von Thun
            </div>
        </div>
    )
}

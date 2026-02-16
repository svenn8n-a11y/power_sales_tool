'use client'

import { useState, useEffect } from 'react'
import { Calculator, Clock, Euro, Users, ArrowRight } from 'lucide-react'

export default function ROICalculator() {
    // Defaults based on P001 example
    const [employees, setEmployees] = useState(50)
    const [hourlyRate, setHourlyRate] = useState(50)
    const [partsPerYear, setPartsPerYear] = useState(3)
    const [minutesPerPart, setMinutesPerPart] = useState(75) // The "75-Minute-Jacket"

    const [results, setResults] = useState({
        hoursIs: 0,
        costIs: 0,
        costSoll: 0,
        savings: 0,
        roi: 0
    })

    useEffect(() => {
        // Calculation Logic (75-Minute-Jacket)

        // 1. Status Quo (Manual)
        // Time = (Minutes * Parts * Employees) / 60
        const totalMinutes = minutesPerPart * partsPerYear * employees
        const hoursIs = totalMinutes / 60
        const costIs = hoursIs * hourlyRate

        // 2. Target (Digital System)
        // Assumption: Digital system reduces time to ~5 mins per part or fixed system fee?
        // In P001 text: "15 Std. (Digital)" for 50 MA vs 187.5 Std.
        // That's a reduction factor of ~12.5 (187.5 / 15).
        // Let's use a "Digital Factor" of 0.08 (8% of original time)
        const hoursSoll = hoursIs * 0.08
        const systemFeeYearly = 42 * employees // Example from text: 4200 / 100 MA = 42/MA

        // Total Soll Cost (Time + Fee)
        // Note: P001 text says "12.625 € (inkl. Gebühr)" vs "20.875 €"
        // Let's stick to a simplified model for the widget
        const costSollTime = hoursSoll * hourlyRate
        const costSollTotal = costSollTime + systemFeeYearly

        const savings = costIs - costSollTotal
        const roi = (savings / costSollTotal) * 100

        setResults({
            hoursIs,
            costIs,
            costSoll: costSollTotal,
            savings,
            roi
        })

    }, [employees, hourlyRate, partsPerYear, minutesPerPart])

    const formatCurrency = (val: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val)
    const formatNumber = (val: number) => new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1 }).format(val)

    return (
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white rounded-2xl p-6 shadow-xl border border-zinc-700">
            <div className="flex items-center gap-3 mb-6 border-b border-zinc-700 pb-4">
                <div className="p-2 bg-indigo-500 rounded-lg">
                    <Calculator className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">Der "75-Minuten-Jacke" Rechner</h3>
                    <p className="text-zinc-400 text-xs">Berechne das Einsparpotenzial live beim Kunden.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-5">

                    <div>
                        <label className="flex items-center justify-between text-sm font-medium text-zinc-300 mb-2">
                            <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Mitarbeiter</span>
                            <span className="bg-zinc-700 px-2 py-0.5 rounded text-xs">{employees}</span>
                        </label>
                        <input
                            type="range" min="10" max="500" step="10"
                            value={employees} onChange={(e) => setEmployees(Number(e.target.value))}
                            className="w-full accent-indigo-500 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    <div>
                        <label className="flex items-center justify-between text-sm font-medium text-zinc-300 mb-2">
                            <span className="flex items-center gap-2"><Euro className="w-4 h-4" /> Ø Verrechnungssatz / Std.</span>
                            <span className="bg-zinc-700 px-2 py-0.5 rounded text-xs">{hourlyRate} €</span>
                        </label>
                        <input
                            type="range" min="20" max="150" step="5"
                            value={hourlyRate} onChange={(e) => setHourlyRate(Number(e.target.value))}
                            className="w-full accent-indigo-500 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    <div className="pt-4 border-t border-zinc-700">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-zinc-500 block mb-1">Teile pro Jahr</label>
                                <input
                                    type="number" value={partsPerYear} onChange={(e) => setPartsPerYear(Number(e.target.value))}
                                    className="w-full bg-zinc-700 border border-zinc-600 rounded px-2 py-1 text-sm focus:border-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-500 block mb-1">Minuten Aufwand (Is)</label>
                                <input
                                    type="number" value={minutesPerPart} onChange={(e) => setMinutesPerPart(Number(e.target.value))}
                                    className="w-full bg-zinc-700 border border-zinc-600 rounded px-2 py-1 text-sm focus:border-indigo-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Results */}
                <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-700/50 flex flex-col justify-center gap-4">

                    <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-400">Verlorene Zeit (Status Quo):</span>
                        <span className="font-mono text-red-400">{formatNumber(results.hoursIs)} Std./Jahr</span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-400">Versteckte Kosten:</span>
                        <span className="font-mono text-zinc-300">{formatCurrency(results.costIs)}</span>
                    </div>

                    <div className="h-px bg-zinc-700 my-2"></div>

                    <div className="space-y-1">
                        <div className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Dein Einsparpotenzial</div>
                        <div className="text-3xl font-black text-green-400 flex items-center gap-2">
                            {formatCurrency(results.savings)} <span className="text-xs font-normal text-zinc-500">/ Jahr</span>
                        </div>
                        <div className="text-xs text-indigo-400 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {formatNumber(results.hoursIs - (results.hoursIs * 0.08))} Stunden gespart
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

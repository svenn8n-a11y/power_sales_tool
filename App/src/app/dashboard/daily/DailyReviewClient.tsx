'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { submitCardReview } from '@/app/actions/spaced_repetition'
import { Check, X, Clock, Zap, Repeat } from 'lucide-react'
import confetti from 'canvas-confetti'

export default function DailyReviewClient({ cards }: { cards: any[] }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isFlipped, setIsFlipped] = useState(false)
    const [finished, setFinished] = useState(false)

    const currentCard = cards[currentIndex]

    const handleRate = async (quality: number) => {
        // Optimistic UI: Move to next card immediately
        const cardId = currentCard.id

        // Call Server Action
        await submitCardReview(cardId, quality)

        // Animation & Next Scard
        if (currentIndex < cards.length - 1) {
            setIsFlipped(false)
            setCurrentIndex(prev => prev + 1)
        } else {
            setFinished(true)
            confetti({ particleCount: 150, spread: 60 })
        }
    }

    if (finished) {
        return (
            <div className="text-center p-12 bg-indigo-50 rounded-2xl border border-indigo-100 animate-in zoom-in">
                <Zap className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-indigo-800">Session Completed!</h3>
                <p className="text-indigo-600">Das war's für heute. Komm morgen wieder.</p>
            </div>
        )
    }

    return (
        <div className="relative h-[500px] w-full perspective-1000">
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentCard.id}
                    initial={{ x: 300, opacity: 0, rotate: 10 }}
                    animate={{ x: 0, opacity: 1, rotate: 0 }}
                    exit={{ x: -300, opacity: 0, rotate: -10 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="w-full h-full relative preserve-3d cursor-pointer"
                >
                    {/* CARD FRONT */}
                    <div
                        onClick={() => setIsFlipped(!isFlipped)}
                        className={`absolute inset-0 w-full h-full bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700 p-8 flex flex-col justify-center items-center text-center transition-all duration-500 backface-hidden ${isFlipped ? 'rotate-y-180 opacity-0 pointer-events-none' : 'opacity-100'}`}
                    >
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">{currentCard.category || 'Karte'}</span>
                        <h3 className="text-2xl font-bold text-zinc-800 dark:text-white leading-relaxed">
                            {currentCard.front}
                        </h3>
                        <p className="mt-8 text-zinc-400 text-sm">(Zum Umdrehen tippen)</p>
                    </div>

                    {/* CARD BACK */}
                    <div
                        onClick={() => setIsFlipped(!isFlipped)}
                        className={`absolute inset-0 w-full h-full bg-indigo-600 rounded-2xl shadow-2xl p-8 flex flex-col justify-center items-center text-center text-white transition-all duration-500 backface-hidden ${isFlipped ? 'opacity-100 rotate-y-0' : 'rotate-y-180 opacity-0 pointer-events-none'}`}
                        style={{ transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)' }}
                    >
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 mb-4">Lösung</span>
                        <h3 className="text-xl font-medium leading-relaxed mb-8">
                            {currentCard.back}
                        </h3>

                        {/* Rating Buttons */}
                        <div className="grid grid-cols-4 gap-2 w-full mt-auto" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => handleRate(1)} className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/10 transition">
                                <div className="p-2 bg-red-500 rounded-full"><Repeat className="w-4 h-4" /></div>
                                <span className="text-[10px] font-bold">Nochmal</span>
                            </button>
                            <button onClick={() => handleRate(2)} className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/10 transition">
                                <div className="p-2 bg-orange-500 rounded-full"><Clock className="w-4 h-4" /></div>
                                <span className="text-[10px] font-bold">Schwer</span>
                            </button>
                            <button onClick={() => handleRate(3)} className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/10 transition">
                                <div className="p-2 bg-blue-500 rounded-full"><Check className="w-4 h-4" /></div>
                                <span className="text-[10px] font-bold">Gut</span>
                            </button>
                            <button onClick={() => handleRate(5)} className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/10 transition">
                                <div className="p-2 bg-green-500 rounded-full"><Zap className="w-4 h-4" /></div>
                                <span className="text-[10px] font-bold">Einfach</span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

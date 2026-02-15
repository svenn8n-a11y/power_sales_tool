'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react'

export default function AuthForm() {
    const supabase = createClient()
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                router.push('/dashboard')
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                })
                if (error) throw error
                alert('Check your email for the confirmation link!')
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                    {isLogin ? 'Welcome Back' : 'Join the Dojo'}
                </h2>
                <p className="mt-2 text-sm text-zinc-500">
                    {isLogin ? 'Enter your credentials to access your training' : 'Start your journey to sales mastery'}
                </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
                        <input
                            type="email"
                            required
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:border-zinc-700"
                            placeholder="sales@hero.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
                        <input
                            type="password"
                            required
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:border-zinc-700"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg dark:bg-red-900/20">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors focus:ring-4 focus:ring-indigo-500/20 disabled:opacity-50"
                >
                    {loading ? (
                        <div key="loading" className="flex items-center">
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            <span>Loading...</span>
                        </div>
                    ) : (
                        <div key="action" className="flex items-center">
                            <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </div>
                    )}
                </button>
            </form>

            <div className="text-center text-sm">
                <span className="text-zinc-500">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                </span>
                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                    {isLogin ? 'Sign up' : 'Log in'}
                </button>
            </div>
        </div>
    )
}

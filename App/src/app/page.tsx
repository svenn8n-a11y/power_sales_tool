'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [status, setStatus] = useState<string>('Connecting...')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkConnection() {
      try {
        // Try to fetch 1 row from objections (even if empty, it tests connection)
        const { data, error } = await supabase.from('objections_master').select('*').limit(1)
        if (error) throw error
        setStatus('✅ Connected to Supabase!')
      } catch (err: any) {
        setStatus('❌ Connection Failed')
        setError(err.message)
      }
    }
    checkConnection()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-4 text-center">
        <h1 className="text-4xl font-bold">Sales Dojo 🥋</h1>
        <p className="text-xl">System Status Check:</p>

        <div className={`p-4 rounded border ${error ? 'border-red-500 bg-red-50 text-red-700' : 'border-green-500 bg-green-50 text-green-700'}`}>
          <p className="font-mono">{status}</p>
          {error && <p className="text-sm mt-2">{error}</p>}
        </div>

        <div className="flex gap-4">
          <a href="/login" className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition">
            Log In
          </a>
          <a href="/dashboard" className="px-6 py-3 border border-zinc-200 text-zinc-700 rounded-lg font-medium hover:bg-zinc-50 transition dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
            Go to Dashboard
          </a>
        </div>
      </main>
    </div>
  )
}

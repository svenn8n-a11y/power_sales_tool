import { createClient } from '@/utils/supabase/server'
import UserTable from './UserTable'
import Link from 'next/link'
import { ArrowLeft, Users } from 'lucide-react'

export default async function UsersPage() {
    const supabase = await createClient()

    // 1. Check Auth
    const { data: { user } } = await supabase.auth.getUser()

    // 2. Fetch all profiles
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    console.log('Admin User Load:', { userEmail: user?.email, profilesCount: profiles?.length, error })

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8">
            {/* DEBUG BOX */}
            <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-900 rounded font-mono text-xs">
                <p><strong>Debug Info:</strong></p>
                <p>Your Email: {user?.email}</p>
                <p>Profiles Found: {profiles?.length || 0}</p>
                <p>Error: {error ? JSON.stringify(error) : 'None'}</p>
            </div>
            <header className="mb-8">
                <Link href="/admin" className="text-sm text-zinc-500 hover:text-indigo-600 flex items-center gap-2 mb-4">
                    <ArrowLeft className="w-4 h-4" /> Zurück zum Cockpit
                </Link>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                            <Users className="text-indigo-600" />
                            Benutzerverwaltung
                        </h1>
                        <p className="text-zinc-500">Rechte vergeben und Levels steuern.</p>
                    </div>
                </div>
            </header>

            <UserTable users={profiles || []} />
        </div>
    )
}

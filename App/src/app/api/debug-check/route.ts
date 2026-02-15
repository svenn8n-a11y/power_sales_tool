import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = await createClient()

    // Check Lessons Count
    const { count, error } = await supabase
        .from('lessons')
        .select('*', { count: 'exact', head: true })

    // Check User
    const { data: { user } } = await supabase.auth.getUser()

    return NextResponse.json({
        user_id: user?.id,
        lessons_count: count,
        error: error
    })
}

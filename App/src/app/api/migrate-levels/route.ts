import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
        return NextResponse.json({ error: 'Missing Keys' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const results = []

    // 1. Level 1
    const { count: c1, error: e1 } = await supabase
        .from('lessons')
        .update({ level: 1, stage: 'intro', category: 'Mindset & Grundlagen' })
        .ilike('slug', 'P00%')
        .select('*', { count: 'exact', head: true })
    results.push({ level: 1, count: c1, error: e1 })

    // 2. Level 2
    const { count: c2, error: e2 } = await supabase
        .from('lessons')
        .update({ level: 2, stage: 'pitch', category: 'Eröffnung & Analyse' })
        .gte('slug', 'P010')
        .lte('slug', 'P025')
        .select('*', { count: 'exact', head: true })
    results.push({ level: 2, count: c2, error: e2 })

    // 3. Level 3
    const { count: c3, error: e3 } = await supabase
        .from('lessons')
        .update({ level: 3, stage: 'objection', category: 'Einwände & Vorbehalte' })
        .gte('slug', 'P026')
        .lte('slug', 'P099')
        .select('*', { count: 'exact', head: true })
    results.push({ level: 3, count: c3, error: e3 })

    // 4. Level 4
    const { count: c4, error: e4 } = await supabase
        .from('lessons')
        .update({ level: 4, stage: 'closing', category: 'Closing & Spezialfälle' })
        .gte('slug', 'P100')
        .select('*', { count: 'exact', head: true })
    results.push({ level: 4, count: c4, error: e4 })

    return NextResponse.json({ success: true, results })
}

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Manually read .env.local because dotenv might not be installed in this context
const envPath = path.resolve(__dirname, '../.env.local')
const envFile = fs.readFileSync(envPath, 'utf8')

const getEnv = (key: string) => {
    const match = envFile.match(new RegExp(`^${key}=(.+)`, 'm'))
    if (!match) return undefined
    // Remove quotes if present
    return match[1].trim().replace(/^["']|["']$/g, '')
}

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL')
const supabaseServiceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY')

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase URL or Service Key')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function migrateLevels() {
    console.log('🚀 Starting Level Migration...')

    // 1. Level 1: Intro / Mindset (P001 - P009)
    const { error: e1 } = await supabase
        .from('lessons')
        .update({ level: 1, stage: 'intro', category: 'Mindset & Grundlagen' })
        .ilike('slug', 'P00%')

    if (e1) console.error('Error migrating Level 1:', e1)
    else console.log('✅ Level 1 (Grundlagen) updated.')

    // 2. Level 2: Pitch / Eröffnung (P010 - P025)
    // Note: Assuming P010-P025 are roughly opening/pitch related based on numbering
    const { error: e2 } = await supabase
        .from('lessons')
        .update({ level: 2, stage: 'pitch', category: 'Eröffnung & Analyse' })
        .gte('slug', 'P010')
        .lte('slug', 'P025')

    if (e2) console.error('Error migrating Level 2:', e2)
    else console.log('✅ Level 2 (Pitch) updated.')

    // 3. Level 3: Einwandbehandlung (P026 - P099) - The Core
    const { error: e3 } = await supabase
        .from('lessons')
        .update({ level: 3, stage: 'objection', category: 'Einwände & Vorbehalte' })
        .gte('slug', 'P026')
        .lte('slug', 'P099')

    if (e3) console.error('Error migrating Level 3:', e3)
    else console.log('✅ Level 3 (Einwände) updated.')

    // 4. Level 4: Closing / Spezial (P100+)
    const { error: e4 } = await supabase
        .from('lessons')
        .update({ level: 4, stage: 'closing', category: 'Closing & Spezialfälle' })
        .gte('slug', 'P100')

    if (e4) console.error('Error migrating Level 4:', e4)
    else console.log('✅ Level 4 (Closing) updated.')

    console.log('🎉 Migration complete!')
}

migrateLevels()

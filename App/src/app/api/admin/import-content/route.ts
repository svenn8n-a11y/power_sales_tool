import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Force dynamic to avid static caching of envs
export const dynamic = 'force-dynamic'

// CONFIG
const DOCS_DIR = '/Users/sven/Documents/03 KI/SALESTOOL/Academy/Produkte_Dienstleistungen/Workwear';

// HELPER: Extract Section
function extractSection(content: string, headerName: string) {
    const list = content.split('\n');
    let capturing = false;
    let extracted: string[] = [];

    for (const line of list) {
        if (line.match(new RegExp(`^##.*${headerName}`, 'i'))) {
            capturing = true;
            continue;
        }
        if (capturing && line.startsWith('## ')) {
            break;
        }
        if (capturing) {
            extracted.push(line);
        }
    }
    return extracted.join('\n').trim();
}

// HELPER: Parse DISG
function parseDisgTable(mdContent: string) {
    const lines = mdContent.split('\n');
    let inTable = false;
    const matrix: any = {};

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.includes('| Typ | Exakter Wortlaut |')) {
            inTable = true;
            i++;
            continue;
        }
        if (inTable) {
            if (!line.startsWith('|')) {
                inTable = false;
                break;
            }
            const parts = line.split('|').map(p => p.trim()).filter(p => p);
            const type = parts[0]?.replace(/\*\*/g, '').trim();
            if (['D', 'I', 'S', 'G'].includes(type) && type) {
                matrix[type] = {
                    quote: parts[1] || '',
                    tone: parts[2] || '',
                    body_language: parts[3] || '',
                    intent: parts[4] || ''
                };
            }
        }
    }
    return matrix;
}

export async function GET() {
    console.log('🦈 API Import Starting...');

    // 1. Init Supabase with Server Envs
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json({ error: 'Missing Server Envs' }, { status: 500 });
    }

    // REPAIR KEY: 
    // 1. Remove spaces
    if (supabaseKey.includes(' ')) {
        supabaseKey = supabaseKey.replace(/\s+/g, '');
    }
    // 2. Remove garbage prefix (look for standard JWT header start)
    const jwtStart = 'eyJhbGci';
    const startIndex = supabaseKey.indexOf(jwtStart);
    if (startIndex > 0) {
        console.log('🔧 Found JWT start at index', startIndex, '- slicing garbage prefix.');
        supabaseKey = supabaseKey.substring(startIndex);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 2. Read Files
    if (!fs.existsSync(DOCS_DIR)) {
        return NextResponse.json({ error: 'Docs Dir not found', path: DOCS_DIR }, { status: 404 });
    }

    const files = fs.readdirSync(DOCS_DIR).filter(f => f.endsWith('.md'));
    let updatedCount = 0;
    let errors: any[] = [];

    for (const file of files) {
        try {
            const fullPath = path.join(DOCS_DIR, file);
            if (fs.statSync(fullPath).isDirectory()) continue;

            const slug = file.replace('.md', '').toLowerCase();
            const content = fs.readFileSync(fullPath, 'utf-8');

            const disgMatrix = parseDisgTable(content);
            const psychology = extractSection(content, 'Psychologische Absicht');
            const framework = extractSection(content, 'Response Framework');
            const metrics = extractSection(content, 'Erfolgsmetriken');
            const specificTechniques = extractSection(content, 'Spezifische Techniken');

            const extendedContent = {
                psychology_md: psychology,
                framework_md: framework,
                metrics_md: metrics,
                techniques_md: specificTechniques,
                source_file: file
            };

            if (Object.keys(disgMatrix).length > 0 || psychology.length > 0) {
                // Fetch current
                const { data: current } = await supabase.from('lessons').select('content').eq('slug', slug).single();
                const newContent = { ...(current?.content || {}), ...extendedContent };

                // Upsert (Insert or Update)
                // Derive title from filename roughly (P123_foo_bar -> Foo Bar) or from first line of content?
                // Markdown usually starts with # Title. Let's try to extract it.
                let title = slug;
                const titleMatch = content.match(/^# (.*)$/m);
                if (titleMatch) {
                    title = titleMatch[1].replace(/^#P\d+: "/, '').replace(/"$/, '').trim(); // Clean up "# #P010: "Title""
                }

                const { error } = await supabase
                    .from('lessons')
                    .upsert({
                        slug: slug,
                        title: title || slug,
                        disg_matrix: disgMatrix,
                        content: newContent,
                        category: 'Workwear',
                        level: 1, // Default to 1 (Intro) for new ones, can be overridden later
                        stage: 'intro'
                    }, { onConflict: 'slug' })

                if (error) throw error;
                updatedCount++;
            }
        } catch (err: any) {
            console.error('Import Error', file, err);
            errors.push({ file, msg: err.message });
        }
    }

    return NextResponse.json({
        success: true,
        processed: files.length,
        updated: updatedCount,
        errors
    });
}

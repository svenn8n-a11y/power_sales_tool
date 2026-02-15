// scripts/extract_content_deep.mjs
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// --- CONFIG ---
const DOCS_DIR = '/Users/sven/Documents/03 KI/SALESTOOL/Academy/Produkte_Dienstleistungen/Workwear';
const ENV_PATH = '/Users/sven/Documents/03 KI/SALESTOOL/Academy/App/.env.local';

// --- HELPER: Read Env (Improved + Key Repair) ---
function getEnv() {
    try {
        const content = fs.readFileSync(ENV_PATH, 'utf-8');
        const env = {};
        content.split('\n').forEach(line => {
            if (line.trim().startsWith('#')) return;
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                let val = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');

                // REPAIR KEY: Remove spaces if it looks like a JWT (starts with eyJ)
                if (val.startsWith('eyJh') && val.includes(' ')) {
                    console.log(`🔧 Repairing key for ${key}...`);
                    val = val.replace(/\s+/g, '');
                }
                env[key] = val;
            }
        });
        return env;
    } catch (e) {
        console.error('Could not read .env.local');
        return {};
    }
}

const env = getEnv();
// Fallback to logs if keys missing
if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing Keys in .env.local');
    process.exit(1);
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// --- HELPER: Extract Section by Header ---
function extractSection(content, headerName) {
    const list = content.split('\n');
    let capturing = false;
    let extracted = [];

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

// --- HELPER: Parse Markdown Table (DISG) ---
function parseDisgTable(mdContent) {
    const lines = mdContent.split('\n');
    let inTable = false;
    const matrix = {};

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
            if (['D', 'I', 'S', 'G'].includes(type)) {
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

// --- MAIN ---
async function main() {
    console.log('🦈 Deep Dive Extraction Starting (Flat Mode + Workwear Tag)...');

    if (!fs.existsSync(DOCS_DIR)) {
        console.error(`❌ Directory not found: ${DOCS_DIR}`);
        process.exit(1);
    }

    const files = fs.readdirSync(DOCS_DIR).filter(f => f.endsWith('.md'));
    console.log(`Found ${files.length} markdown files.`);

    for (const file of files) {
        const fullPath = path.join(DOCS_DIR, file);
        if (fs.statSync(fullPath).isDirectory()) continue;

        // Slug parsing: P001_zu_teuer.md -> p001_zu_teuer
        const slug = file.replace('.md', '').toLowerCase();
        const content = fs.readFileSync(fullPath, 'utf-8');

        // 1. DISG Matrix
        const disgMatrix = parseDisgTable(content);

        // 2. Deep Content Sections
        const psychology = extractSection(content, 'Psychologische Absicht');
        const framework = extractSection(content, 'Response Framework');
        const metrics = extractSection(content, 'Erfolgsmetriken');
        const specificTechniques = extractSection(content, 'Spezifische Techniken');

        // 3. Construct Payload
        const extendedContent = {
            psychology_md: psychology,
            framework_md: framework,
            metrics_md: metrics,
            techniques_md: specificTechniques,
            source_file: file
        };

        // Only update if we found something meaningful
        if (Object.keys(disgMatrix).length > 0 || psychology.length > 0) {
            process.stdout.write(`Processing ${slug}... `);

            const { data: current } = await supabase.from('lessons').select('content').eq('slug', slug).single();
            const newContent = { ...(current?.content || {}), ...extendedContent };

            const { error } = await supabase
                .from('lessons')
                .update({
                    disg_matrix: disgMatrix,
                    content: newContent,
                    category: 'Workwear' // Explicitly setting Product Category
                })
                .eq('slug', slug);

            if (error) {
                console.log(`❌ Error: ${error.message}`);
            } else {
                console.log(`✅`);
            }
        }
    }
    console.log('🎉 Deep Extraction Complete!');
}

main();

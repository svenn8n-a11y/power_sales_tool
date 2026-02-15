import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// --- CONFIG ---
const DOCS_DIR = '/Users/sven/Documents/03 KI/SALESTOOL/GitHub_Collaboration/output';
// Note: We need SUPABASE_URL and KEY. Ideally from env or passed as args.
// For this script, we might need the user to provide them or read from .env.local
// I will attempt to read .env.local from App dir.
const ENV_PATH = '/Users/sven/Documents/03 KI/SALESTOOL/Academy/App/.env.local';

// --- HELPER: Read Env ---
function getEnv() {
    try {
        const content = fs.readFileSync(ENV_PATH, 'utf-8');
        const env: any = {};
        content.split('\n').forEach(line => {
            const [key, val] = line.split('=');
            if (key && val) env[key.trim()] = val.trim().replace(/"/g, '');
        });
        return env;
    } catch (e) {
        console.error('Could not read .env.local');
        return {};
    }
}

const env = getEnv();
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// --- HELPER: Parse Markdown Table ---
function parseDisgTable(mdContent) {
    const lines = mdContent.split('\n');
    let inTable = false;
    let headers = [];
    const matrix = {};

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Find Table Start
        if (line.includes('| Typ | Exakter Wortlaut |')) {
            inTable = true;
            headers = ['type', 'quote', 'tone', 'body', 'intent']; // Normalized headers
            i++; // Skip separator line |---|---|
            continue;
        }

        if (inTable) {
            if (!line.startsWith('|')) {
                inTable = false;
                break; // End of table
            }

            const parts = line.split('|').map(p => p.trim()).filter(p => p);
            // parts[0] is Type (D, I, S, G)
            const type = parts[0].replace(/\*\*/g, '').trim(); // Remove bold **D**

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
    console.log('🤖 Starting DISC Content Extraction...');

    // Walk through all batch folders
    const batches = fs.readdirSync(DOCS_DIR).filter(f => f.startsWith('batch_'));

    for (const batch of batches) {
        const batchPath = path.join(DOCS_DIR, batch);
        const files = fs.readdirSync(batchPath).filter(f => f.endsWith('.md'));

        for (const file of files) {
            const slug = file.replace('.md', '').toLowerCase(); // Filename is basically the slug P001_...
            const content = fs.readFileSync(path.join(batchPath, file), 'utf-8');

            const disgMatrix = parseDisgTable(content);
            const hasData = Object.keys(disgMatrix).length > 0;

            if (hasData) {
                console.log(`Processing ${slug}: Found DISC data.`);

                // Update Database
                const { error } = await supabase
                    .from('lessons')
                    .update({ disg_matrix: disgMatrix })
                    .eq('slug', slug);

                if (error) {
                    console.error(`❌ Error updating ${slug}:`, error.message);
                } else {
                    console.log(`✅ Updated ${slug}`);
                }
            } else {
                console.warn(`⚠️ No DISC table found in ${file}`);
            }
        }
    }
    console.log('🎉 Done!');
}

main();

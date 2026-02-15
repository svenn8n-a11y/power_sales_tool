
import os
import re
import json
import glob
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
script_dir = Path(__file__).parent
env_path = script_dir.parent / 'App' / '.env.local'
print(f"Loading env from: {env_path.resolve()}")
load_dotenv(env_path)

url: str = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
# Use Service Role Key for Admin Access (Bypass RLS)
service_key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") 

if not url or not service_key:
    print("Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in ../App/.env.local")
    exit(1)

# Auto-clean key (Handle "Prefix Key" or "Key " cases)
if service_key:
    if ' ' in service_key:
        print("WARNING: Key contained spaces. Taking the last part as the valid key.")
        service_key = service_key.split()[-1]
    else:
        service_key = service_key.strip()

print(f"URL: {url}")
supabase: Client = create_client(url, service_key)

# Define Batches
BASE_PATH = "../GitHub_Collaboration/output"

def parse_markdown(content):
    """
    Parses a specialized Sales Academy Markdown file into structured data.
    """
    lines = content.split('\n')
    # Robust Title Extraction
    title = lines[0].replace('# ', '').strip()
    if ':' in title:
        slug = title.split(':')[0].strip().replace('#', '').lower() # e.g., p007
    else:
        # Fallback if title format is different
        slug = title.replace(' ', '-').lower()[:20]
    
    # Extract Metadata
    meta = {}
    for line in lines[:15]: # Scan first 15 lines
        if "**Häufigkeit:**" in line:
            meta['frequency'] = line.split('⭐')[1].strip() if '⭐' in line else line.split(':**')[1].strip()
        if "**DISG-Profile:**" in line:
            meta['disg_profile'] = line.split(':')[1].strip()
            
    # Extract Sections
    sections = {}
    current_section = None
    buffer = []
    
    for line in lines:
        if line.startswith('## '):
            if current_section:
                sections[current_section] = '\n'.join(buffer).strip()
            current_section = line.replace('## ', '').strip()
            buffer = []
        else:
            buffer.append(line)
            
    if current_section:
         sections[current_section] = '\n'.join(buffer).strip()
         
    # Parse DISG Matrix (Markdown Table to JSON)
    disg_matrix = {}
    matrix_section = sections.get('DISG-Variations-Matrix')
    if matrix_section:
        table_lines = matrix_section.split('\n')
        # Skip header and separator
        data_rows = [l for l in table_lines if '|' in l and '---' not in l and 'Typ' not in l]
        for row in data_rows:
            cols = [c.strip() for c in row.split('|') if c.strip()]
            if len(cols) >= 4:
                type_key = cols[0].replace('**', '').strip() # D, I, S, G
                disg_matrix[type_key] = {
                    "wording": cols[1],
                    "tone": cols[2],
                    "body_lang": cols[3],
                    "intent": cols[4] if len(cols) > 4 else ""
                }

    # Construct Vark Content 
    vark_content = {
        "V": sections.get('Visualisierung') or "Video coming soon...",
        "A": sections.get('Audio-Skript') or "Audio coming soon...",
        "R": sections.get('Response Framework') or sections.get('Psychologische Absicht'),
        "K": sections.get('Response Framework') or "Simulation coming soon..."
    }

    return {
        "slug": slug,
        "title": title,
        "category": "Objection Handling",
        "content_markdown": content,
        "meta_json": meta,
        "disg_matrix": disg_matrix,
        "vark_content": vark_content
    }

def ingest_file(filepath):
    # Skip INDEX files
    if "INDEX.md" in filepath or "README" in filepath:
        return

    print(f"Processing {filepath}...")
    try:
        with open(filepath, 'r') as f:
            content = f.read()
            
        data = parse_markdown(content)
        
        # Upsert into DB
        response = supabase.table('lessons').upsert({
            "slug": data['slug'],
            "title": data['title'],
            "category": data['category'],
            "content_markdown": data['content_markdown'],
            "meta_json": data['meta_json'],
            "disg_matrix": data['disg_matrix'],
            "vark_content": data['vark_content']
        }, on_conflict='slug').execute()
        
        print(f"✅ Imported: {data['slug']}")
    except Exception as e:
        print(f"❌ Error importing {filepath}: {e}")

def main():
    print("🚀 Starting Multi-Batch Ingestion (1-5)...")
    
    total_files = 0
    batches = [f"batch_{i}" for i in range(1, 6)]
    
    for batch in batches:
        batch_dir = os.path.join(BASE_PATH, batch)
        if not os.path.exists(batch_dir):
            print(f"⚠️ Batch folder not found: {batch_dir}")
            continue
            
        print(f"\n📂 Scanning {batch}...")
        files = glob.glob(os.path.join(batch_dir, "*.md"))
        files.sort()
        
        print(f"Found {len(files)} files.")
        for f in files:
            ingest_file(f)
            total_files += 1
            
    print(f"\n✨ DONE! Processed {total_files} files.")

if __name__ == "__main__":
    main()

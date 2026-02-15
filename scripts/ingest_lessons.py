
import os
import re
import json
import glob
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv('../App/.env.local')

url: str = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key: str = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
# For write access, we might need SERVICE_ROLE_KEY if RLS blocks anon writes.
# But for now, let's try ANON (if RLS allows insert for user, but script is not user).
# Ideally, user should provide SERVICE_ROLE_KEY in .env.local for admin scripts.
service_key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") 

if not url or not service_key:
    print("Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in ../App/.env.local")
    print("Please add SUPABASE_SERVICE_ROLE_KEY to your .env.local file (get it from Supabase Dashboard > Settings > API).")
    exit(1)

supabase: Client = create_client(url, service_key)

SOURCE_DIR = "../GitHub_Collaboration/output/batch_1" # Start with batch 1

def parse_markdown(content):
    """
    Parses a specialized Sales Academy Markdown file into structured data.
    """
    lines = content.split('\n')
    title = lines[0].replace('# ', '').strip()
    slug = title.split(':')[0].strip().replace('#', '').lower() # e.g., p007
    
    # Extract Metadata
    meta = {}
    for line in lines[:10]:
        if "**Häufigkeit:**" in line:
            meta['frequency'] = line.split('⭐')[1].strip() if '⭐' in line else line
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
    if 'DISG-Variations-Matrix' in sections:
        table_lines = sections['DISG-Variations-Matrix'].split('\n')
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

    # Construct Vark Content (Derived/Mocked for now since not explicit in MD)
    # Strategy: Use specific sections for specific types
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
    print(f"Processing {filepath}...")
    with open(filepath, 'r') as f:
        content = f.read()
        
    data = parse_markdown(content)
    
    # Upsert into DB
    try:
        response = supabase.table('lessons').upsert({
            "slug": data['slug'],
            "title": data['title'],
            "category": data['category'],
            "content_markdown": data['content_markdown'],
            "meta_json": data['meta_json'],
            "disg_matrix": data['disg_matrix'],
            "vark_content": data['vark_content']
        }, on_conflict='slug').execute()
        print(f"✅ Imported: {data['title']}")
    except Exception as e:
        print(f"❌ Error inserting {data['title']}: {e}")

def main():
    # Find all MD files
    files = glob.glob(os.path.join(SOURCE_DIR, "*.md"))
    print(f"Found {len(files)} files in {SOURCE_DIR}")
    
    for f in files:
        ingest_file(f)

if __name__ == "__main__":
    main()

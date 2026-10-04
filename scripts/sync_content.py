"""
ETC (Ethical Coders) - Auto Sync Script
Scans the Tryhackme/ directory for any .md files and automatically updates js/writeups.js!
Run: python scripts/sync_content.py
"""
import os
import re
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TRYHACKME_DIR = os.path.join(BASE_DIR, 'Tryhackme')
WRITEUPS_JS = os.path.join(BASE_DIR, 'webpage', 'js', 'writeups.js')

def sync_writeups():
    if not os.path.exists(TRYHACKME_DIR):
        print("Tryhackme directory not found.")
        return

    writeups = []
    
    for fname in sorted(os.listdir(TRYHACKME_DIR)):
        if fname.endswith('.md') and fname.lower() != 'readme.md':
            fpath = os.path.join(TRYHACKME_DIR, fname)
            with open(fpath, 'r', encoding='utf-8') as f:
                content = f.read()

            # Extract title (first # heading)
            title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
            title = title_match.group(1).strip() if title_match else fname.replace('.md', '').replace('_', ' ')

            # Clean title
            title = re.sub(r'^(Technical Walkthrough:\s*|CTF Command Playbook:\s*)', '', title)

            # Determine category & platform
            category = 'tryhackme'
            platform = 'TryHackMe'
            if 'arsenal' in fname.lower() or 'cheat' in fname.lower():
                category = 'arsenal'
                platform = 'All Platforms'
            elif 'privesc' in content.lower() or 'linpeas' in content.lower():
                category = 'linux'
            elif 'injection' in content.lower() or 'web' in content.lower():
                category = 'web'

            # Extract snippet
            snippet_match = re.search(r'>\s*\*\*(.+?)\*\*', content)
            snippet = snippet_match.group(1) if snippet_match else "Comprehensive step-by-step CTF walkthrough with commands and explanations."

            # Tags
            tags = ['CTF', platform]
            if 'linux' in content.lower(): tags.append('Linux')
            if 'web' in content.lower(): tags.append('Web')
            if 'cve' in content.lower(): tags.append('CVE')
            if 'stego' in content.lower(): tags.append('Stego')

            slug = fname.replace('.md', '').lower().replace(' ', '-').replace('_', '-')
            github_url = f"https://github.com/harsh-hak/ETC-Ethical-Coders/blob/main/Tryhackme/{fname}"

            writeups.append({
                'id': slug,
                'title': title,
                'platform': platform,
                'date': '2026',
                'category': category,
                'tags': list(dict.fromkeys(tags))[:5],
                'snippet': snippet,
                'githubUrl': github_url
            })

    # Write back to webpage/js/writeups.js
    js_content = f"""/**
 * ETC (Ethical Coders) - Writeups Catalog
 * Auto-synced from Tryhackme/ markdown files
 * Each writeup opens directly in the GitHub repository window
 */

export const writeupsData = {json.dumps(writeups, indent=2)};

export function initWriteups() {{
  const container = document.getElementById('writeups-grid-container');
  if (!container) return;

  container.innerHTML = '';

  writeupsData.forEach(item => {{
    const card = document.createElement('a');
    card.className = 'writeup-card reveal';
    card.href = item.githubUrl;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.setAttribute('title', `Open ${{item.title}} on GitHub`);

    card.innerHTML = `
      <div class="writeup-card-header">
        <span class="writeup-platform">${{item.platform}}</span>
        <span class="writeup-date">${{item.date}}</span>
      </div>
      <h3 class="writeup-title">${{item.title}}</h3>
      <p class="writeup-snippet">${{item.snippet}}</p>
      <div class="writeup-meta-footer">
        <div class="writeup-tags">
          ${{item.tags.slice(0, 3).map(t => `<span class="skill-tag">#${{t}}</span>`).join('')}}
        </div>
        <span class="writeup-read-action">Read Writeup ↗</span>
      </div>
    `;

    container.appendChild(card);
  }});
}}
"""

    with open(WRITEUPS_JS, 'w', encoding='utf-8') as f:
        f.write(js_content)

    print(f" Successfully synced {len(writeups)} writeups into webpage/js/writeups.js!")

if __name__ == '__main__':
    sync_writeups()

/**
 * ETC (Ethical Coders) - Writeups Catalog
 * Auto-synced from Tryhackme/ markdown files
 * Each writeup opens directly in the GitHub repository window
 */

export const writeupsData = [
  {
    "id": "ctf-command-arsenal",
    "title": "CTF Command Arsenal",
    "platform": "All Platforms",
    "date": "2026",
    "category": "arsenal",
    "tags": [
      "CTF",
      "All Platforms",
      "Linux",
      "Web",
      "CVE"
    ],
    "snippet": "Commands Organized by Use-Case \u2014 Syntax, Purpose & Applications",
    "githubUrl": "https://github.com/harsh-hak/ETC-Ethical-Coders/blob/main/Tryhackme/CTF_Command_Arsenal.md"
  },
  {
    "id": "catpictures-ii-full-walkthrough",
    "title": "CatPictures-II",
    "platform": "TryHackMe",
    "date": "2026",
    "category": "linux",
    "tags": [
      "CTF",
      "TryHackMe",
      "Linux",
      "Web",
      "CVE"
    ],
    "snippet": "Capture-The-Flag \u2014 Full Three-Flag Exploitation Report",
    "githubUrl": "https://github.com/harsh-hak/ETC-Ethical-Coders/blob/main/Tryhackme/CatPictures-II_Full_Walkthrough.md"
  },
  {
    "id": "ua-high-school-ctf-command-playbook",
    "title": "U.A. High School",
    "platform": "TryHackMe",
    "date": "2026",
    "category": "linux",
    "tags": [
      "CTF",
      "TryHackMe",
      "Web",
      "Stego"
    ],
    "snippet": "A Command-by-Command Learning Reference",
    "githubUrl": "https://github.com/harsh-hak/ETC-Ethical-Coders/blob/main/Tryhackme/UA_High_School_CTF_Command_Playbook.md"
  }
];

export function initWriteups() {
  const container = document.getElementById('writeups-grid-container');
  if (!container) return;

  container.innerHTML = '';

  writeupsData.forEach(item => {
    const card = document.createElement('a');
    card.className = 'writeup-card reveal';
    card.href = item.githubUrl;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.setAttribute('title', `Open ${item.title} on GitHub`);

    card.innerHTML = `
      <div class="writeup-card-header">
        <span class="writeup-platform">${item.platform}</span>
        <span class="writeup-date">${item.date}</span>
      </div>
      <h3 class="writeup-title">${item.title}</h3>
      <p class="writeup-snippet">${item.snippet}</p>
      <div class="writeup-meta-footer">
        <div class="writeup-tags">
          ${item.tags.slice(0, 3).map(t => `<span class="skill-tag">#${t}</span>`).join('')}
        </div>
        <span class="writeup-read-action">Read Writeup ↗</span>
      </div>
    `;

    container.appendChild(card);
  });
}

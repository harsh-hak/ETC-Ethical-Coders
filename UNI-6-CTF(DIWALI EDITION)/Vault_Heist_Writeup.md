# Vault Heist — UNI6CTF 2.0 (Forensics / Web) Writeup

**Event:** UNI6CTF 2.0 – Diwali Edition  
**Team:** ETC (Ethical Coders)  
**Category:** Forensics / Log Analysis / Web Security  
**Flag:** `UNI6CTF{sl0w_dr1p_bl1nd_sqli_l0g_h4unt3r_7c2e}`  

---

## 🔍 Challenge Overview

> An e-commerce shop API leaked confidential data from the database overnight.  
> The Web Application Firewall (WAF) never triggered an alert, and the SIEM flagged only one noisy automated scanner.  
> Identify what the real attacker extracted from the `vault` table.

We are provided with `access.log`, an HTTP server access log containing ~4,700 request records.

---

## 🛠️ Forensic Analysis

### 1. Initial Triage & Endpoint Identification

Filtering the log for SQL injection primitives (`SELECT`, `UNION`, `ASCII`, `SUBSTRING`, `LIMIT`) immediately flags targeted traffic directed against `/api/products?id=`.

Analyzing requests by client IP identifies two completely separate threat actors:

1. **`198.51.100.23` (Decoy Scanner)**:
   - Sent ~230 rapid-fire requests within a few seconds.
   - User-Agent: `sqlmap/1.7.8`.
   - Payload target: `password_hash` from the `users` table.
   - *Verdict*: Loud automated distraction detected by SIEM.

2. **Distributed Stealth Cluster (6 IPs)**:
   - IPs: `185.220.101.4`, `185.220.101.17`, `185.220.101.33`, `185.220.101.58`, `45.153.160.9`, `45.153.160.41`.
   - Sent ~470 requests spaced out over a broad timeline using legitimate Chrome desktop headers.
   - Payload target: `secret` from the `vault` table.
   - *Verdict*: The true adversary executing a low-and-slow distributed extraction.

---

### 2. Injection Primitive & Oracle Analysis

The attack payload implements a boolean-based blind SQL injection using binary search:

```sql
id=1 AND ASCII(SUBSTRING((SELECT secret FROM vault LIMIT 0,1), POS, 1)) > N
```

To evade signatures, the attacker applied varied evasion techniques:
- Alternating case (`aSCIi`, `sUBstRinG`).
- Whitespace replacements using `+`, `%20`, and inline comments `/**/`.

**Response Oracle Identification**:
- **Condition Evaluated to TRUE**: Returns normal product catalog JSON payload (~1,800 bytes, HTTP 200).
- **Condition Evaluated to FALSE**: Returns short application error string (~215 bytes, HTTP 200).
- **Rate-Limited Requests**: HTTP 429 response (146 bytes) containing no state.

---

### 3. Automated Flag Reconstruction Script

For each character position `POS`, the highest threshold `N` that returned `True` defines the lower bound, while the lowest `N` that returned `False` defines the exact ASCII character value ($N_{\text{false}} = N_{\text{true}} + 1$).

```python
import re, urllib.parse, collections, base64

obs = collections.defaultdict(list)

with open('access.log', 'r', encoding='utf-8') as f:
    for line in f:
        m = re.match(r'(\S+) .*?\[(.*?)\] "GET (\S+) HTTP/1.1" (\d+) (\d+)', line)
        if not m:
            continue
        ip, _, url, status, size = m.groups()
        if ip == '198.51.100.23' or status != '200':
            continue
        
        # Normalize and remove evasion comments
        decoded_url = re.sub(r'/\*.*?\*/', ' ', urllib.parse.unquote_plus(url))
        match = re.search(r'from vault limit (\d+),(\d+)\),(\d+),(\d+)\)\)>(\d+)', decoded_url, re.I)
        if match:
            pos, thr = int(match[3]), int(match[5])
            obs[pos].append((thr, int(size) > 1000))

# Reconstruct 64-character payload
secret = ''
for pos in sorted(obs):
    lo = max((t for t, b in obs[pos] if b), default=-1)
    hi = min(t for t, b in obs[pos] if not b)
    assert hi == lo + 1, f"Ambiguity at position {pos}"
    secret += chr(hi)

print(f"Recovered Base64: {secret}")
print(f"Decoded Flag: {base64.b64decode(secret).decode()}")
```

---

## 🚩 Flag

Decoded payload from 64-character ASCII stream:
```text
VU5JNkNURntzbDB3X2RyMXBfYmwxbmRfc3FsaV9sMGdfaDR1bnQzcl83YzJlfQ==
```

Base64 Decoded:
```text
UNI6CTF{sl0w_dr1p_bl1nd_sqli_l0g_h4unt3r_7c2e}
```

---

## 💡 Key Takeaways

- **Distributed Low & Slow Attacks**: Modern attackers split threshold queries across IP pools with human-paced intervals to bypass volume-based WAF triggers.
- **Log Differential Analysis**: When analyzing breach incidents, isolate noisy standard scanners from targeted persistent queries directed at sensitive tables.
- **Content-Length Information Leaks**: Even when HTTP response statuses are uniformly 200 OK without verbose database errors, byte-length discrepancies form a reliable binary oracle.


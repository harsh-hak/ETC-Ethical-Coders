# Direct0ry — UNI6CTF 2.0 Writeup

**Event:** UNI6CTF 2.0 – Diwali Edition  
**Team:** ETC (Ethical Coders)  
**Category:** Web / Recon / Directory Enumeration  
**Flag:** `UNI6CTF{R0B0TS_H1D3_TH3_S1GN4L}`  

---

## 🎯 Core Concept

The target application does not store useful records at the web root. By following crawler instructions in `/robots.txt` into `/node/`, we discover 100 nested directories. Each node holds its own `robots.txt` file. Using metadata archive index markers, we order genuine payloads, discard decoy fragments, and reconstruct the full flag.

---

## 🧭 Step-by-Step Methodology

### 1. Root Clue & Crawler Policy

Accessing the root `/robots.txt` file exposes crawler exclusions and critical operational hints:

```http
User-agent: *
Disallow: /node/
```

- **Disclosed Details**: The file disallows indexing of `/node/`, reports 100 recovered nodes, warns that records may be fabricated or empty, and instructs investigators to trust the `archive-index` rather than payloads in isolation.

---

### 2. Enumerating Nested Nodes

The directory enumeration spans `/node/001/` through `/node/100/`:
- Most nested directories either return standard crawler rules or empty declarations.
- A subset of nodes contains inline comments specifying an `archive-index` and a `recovered-payload`.

For example:
```text
# archive-index: 05/07
# recovered-payload: TH3_S
```
An index like `05/07` indicates that the fragment claims position 5 of a 7-part sequence.

---

### 3. Decoy Payloads vs Authentic Fragments

Multiple nodes claimed the same positional indices with decoy payloads such as `CTF{DECOY}`, `R0B0T_`, `N0T_TH3_0N3`, `S1GN4L_LOST`, and `FAKE_SIGNAL`.

Genuine fragments were isolated by ensuring:
1. They adhere to the strict flag wrapper (`UNI6CTF{...}`).
2. Joined in sequential index order (01/07 to 07/07), they construct a coherent English sentence.

---

### 4. Fragment Sequencing Table

Filtering the genuine nodes yields the complete 7-fragment sequence:

| Index | Node Path | Fragment | Notes |
| :---: | :--- | :---: | :--- |
| **01/07** | `/node/007/robots.txt` | `UNI6C` | Opening flag prefix |
| **02/07** | `/node/019/robots.txt` | `TF{R0` | Flag wrapper continuation |
| **03/07** | `/node/028/robots.txt` | `B0TS_` | "ROBOTS_" |
| **04/07** | `/node/041/robots.txt` | `H1D3_` | "HIDE_" |
| **05/07** | `/node/053/robots.txt` | `TH3_S` | "THE_S" |
| **06/07** | `/node/066/robots.txt` | `1GN4L` | "IGNAL" |
| **07/07** | `/node/097/robots.txt` | `}` | Closing brace |

---

## 🚩 Flag Assembly

Concatenating fragments 01 through 07 in order:

$$\text{UNI6C} + \text{TF\{R0} + \text{B0TS\_} + \text{H1D3\_} + \text{TH3\_S} + \text{1GN4L} + \text{\}}$$

```text
UNI6CTF{R0B0TS_H1D3_TH3_S1GN4L}
```

---

## 💡 Key Takeaways

- **Recursive Crawler Files**: `robots.txt` files can exist inside subdirectories and contain crucial enumeration leads.
- **Index-Driven Validation**: Always look for sequence headers (`x/y`) when parsing fragmented leaks.
- **Semantic Filtering**: Decoys often fail grammatical coherence or wrapper syntax when aligned across all positions.


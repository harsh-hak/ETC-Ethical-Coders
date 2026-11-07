# The Final Confession — UNI6CTF 2.0 (OSINT) Writeup

**Event:** UNI6CTF 2.0 – Diwali Edition  
**Team:** ETC 2 (DIGITAL_SHADOW) / ETC (Ethical Coders)  
**Category:** OSINT  
**Points:** 100  
**Flag:** `UNI6CTF{disk_metadata.txt}`  

---

## 🔍 Challenge Summary

The challenge provides no raw evidence files. The prompt states that the answer lies within the **original investigation story** of this challenge series, and requests:

> *"The exact filename associated with the external drive's metadata (PROJECT PHANTOM), including its extension."*

Flag format: `UNI6CTF{filename.extension}`

Connection Details link provided in the platform:
```text
https://chatgqtc.om/share/uae4a619-d524-83ee-a105-0df85f14eb42
```

---

## 🛠️ Step-by-Step Resolution

### 1. Link Reconstruction

Attempting to resolve the provided URL fails due to intentional typographical corruption:

| Section | Given String | Defect Identified | Corrected String |
| :--- | :--- | :--- | :--- |
| **Domain** | `chatgqtc.om` | Letters scrambled (`q` instead of `p`, misplaced dot) | `chatgpt.com` |
| **Share ID** | `uae4a619-...` | Hexadecimal UUID cannot contain `u` $\rightarrow$ rot/substitution typo | `6ae4a619-...` |

**Functional Target URL:**
```text
https://chatgpt.com/share/6ae4a619-d524-83ee-a105-0df85f14eb42
```

Opening this link renders a shared ChatGPT forensic case scenario titled **"THE SILENT WITNESS"**.

---

### 2. Forensic Story Analysis (PROJECT PHANTOM)

The case dossier outlines:
- **Case ID**: UNI6CTF-2026-017
- **Location**: Blackwood Research Facility
- **Subject**: Ethan Cole (Lead Cybersecurity Researcher)
- **Project**: PROJECT PHANTOM

The overarching story comprises five sequential phases:
1. The Last Login
2. A Photograph Never Lies
3. The Broken Archive
4. The Silent Network
5. **The Final Confession**

---

### 3. Identifying the External Drive Metadata File

In **Challenge 5: The Final Confession**, an anonymous package containing an external hard drive arrives at the forensics department. The archived evidence tree is documented as:

```text
THE_FINAL_CONFESSION.zip
├── external_drive.dd
├── disk_metadata.txt
├── deleted_fragments/
├── final_message.enc
└── README.txt
```

The metadata file linked to the physical external drive image is:
```text
disk_metadata.txt
```

---

### 4. Candidate Validation Matrix

| Filename | Status | Reason |
| :--- | :---: | :--- |
| `usb_metadata.txt` | ❌ | Associated with an alternate draft ("The Last Footprint") involving a flash drive, not PROJECT PHANTOM. |
| `final_message.enc` | ❌ | The encrypted payload itself, not metadata. |
| `external_drive.dd` | ❌ | Raw bit-stream disk image, not the metadata descriptor. |
| `archive_metadata.txt` | ❌ | Belongs to Challenge 3 (The Broken Archive). |
| `disk_metadata.txt` | ✅ | **Correct metadata file for the PROJECT PHANTOM external drive.** |

---

## 🚩 Final Flag

```text
UNI6CTF{disk_metadata.txt}
```

---

## 💡 Key Takeaways

- **URL Integrity Checks**: Investigate broken links for character swaps, transpositions, or non-hexadecimal digits in UUIDs.
- **Scenario Evidence Hierarchy**: Distinguish target disk metadata from container archives, data payloads, and unrelated draft storylines.


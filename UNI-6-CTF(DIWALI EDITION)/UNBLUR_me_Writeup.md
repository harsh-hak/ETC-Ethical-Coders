# UNBLUR .me — UNI6CTF 2.0 (Misc) Writeup

**Event:** UNI6CTF 2.0 – Diwali Edition  
**Team:** ETC (Ethical Coders)  
**Category:** Misc / Steganography  
**Points:** 400  
**Candidate Flag:** `UNI6CTF{f94708528f5f6fabd3435e146568544407cc15141a34abdf8ecaaa31bb3580d2}`  
**Status:** High-confidence candidate derived from PNG metadata chunk inspection. (Decoy on banner: `UNI6CTF{cc1bbebcedd70ecd5f676d3e5302b71bd7fc7f0ab3e0b4a80a84551a98a9b17b}`)

---

## 🎯 Challenge Details

| Parameter | Value |
| :--- | :--- |
| **Description** | *"simply copy paste me, don't blame me if you lost your attempt, single attempt only"* |
| **Hint** | *"visit sponsor page, there is a link of folder"* |
| **Objective** | Extract the true flag hidden within the asset linked from the sponsor page. |

---

## 🛠️ Step-by-Step Investigation

### 1. Uncovering the Hidden Link

Navigating to the Sponsors page revealed multiple sponsor cards, none displaying obvious download hyperlinks. Inspecting the page HTML source code revealed an unrendered Google Drive folder URL:

```text
https://drive.google.com/drive/folders/1Kzea86J8rySvvT-cXHQ-_hdbsTMU-8-a
```

---

### 2. File Retrieval

The shared folder `unblur` contained a single image: `ramayana.png`.
Viewing the Drive thumbnail showed a Ramayana Diwali battle illustration with a red banner containing a formatted CTF flag.

---

### 3. The Visual Decoy (Bait Analysis)

Zooming in on the original file banner reveals:

```text
UNI6CTF{cc1bbebcedd70ecd5f676d3e5302b71bd7fc7f0ab3e0b4a80a84551a98a9b17b}
```

Although the text is sharp and clearly transcribed, submitting this resulted in a rejected attempt. The challenge name *"UNBLUR"* combined with the warning *"don't blame me if you lost your attempt, single attempt only"* strongly signaled that the visually obvious text was deliberate bait.

---

### 4. Deep Forensic PNG Chunk Parsing

Downloading the original image directly and parsing the internal PNG chunk structure:

| PNG Chunk Type | Data Content | Assessment |
| :--- | :--- | :--- |
| `IHDR` | 1672 x 941, 8-bit RGB | Standard image header |
| `tEXt` Description | `"Ramayan-inspired Diwali battle illustration"` | Standard description |
| `tEXt` Comment | `f94708528f5f6fabd3435e146568544407cc15141a34abdf8ecaaa31bb3580d2` | **Hidden Hash Payload** |
| `IDAT` (x42) | Image compressed raster data | Pixel payload |
| `IEND` | End of image marker | Clean termination |

The `tEXt` **Comment** chunk embeds a 64-character hexadecimal SHA-256 hash string matching the exact format of the banner string.

---

## 🚩 Flag Candidates

* **Visual Bait (Rejected)**:
  ```text
  UNI6CTF{cc1bbebcedd70ecd5f676d3e5302b71bd7fc7f0ab3e0b4a80a84551a98a9b17b}
  ```
* **Extracted Chunk Metadata Flag**:
  ```text
  UNI6CTF{f94708528f5f6fabd3435e146568544407cc15141a34abdf8ecaaa31bb3580d2}
  ```

---

## 💡 Key Takeaways

- **Never Trust Rendered Bait in Single-Attempt Challenges**: When an organizer implements a strict attempt limit and claims *"simply copy paste me"*, assume visual flags are honeypots until metadata has been verified.
- **Inspect Low-Level Chunk Streams**: Standard image viewers discard or ignore non-critical ancillary PNG chunks (`tEXt`, `zTXt`, `eXIf`, `iTXt`). Use CLI parsers or `exiftool` to inspect every chunk byte.


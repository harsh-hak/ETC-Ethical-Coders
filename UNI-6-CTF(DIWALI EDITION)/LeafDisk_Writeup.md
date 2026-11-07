# LeafDisk — UNI6CTF 2.0 (Forensics) Writeup

**Event:** UNI6CTF 2.0 – Diwali Edition  
**Team:** ETC (Ethical Coders)  
**Category:** Digital Forensics / Filesystem Analysis  
**Flag:** `UNI6CTF{d3l3t3d_k3ys_n3v3r_d13_th3_xattr_r3m3mb3rs}`  

---

## 🔬 Challenge Overview

We are provided with a disk image `leafdisk_img.xz` acquired from a workstation whose owner attempted to clean up after themselves. The challenge description warns that the system contains decoys and false flags.

---

## 🛠️ Step-by-Step Investigation

### Step 1: Image Decompression & Identification

Decompressing the archive and determining file architecture:

```bash
xz -dk leafdisk_img.xz
file leafdisk.img
```

*Output:*
```text
Linux rev 1.0 ext4 filesystem data, volume name "LEAFDISK"
```

The image is an 8 MB Linux ext4 filesystem. We use `debugfs` to inspect the filesystem non-destructively without requiring root mounting privileges.

---

### Step 2: Triage & Decoy Flag Enumeration

Navigating user directory `/home/leaf/` reveals:
- `/home/leaf/.bash_history`
- `/home/leaf/.config/readme`
- `/home/leaf/.cache/junk0-5.bin`
- `/home/leaf/Documents/flag.txt`
- `/home/leaf/Documents/harvest.enc`
- `/home/leaf/Documents/notes.txt`
- `/var/log/auth.log`

Examining these files uncovers four distinct decoys:
1. `flag.txt` $\rightarrow$ `SecLeaf{fl4g_txt_1s_n0t_th3_fl4g}` (explicit fake flag)
2. `.config/readme` $\rightarrow$ `SecLeaf{3ncrypt3d_but_n0t_d0n3}`
3. `/var/log/auth.log` $\rightarrow$ `SecLeaf{4uth_l0g_n01s3}` (fake sudo entry)
4. `.bash_history` $\rightarrow$ Base64-encoded string decoding to another `SecLeaf{...}` decoy.

---

### Step 3: Forensic Analysis of User Activity

Inspecting the actual command sequence executed in `.bash_history`:

```bash
cd ~/.cache
for f in k_*.txt; do gzip -N $f; done   # rotate keys
openssl enc -aes-256-cbc -pbkdf2 -iter 100000 -salt -in harvest.txt -out Documents/harvest.enc -pass file:.cache/k_active
shred -u harvest.txt
rm -f .cache/k_*
history -c
```

**Key Findings:**
1. Key files were compressed with `gzip -N`.
2. Plaintext `harvest.txt` was encrypted into `harvest.enc` using **AES-256-CBC**, **PBKDF2** (100,000 iterations), and `k_active` as password.
3. `harvest.txt` was wiped using `shred -u` (unrecoverable).
4. Candidate key files in `.cache/` were unlinked with `rm -f` (recoverable via inode carving).

`Documents/notes.txt` provides the cryptographic fingerprint:
> *"Active key is the one whose sha256 is `d389cee5d239c721a5c0967d956d0826d182ca3f537a6f45b5ba40386c0a4c55`. Wrote it in gz form to rotate; cleaned up after."*

---

### Step 4: Carving Deleted Key Inodes

Using `debugfs` to inspect deleted inodes (`lsdel`):

```text
debugfs: lsdel
 Inode  Size  Time deleted
    24    62  Oct 19 2026
    25    65  Oct 19 2026
    26    66  Oct 19 2026
    27    63  Oct 19 2026
    34    40  Oct 19 2026
```

Dumping and decompressing inodes 24–27 yields four candidate rotation keys:

| Inode | Compressed Filename | Key String |
| :---: | :--- | :--- |
| **24** | `k_2024-10-02.txt.gz` | `leafkey:Gr33n-Sapl1ng-77` |
| **25** | `k_2024-10-09.txt.gz` | `leafkey:R00t-B4ll-Aut0mn-12` |
| **26** | `k_2024-10-11.txt.gz` | `leafkey:Phl03m-X7lem-Fl0w-90` |
| **27** | `k_2024-10-14.txt.gz` | `leafkey:C4mb1um-R1ng-2024` |

*(Note: Inode 34 was an unlinked shopping list text decoy).*

---

### Step 5: Identifying the Active Key

Hashing each candidate without the prefix `leafkey:` and trailing newline:

$$\text{sha256}(\text{"Phl03m-X7lem-Fl0w-90"}) = \text{d389cee5d239c721a5c0967d956d0826d182ca3f537a6f45b5ba40386c0a4c55}$$

This matches the note hash exactly. The active encryption key is:
```text
Phl03m-X7lem-Fl0w-90
```

---

### Step 6: Decrypting `harvest.enc`

Executing OpenSSL decryption:

```bash
printf '%s' 'Phl03m-X7lem-Fl0w-90' | \
  openssl enc -d -aes-256-cbc -pbkdf2 -iter 100000 -salt \
  -in harvest.enc -pass stdin
```

*Decrypted Output:*
```text
== harvest log ==
FLAG=SecLeaf{d3c0y_th3_tr33_h4s_n0_r00ts}
Part one of the real flag: d3l3t3d_k3ys_n3v3r_d13
Part two travels with the note, not inside it. (base32, attribute 'leaf')
Real flag format: SecLeaf{<part1><part2>}
```

* **Part 1 Flag Fragment**: `d3l3t3d_k3ys_n3v3r_d13`
* **Lead for Part 2**: "travels with the note, not inside it" $\rightarrow$ ext4 Extended Attribute (`xattr`) on `notes.txt`.

---

### Step 7: Carving Extended Attributes (xattr)

Querying extended attributes using `debugfs`:

```bash
debugfs -R "ea_list /home/leaf/Documents/notes.txt" leafdisk.img
```

*Output:*
```text
  user.leaf (32) = "L52GQM27PBQXI5DSL5ZDG3JTNVRDG4TT"
```

Decoding from Base32:
```bash
echo "L52GQM27PBQXI5DSL5ZDG3JTNVRDG4TT" | base32 -d
```
*Result:*
```text
_th3_xattr_r3m3mb3rs
```

* **Part 2 Flag Fragment**: `_th3_xattr_r3m3mb3rs`

---

## 🚩 Final Flag Assembly

Combining Part 1 and Part 2 wrapped in `UNI6CTF{...}`:

```text
d3l3t3d_k3ys_n3v3r_d13 + _th3_xattr_r3m3mb3rs
```

```text
UNI6CTF{d3l3t3d_k3ys_n3v3r_d13_th3_xattr_r3m3mb3rs}
```

---

## 💡 Key Takeaways

- **`rm` vs `shred`**: Unlinking (`rm`) only frees inode pointers; data blocks persist intact until overwritten.
- **ext4 Extended Attributes**: Alternate metadata streams (`user.*`) are invisible to standard file viewing utilities (`cat`, `head`, `ls`) and require specialized tools (`getfattr` or `debugfs ea_list`).
- **Defeating False Flags**: Treat easily accessible flag strings as honeypots when forensic clues suggest encrypted volumes or unlinked artefacts.


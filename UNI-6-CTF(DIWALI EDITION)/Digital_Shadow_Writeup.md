# Digital Shadow — UNI6CTF 2.0 (OSINT) Writeup

**Event:** UNI6CTF 2.0 – Diwali Edition  
**Team:** ETC (Ethical Coders)  
**Category:** OSINT  
**Flag:** `UNI6CTF{Expl0it3rs_d1g1t4l_f00tpr1nt_1s_n3v3r_s4f3_bUt_g00d}`  

---

## 🔍 Challenge Overview

> Behind every challenge is a creator. Behind every alias is a digital footprint.  
> Exploiter404 has been leaving traces across the internet. Some were intentional, others perhaps not.  
> Can you follow the trail and uncover the secret?  

The creator of the challenge is identified as **Kshitij Gupta** (alias **Exploiter404**). The flag is split across 3 distinct online platforms, each explicitly tagged with `"digital shadow"`.

---

## 🧩 Flag Reconstruction

### Part 1 — LinkedIn Post → X (Twitter)

1. **Hint H1 Analysis**: A hint points out that one of Kshitij's LinkedIn posts contains an X (Twitter) link.
2. Navigating to his LinkedIn profile (**Activity → Posts**) and clicking **Load more** to reach older historical posts reveals an edited post from ~3 months ago regarding `"CYBER CLASH by UNI6CTF"`.
3. The post ends with:
   ```text
   UNI6CTF2.0 - enjoy twitter 1st part digital shadow https://lnkd.in/gCtqghqg
   ```
4. Resolving the shortened URL redirects to:
   ```text
   https://x.com/16_kshitij1412
   ```
5. Inspecting the account bio reveals:
   ```text
   1stpart digital shadow UNI6CTF{Expl0it3rs_d1g1t4l_f00tpr1nt
   ```

* **Part 1 Flag Fragment**: `UNI6CTF{Expl0it3rs_d1g1t4l_f00tpr1nt`

---

### Part 2 — LinkedIn Experience

1. Visiting Kshitij's primary LinkedIn profile (`linkedin.com/in/kshitijgupta1806`, linked from his GitHub profile README).
2. Scrolling down to the **Experience** section and reviewing the role **CTF Challenge Developer @ UNI6CTF**.
3. At the end of the role description:
   ```text
   _1s_n3v3r_s4f3_ Digital shadow 2nd part
   ```

* **Part 2 Flag Fragment**: `_1s_n3v3r_s4f3_`

---

### Part 3 — GitHub Repository

1. Locating his GitHub profile: [`gupta09-oop`](https://github.com/gupta09-oop).
2. Checking recent commits across his repositories reveals that the repository `kshitij-resume` received an updated `README.md` right before the CTF kick-off (Nov 3):
   ```text
   bUt_g00d} last part Digital shadow
   ```

* **Part 3 Flag Fragment**: `bUt_g00d}`

---

## 🚩 Assembly & Final Flag

Concatenating the three ordered fragments:

```text
Part 1: UNI6CTF{Expl0it3rs_d1g1t4l_f00tpr1nt
Part 2: _1s_n3v3r_s4f3_
Part 3: bUt_g00d}
```

```text
UNI6CTF{Expl0it3rs_d1g1t4l_f00tpr1nt_1s_n3v3r_s4f3_bUt_g00d}
```

---

## 🚫 Decoys & Rabbit Holes

During enumeration, several decoy strings and dead ends were discovered:
- **LinkedIn "About" Section**: Contained Base64 string `dGhlX2F0dGFja19zdXJmYWNlfQ==` which decodes to `the_attack_surface}` (a decoy for another challenge).
- **Secondary Media**: Portfolio site, Medium, YouTube channel (`@Exploiter404`), and the Sh4d0w Br0k3rs team site source had no relevant flags.
- **Alias Confusion**: The handle `x.com/Exploiter404` belongs to an unrelated third party.

---

## 💡 Key Takeaways

- **Deep Profile Enumeration**: Check every profile section thoroughly (Experience, About, historical posts, recommendations), not just the banner/headline.
- **Pagination & Hidden Feeds**: Historical activity is often hidden behind dynamic pagination ("Load more").
- **Shortened Link Resolution**: Always expand and trace shortened redirect links (`lnkd.in`, `bit.ly`) in sandbox environments.
- **Correlation Tags**: Identifying the creator's naming signature (`"digital shadow"`) allowed verifying real flag components versus rabbit holes.


# Surani Jewellers & Sons

Cinematic luxury jewellery website — Wholesale & Retail, real gold, platinum & certified diamonds only.

## Live Demo (after GitHub Pages setup)
`https://YOUR-USERNAME.github.io/surani-jewellers/`

## How to Host on GitHub Pages (Free)

### 1. Create a new GitHub repository
1. Go to [https://github.com/new](https://github.com/new)
2. Repository name: `surani-jewellers` (or any name)
3. Make it **Public**
4. Do **not** add README / .gitignore / license (we already have files)
5. Click **Create repository**

### 2. Upload the files
**Option A – Drag & Drop (easiest)**
1. On the new repo page, click **uploading an existing file**
2. Drag **all files and folders** inside this `surani-jewellers` folder (index.html, css/, js/, pages/, README.md)
3. Commit the changes

**Option B – Git command line**
```bash
git init
git add .
git commit -m "Surani Jewellers cinematic website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/surani-jewellers.git
git push -u origin main
```

### 3. Enable GitHub Pages
1. Go to the repository → **Settings** → **Pages** (left sidebar)
2. Under **Source**, select **Deploy from a branch**
3. Branch: `main` → folder: `/ (root)`
4. Click **Save**
5. Wait 1–2 minutes
6. Your site will be live at:  
   `https://YOUR-USERNAME.github.io/surani-jewellers/`

### 4. Custom domain (optional)
In the same Pages settings you can add your own domain (e.g. suranijewellers.com) and point the DNS to GitHub.

## Project Structure
```
surani-jewellers/
├── index.html          ← Main cinematic landing page
├── css/style.css       ← All styles + glassmorphism + animations
├── js/main.js          ← Cart, tilt effects, scroll animations
├── pages/
│   ├── about.html
│   ├── contact.html
│   ├── buy-guide.html
│   ├── help.html
│   ├── invest.html
│   ├── terms.html
│   └── privacy.html
└── README.md
```

## Features
- Cinematic kinetic landing with scroll animations
- Glassmorphic category & product cards
- 3D tilt + hover effects
- Separate Wholesale & Retail sections
- Loose diamonds + scientific 5-type classification
- Diamond Buy Guide
- Working cart (localStorage)
- Fully responsive
- Real jewellery only (no imitation)

## Replace Placeholder Images
All product images currently use Unsplash URLs. Replace them with your real product photos later by editing the `src` attributes in `index.html`.

---
© 2026 Surani Jewellers & Sons

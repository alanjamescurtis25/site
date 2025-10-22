# Alan Curtis - Personal Website

A dead-simple personal website. Pure HTML + CSS. No build tools, no npm, no complexity.

## ✨ What You Have

- **5 Pages**: Home, Bio, Writing, Questions, Investments
- **Dark Theme**: Sidey-inspired clean design
- **Sidebar Navigation**: Fixed left sidebar with numbered nav
- **Pure HTML**: No frameworks, no build step
- **Edit in GitHub**: Just edit HTML files directly
- **Deploy to Netlify**: Automatic deploys

## 🚀 Deploy to Netlify (3 Steps)

### Step 1: Push to GitHub
1. Create new repo at https://github.com/new
2. Name it: `my-personal-site`
3. Make it **Public**
4. Don't check any boxes
5. Click "Create repository"
6. Click "uploading an existing file"
7. Drag ALL files from this folder
8. Click "Commit changes"

### Step 2: Deploy on Netlify
1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Click "Deploy with GitHub"
4. Select your `my-personal-site` repository
5. **Build settings**: Leave empty (no build needed!)
6. Click "Deploy site"
7. Wait 2 minutes - Done!

### Step 3: Get Your URL
- Your site is live at: `random-name-12345.netlify.app`
- Click on it to see your site!

## ✏️ How to Edit Content

**To update any page:**
1. Go to your GitHub repo
2. Click on the file (e.g., `bio.html`)
3. Click the **pencil icon** (Edit)
4. Make your changes
5. Scroll down, click "Commit changes"
6. Wait 1 minute - Netlify auto-deploys!

**Main files to edit:**
- `index.html` - Home page
- `bio.html` - Your bio/timeline
- `writing.html` - List of writing (add/remove items)
- `questions.html` - Your question banks
- `investments.html` - Your investments lists

## 🎨 Customize

**Change colors:**
Edit `css/style.css`:
- Background: `#0a0a0a` (almost black)
- Text: `#e0e0e0` (light gray)
- Borders: `#222` (dark gray)

**Change your info:**
Edit any `.html` file:
- Your name: `<h1>Alan James Curtis</h1>`
- Social links: In the `<div class="social-links">` section
- Email: `mailto:your@email.com`

**Add a new writing post:**
1. Go to GitHub
2. Click "Add file" → "Create new file"
3. Name it: `writing/my-new-post.html`
4. Copy the structure from another writing page
5. Update the title and content
6. Commit!

## 📁 File Structure

```
.
├── index.html          # Home page
├── bio.html            # Bio/timeline
├── writing.html        # Writing index
├── questions.html      # Questions page
├── investments.html    # Investments page
├── css/
│   └── style.css       # All styles
└── README.md           # This file
```

## 💡 Tips

**Update social links:**
In every HTML file, find this section and update:
```html
<div class="social-links">
    <a href="https://twitter.com/yourusername">𝕏</a>
    <a href="https://linkedin.com/in/yourusername">in</a>
    <a href="mailto:your@email.com">✉</a>
</div>
```

**Add more pages:**
1. Copy any existing `.html` file
2. Rename it
3. Update the content
4. Add a link to it in the navigation of all pages

## 🔄 Daily Updates

Since you update daily, here's the fastest workflow:

1. Go to github.com/your-username/my-personal-site
2. Click the file you want to edit
3. Click pencil icon
4. Make changes
5. Click "Commit" at bottom
6. Done! (Auto-deploys in ~1 min)

## 🎯 What's Next?

1. **Deploy it** (follow steps above)
2. **Update your info** (social links, email)
3. **Edit content** (bio, add writing)
4. **Share it** with the world!

---

**Questions?** It's just HTML. Edit anything. You can't break it.

**Need help?** Just ask - but honestly, it's so simple you probably won't need to!

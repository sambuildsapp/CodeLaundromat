# CodeLaundromat

**The AI-to-Production Bridge**  
Turn your AI-generated prototype into production-ready software with expert human oversight. The CodeLaundromat cleans up the slop.

Website: [https://codelaundromat.com/](https://codelaundromat.com/)

---

## Technical Stack
- **Frontend:** Vanilla HTML, CSS (`input.css`)
- **Styling:** Tailwind CSS v3.4 
- **Icons/Images:** Inline SVGs, optimized `.webp` assets
- **Security:** Cloudflare Turnstile integration

---

## Local Development Setup

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v20+ recommended). The project uses `.nvmrc` to lock the node version. If you use `nvm`, simply run:
```bash
nvm use
```

### 2. Install Dependencies
Install the required packages for the Tailwind build process and local server:
```bash
npm install
```

### 3. Running Locally
To compile the Tailwind utility classes from your HTML into the `output.css` file and serve the site locally, you can use the built-in Tailwind CLI (`npx tailwindcss`) or the scripts in `package.json`:

**Compile CSS continuously (Development):**
```bash
npx tailwindcss -i ./input.css -o ./output.css --watch
```

**Run local server:**
```bash
npm start
```
*(This uses the `serve` dependency to host the static files on `localhost:3000`)*

### 4. Build for Production
To minify the CSS output before deploying:
```bash
npm run build
```

---

## Deployment
This project is configured for deployment on **Vercel**. 
The `vercel.json` file in the root directory manages routing, including automatic redirection for 404 errors to the custom `404.html` page.

When pushing to the main branch, Vercel will automatically trigger the build pipeline using the commands specified above.

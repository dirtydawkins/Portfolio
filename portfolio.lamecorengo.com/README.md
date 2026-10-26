# Lameck Orengo — Portfolio

Responsive, single-page portfolio for **portfolio.lamecorengo.com**. The site uses semantic HTML, CSS, and vanilla JavaScript. It has no framework or third-party runtime dependencies.

## Run locally

Requirements: Node.js 18 or newer and npm.

1. Open a terminal in this project folder.
2. Run `npm run dev`.
3. Visit [http://localhost:4173](http://localhost:4173).

The local server uses Node's built-in modules. No `npm install` step is required. To use another port, set the `PORT` environment variable before starting the server.

## Deploy to Vercel

This is a static HTML/CSS/JavaScript site, so Vercel can serve the project root without a build step.

### Vercel dashboard

1. Import the project repository into Vercel, or run the CLI commands below from this folder.
2. Set the project root directory to this folder.
3. The included `vercel.json` selects the **Other** preset, skips installation and building, and serves this folder as the output directory. Confirm those settings in Vercel, then deploy.

### Vercel CLI

From the project folder, run `npx vercel` for a preview deployment. Run `npx vercel --prod` when you are ready to publish to production. The CLI will prompt you to connect or create a Vercel project.

To use **portfolio.lamecorengo.com**, add it in the Vercel project's **Settings → Domains**, then apply the DNS records Vercel provides at your domain registrar.

## Project contents

```text
index.html                 Page markup, theme bootstrap, inline SVG artwork
styles.css                 Layout, responsive styles, themes, and animations
script.js                  Theme control, navigation, motion, and interactions
server.mjs                 Dependency-free local development server
package.json               npm scripts and project metadata
vercel.json                Static root deployment settings for Vercel
.gitignore                 Local dependencies and deployment metadata exclusions
assets/
  lameck-orengo.jpeg       Supplied portrait used in the hero and profile
  Lameck-Orengo-CV.pdf     Downloadable copy of the supplied CV
  fonts/
    dm-mono-latin-400.woff2
    dm-mono-latin-500.woff2
    manrope-latin-variable.woff2
    OFL-DM-Mono.txt
    OFL-Manrope.txt
```

Manrope and DM Mono are bundled locally as WOFF2 fonts, so the intended typography does not depend on a Google Fonts network request. Their SIL Open Font License files are included beside the fonts. The site also includes the original portrait, dark and light themes, the saved theme preference, the sapphire interaction details, responsive layouts, and a missing-image fallback.

The three work pieces describe academic work at Jomo Kenyatta University of Agriculture and Technology (2019–2022); they are not presented as client projects or paid work.

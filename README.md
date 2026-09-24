# Membership Presale — local Lincoln Center demo

An editable recreation of the public [Choose-What-You-Pay page](https://www.lincolncenter.org/series/lincoln-center-presents/v/choose-what-you-pay), captured September 24, 2026. It is a local starting point for membership presale design, not a live ticketing service.

## Run

`npm run dev`, then open http://127.0.0.1:4173. No package installation is needed. `npm run check` checks JavaScript syntax. Refresh the browser after edits.

## Edit

- `public/index.html`: the complete page, including the membership introduction, two sale groups, eight event cards (four per release group), and footer.
- `public/demo.css`: focused overrides over LC's original presentation styles.
- `public/demo.js`: local menus, ticketing accordion support, and preview-only email dialog.
- `public/assets/`: cached original images, styles, and fonts.
- `data/event-inventory.json`: captured event inventory.
- `data/asset-manifest.json`: public source URLs and asset cache provenance.

The baseline preserves current public copy and dates; these are a snapshot, not live availability. Main content, images, and fonts are local. Event, membership, and other destination links open the original sites in another tab. Sign-in, checkout, email subscriptions, analytics, third-party widgets, and the accessibility overlay are not implemented. The ticketing FAQ uses native accessible disclosure behavior. The first row now simulates an active member presale for signed-out visitors. Its four cards have a Member presale label and a full-width Access member presale button, opening an accessible dialog that retains the selected event. The introductory callout and dialog link to LC’s existing membership and login pages. No extra Learn more action is added to presale cards. The active presale state is a design scenario, not a claim about live availability.

`scripts/create-baseline.py` and `scripts/cache-assets.py` document the initial extraction and require BeautifulSoup plus the source capture at `/tmp/lc-reference.html`. They are one-time provenance utilities, not the editing workflow. Do not rerun them over design changes. Some unused font/image declarations in LC's original CSS could not be cached; the fonts and images used on this page were checked in the browser.

## Hosting

Import `mynycincolor/member-presale` into Vercel. The checked-in `vercel.json` selects the Other framework preset, checks JavaScript, and publishes `public/`. No environment variables or running Node server are required for hosting. The original Choose-What-You-Pay path is mapped to the demo as well as the root URL. Additional pages can be added under `public/` in the same project.

Original Lincoln Center content and assets are retained solely for this requested prototype.

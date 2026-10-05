# Membership Presale demo

An editable Lincoln Center design prototype with two pages and signed-out, signed-in but not eligible, and unlocked presentation states. Content and dates are a captured design scenario, not live availability.

## Run and check

Run `npm run dev` and open http://127.0.0.1:4173/demos.html. No package installation is required. `npm run check` checks JavaScript syntax.

## Pages and states

- `/demos.html`: two demo cards with separate links to each state.
- `/`: Choose-What-You-Pay listing. Locked visitors see the winter presale message, Log In button, and membership text link. Unlocked visitors see the member thank-you message and Select a show anchor to the presale cards. Cards use Learn More in both states. No promo-code option appears here.
- `/heidi-latsky-dance.html`: show demo. Locked visitors see the member login module and a promo-code link below it. Unlocked visitors see a thank-you module with Book Tickets, selectable performance dates, and no promo-code link.

Append `?access=ineligible` to preview a signed-in visitor without eligible membership, with Join Now and no membership text link. Join Now is an inactive placeholder. The show-page promo link remains available. Local Heidi links preserve this state.

Append `?access=unlocked` to preview unlocked access. The review navigation also switches between states. Local Heidi links preserve unlocked access.

Log In switches the current page to its unlocked presentation without authenticating an account. Membership, promo-code and booking controls remain inactive placeholders. The Select a show anchor and Learn More navigation remain functional. Other event links open original LC pages. The former Lincoln Center Presents series demo has been removed.

## Editing

`public/index.html` and `public/heidi-latsky-dance.html` contain the pages. `public/access.js` renders the unlocked presentation. `public/demo.css` contains focused overrides over cached LC styles. `public/demo.js` and `public/show.js` provide local menus, disclosures, calendar and share controls. `public/assets/` contains cached source assets.

Production implementation should tie the modules and evergreen membership copy to presale availability: hide evergreen membership copy while the presale module is active, then restore it afterwards. On show pages, remove the module and promo link after presale and restore ordinary booking. This prototype demonstrates active presale only; it does not implement a CMS or time-based visibility rules.

## Hosting

The connected GitHub repository is `mynycincolor/member-presale`. Vercel publishes `public/` using `vercel.json`; no environment variables are required. The shareable menu is https://member-presale.vercel.app/demos.html.

The original source-path aliases are retained for the CWYP and Heidi pages. Embedded external media and original-site links may require network access. Authentication, payment, ticket reservations, analytics, third-party supporter widgets, and email subscriptions are not connected.

The scripts under `scripts/` record initial extraction and asset provenance. Do not rerun them over design edits. Original Lincoln Center content and assets are retained solely for this requested prototype.

# Panini Card Activator

A local mobile-friendly web app that reads a 12-character Adrenalyn XL card code with the camera and submits it to Panini's activation form.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. Camera access works on `localhost`. On another phone or computer, use HTTPS because browsers block camera access on ordinary HTTP network addresses.

For reliable OCR, move close enough that only the printed 12-character code fills the yellow guide. The scanner first segments the three four-character groups and reads the card's 5x7 dot-matrix glyphs directly at several brightness thresholds. It also runs Tesseract as a fallback, offers alternative readings when the font is ambiguous, and shows an enlarged local capture so every character can be verified before activation.

For a production build:

```bash
npm run build
npm start
```

Then open `http://localhost:3001`.

The default token is hard-coded in the client app. After the first edit or activation, the browser remembers the token in local storage.

## GitHub Pages

The Pages build supports camera scanning over HTTPS. Because GitHub Pages cannot run a backend and Panini protects activation with a session-bound CSRF token, its button opens Panini with the token and card code prefilled. Tap Activate once on Panini to submit. The local/server build performs the complete activation inside this app.

To update the published site, run `npm run build:pages`, commit `docs/`, and push `main`.

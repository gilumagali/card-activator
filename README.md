# Panini Card Activator

A local mobile-friendly web app that reads a 12-character Adrenalyn XL card code with the camera and submits it to Panini's activation form.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. Camera access works on `localhost`. On another phone or computer, use HTTPS because browsers block camera access on ordinary HTTP network addresses.

For reliable OCR, move close enough that only the printed 12-character code fills the yellow guide. The scanner runs several local OCR passes and offers alternative readings when the dotted font is ambiguous. It also shows an enlarged local capture so the code can still be verified and entered when the font is too distorted for automatic OCR.

For a production build:

```bash
npm run build
npm start
```

Then open `http://localhost:3001`.

The default token is hard-coded in the client app. After the first edit or activation, the browser remembers the token in local storage.

## GitHub Pages

The Pages build supports camera scanning over HTTPS. Because GitHub Pages cannot run a backend and Panini blocks cross-origin access, its Activate button copies the card code and opens Panini for the final paste and submission. The local/server build performs the complete activation inside this app.

To update the published site, run `npm run build:pages`, commit `docs/`, and push `main`.

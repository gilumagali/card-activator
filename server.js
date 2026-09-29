import express from 'express';
import * as cheerio from 'cheerio';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const port = Number(process.env.PORT || 3001);
const paniniBaseUrl = 'https://panadfl.paniniadrenalyn.com';
const activationPageUrl = `${paniniBaseUrl}/code/new`;
const activationUrl = `${paniniBaseUrl}/code/redeem`;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.disable('x-powered-by');
app.use(express.json({ limit: '10kb' }));

function validateActivationInput(token, code) {
  const cleanToken = String(token || '').trim().toUpperCase();
  const cleanCode = String(code || '').replace(/[^a-z0-9]/gi, '').toUpperCase();

  if (!/^[A-Z0-9]{6}$/.test(cleanToken)) {
    throw new Error('The Adrenalyn XL token must contain 6 letters or numbers.');
  }

  if (!/^[A-Z0-9]{12}$/.test(cleanCode)) {
    throw new Error('The card code must contain 12 letters or numbers.');
  }

  return { token: cleanToken, code: cleanCode };
}

function updateCookieJar(cookieJar, response) {
  const cookies = response.headers.getSetCookie?.() || [];

  for (const cookie of cookies) {
    const [pair] = cookie.split(';');
    const separator = pair.indexOf('=');
    if (separator > 0) {
      cookieJar.set(pair.slice(0, separator), pair.slice(separator + 1));
    }
  }
}

function cookieHeader(cookieJar) {
  return [...cookieJar.entries()].map(([name, value]) => `${name}=${value}`).join('; ');
}

async function paniniFetch(url, options, cookieJar) {
  const headers = new Headers(options?.headers);
  const cookies = cookieHeader(cookieJar);
  if (cookies) headers.set('cookie', cookies);

  const response = await fetch(url, {
    ...options,
    headers,
    redirect: 'manual',
    signal: AbortSignal.timeout(15000),
  });
  updateCookieJar(cookieJar, response);
  return response;
}

function pageMessage(html) {
  const $ = cheerio.load(html);
  const selectors = [
    '.alert',
    '.flash',
    '.notice',
    '.error',
    '.redeemCode__message',
    '.neoResp__errors',
    'main',
  ];

  for (const selector of selectors) {
    const text = $(selector).first().text().replace(/\s+/g, ' ').trim();
    if (text) return text;
  }

  return $('body').text().replace(/\s+/g, ' ').trim();
}

async function activateCard(token, code) {
  const cookieJar = new Map();
  const formResponse = await paniniFetch(activationPageUrl, {}, cookieJar);
  if (!formResponse.ok) {
    throw new Error(`Panini returned HTTP ${formResponse.status} while loading the form.`);
  }

  const formHtml = await formResponse.text();
  const $ = cheerio.load(formHtml);
  const authenticityToken = $('input[name="authenticity_token"]').attr('value');
  if (!authenticityToken) {
    throw new Error('The Panini activation form did not include a security token.');
  }

  const body = new URLSearchParams({
    authenticity_token: authenticityToken,
    adrenalyn_token: token,
    code,
    button: '',
  });

  let response = await paniniFetch(
    activationUrl,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        origin: paniniBaseUrl,
        referer: activationPageUrl,
      },
      body,
    },
    cookieJar,
  );

  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get('location');
    if (!location) throw new Error('Panini redirected without a destination.');
    response = await paniniFetch(new URL(location, paniniBaseUrl), {}, cookieJar);
  }

  const html = await response.text();
  const message = pageMessage(html);
  const failed = response.status >= 400 || /\b(error|invalid|incorrect|already used|not valid)\b/i.test(message);

  return {
    ok: !failed,
    message: message || (failed ? 'Panini could not activate this card.' : 'Card activated.'),
  };
}

app.get('/api/health', (_request, response) => {
  response.json({ ok: true });
});

app.post('/api/activate', async (request, response) => {
  try {
    const input = validateActivationInput(request.body?.token, request.body?.code);
    const result = await activateCard(input.token, input.code);
    response.status(result.ok ? 200 : 422).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Activation failed.';
    const isValidationError = /must contain/.test(message);
    response.status(isValidationError ? 400 : 502).json({ ok: false, message });
  }
});

app.use(express.static(path.join(__dirname, 'dist')));
app.use((_request, response) => {
  response.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Card activator running at http://localhost:${port}`);
  });
}

export { activateCard, pageMessage, validateActivationInput };

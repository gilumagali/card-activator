import { createWorker, PSM } from 'tesseract.js';
import {
  expandDottedFontAlternatives,
  formatCode,
  normalizeCode,
  rankCardCodeReadings,
} from './code-utils.js';
import './style.css';

const camera = document.querySelector('#camera');
const canvas = document.querySelector('#capture');
const startCameraButton = document.querySelector('#start-camera');
const scanButton = document.querySelector('#scan-code');
const form = document.querySelector('#activation-form');
const tokenInput = document.querySelector('#token');
const codeInput = document.querySelector('#card-code');
const activateButton = document.querySelector('#activate');
const status = document.querySelector('#status');
const progress = document.querySelector('#ocr-progress');
const progressBar = document.querySelector('#ocr-progress-bar');
const scanPreview = document.querySelector('#scan-preview');
const scanPreviewCanvas = document.querySelector('#scan-preview-canvas');
const scanOptions = document.querySelector('#scan-options');
const pagesNote = document.querySelector('#pages-note');
const staticOnly = import.meta.env.VITE_STATIC_ONLY === 'true';
const defaultToken = import.meta.env.VITE_ADRENALYN_TOKEN || 'WYJ715';

let stream;
let worker;

const savedToken = localStorage.getItem('adrenalyn-token');
tokenInput.value = savedToken || defaultToken;
if (staticOnly) {
  pagesNote.hidden = false;
  activateButton.textContent = 'Copy code & open Panini';
}

function setStatus(message, type = '') {
  status.textContent = message;
  status.className = `status ${type}`.trim();
}

function setProgress(value) {
  progress.hidden = false;
  progressBar.style.width = `${Math.round(value * 100)}%`;
}

async function getWorker() {
  if (!worker) {
    worker = await createWorker('eng', 1, {
      logger: ({ status: workerStatus, progress: value }) => {
        if (workerStatus === 'recognizing text') setProgress(value);
      },
    });
    await worker.setParameters({
      tessedit_pageseg_mode: PSM.SINGLE_LINE,
      tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-',
      preserve_interword_spaces: '1',
      user_defined_dpi: '300',
    });
  }
  return worker;
}

async function startCamera() {
  try {
    stream?.getTracks().forEach((track) => track.stop());
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 3840 },
        height: { ideal: 2160 },
      },
      audio: false,
    });
    camera.srcObject = stream;
    await camera.play();
    scanButton.disabled = false;
    startCameraButton.textContent = 'Restart camera';
    setStatus('Camera ready. Hold the code inside the frame.');
  } catch (error) {
    setStatus(`Camera unavailable: ${error.message}`, 'error');
  }
}

function guideSourceRect() {
  const sourceWidth = camera.videoWidth;
  const sourceHeight = camera.videoHeight;
  const frameWidth = camera.clientWidth;
  const frameHeight = camera.clientHeight;
  const coverScale = Math.max(frameWidth / sourceWidth, frameHeight / sourceHeight);
  const visibleWidth = frameWidth / coverScale;
  const visibleHeight = frameHeight / coverScale;
  const visibleX = (sourceWidth - visibleWidth) / 2;
  const visibleY = (sourceHeight - visibleHeight) / 2;

  return {
    x: visibleX + visibleWidth * 0.04,
    y: visibleY + visibleHeight * 0.34,
    width: visibleWidth * 0.92,
    height: visibleHeight * 0.34,
  };
}

function captureCodeArea() {
  const guide = guideSourceRect();
  const targetWidth = Math.min(2600, Math.max(1600, Math.round(guide.width * 2.5)));
  const targetHeight = Math.round(targetWidth * (guide.height / guide.width));

  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.filter = 'none';
  context.drawImage(
    camera,
    guide.x,
    guide.y,
    guide.width,
    guide.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );
  return canvas;
}

function cropLikelyCodeBand(source) {
  const bestY = Math.round(source.height * 0.42);
  const bandHeight = source.height - bestY;

  const band = document.createElement('canvas');
  band.width = source.width;
  band.height = bandHeight;
  band.getContext('2d').drawImage(
    source,
    0,
    bestY,
    source.width,
    bandHeight,
    0,
    0,
    band.width,
    band.height,
  );
  return band;
}

function createOcrVariant(source, { contrast = 2, blur = 0, threshold = null } = {}) {
  const variant = document.createElement('canvas');
  variant.width = source.width;
  variant.height = source.height;
  const context = variant.getContext('2d', { willReadFrequently: true });
  context.filter = `grayscale(1) contrast(${contrast})${blur ? ` blur(${blur}px)` : ''}`;
  context.drawImage(source, 0, 0);

  if (threshold !== null) {
    const image = context.getImageData(0, 0, variant.width, variant.height);
    for (let index = 0; index < image.data.length; index += 4) {
      const value = image.data[index] < threshold ? 0 : 255;
      image.data[index] = value;
      image.data[index + 1] = value;
      image.data[index + 2] = value;
    }
    context.putImageData(image, 0, 0);
  }

  return variant;
}

function renderScanPreview(source) {
  scanPreviewCanvas.width = source.width;
  scanPreviewCanvas.height = source.height;
  scanPreviewCanvas.getContext('2d').drawImage(source, 0, 0);
  scanPreview.hidden = false;
}

function renderScanOptions(ranked) {
  scanOptions.replaceChildren();
  scanOptions.hidden = ranked.length < 2;
  if (ranked.length < 2) return;

  const label = document.createElement('p');
  label.textContent = 'Possible reads — compare them with the card:';
  scanOptions.append(label);

  for (const candidate of ranked.slice(0, 8)) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = formatCode(candidate.code);
    button.addEventListener('click', () => {
      codeInput.value = formatCode(candidate.code);
      setStatus('Alternative selected. Check every character before activating.', 'success');
    });
    scanOptions.append(button);
  }
}

async function scanCode() {
  scanButton.disabled = true;
  scanOptions.hidden = true;
  scanPreview.hidden = true;
  setStatus('Reading the card code...');
  setProgress(0);

  try {
    const ocr = await getWorker();
    const readings = [];
    const codeBand = cropLikelyCodeBand(captureCodeArea());
    renderScanPreview(codeBand);
    const captures = [
      createOcrVariant(codeBand, { contrast: 2.4 }),
      createOcrVariant(codeBand, { contrast: 2.6, blur: 0.6, threshold: 190 }),
      createOcrVariant(codeBand, { contrast: 2.2, blur: 0.8, threshold: 210 }),
      createOcrVariant(codeBand, { contrast: 3, threshold: 225 }),
    ];

    for (let index = 0; index < captures.length; index += 1) {
      const result = await ocr.recognize(captures[index]);
      readings.push({
        text: result.data.text,
        confidence: result.data.confidence,
      });
      setProgress((index + 1) / captures.length);
    }
    const ranked = rankCardCodeReadings(readings);
    if (!ranked.length) {
      setStatus(
        'Automatic OCR could not confirm all 12 characters. Read the enlarged capture and type the code below.',
        'warning',
      );
      codeInput.focus();
      return;
    }

    const knownCodes = new Set(ranked.map(({ code }) => code));
    const dottedFontAlternatives = ranked
      .slice(0, 2)
      .flatMap(({ code }) => expandDottedFontAlternatives(code))
      .filter((code) => {
        if (knownCodes.has(code)) return false;
        knownCodes.add(code);
        return true;
      })
      .map((code) => ({ code }));
    const options = [...ranked, ...dottedFontAlternatives];

    codeInput.value = formatCode(ranked[0].code);
    renderScanOptions(options);
    setStatus(
      options.length > 1
        ? 'Several possible reads were found. Compare the choices with the card before activating.'
        : 'Code found. Check every character, then press Activate card.',
      options.length > 1 ? 'warning' : 'success',
    );
    codeInput.focus();
  } catch (error) {
    setStatus(error.message, 'error');
  } finally {
    progress.hidden = true;
    scanButton.disabled = false;
  }
}

codeInput.addEventListener('input', () => {
  codeInput.value = formatCode(codeInput.value);
  scanOptions.hidden = true;
});

tokenInput.addEventListener('input', () => {
  tokenInput.value = tokenInput.value.replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 6);
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const token = tokenInput.value.trim().toUpperCase();
  const code = normalizeCode(codeInput.value);

  if (token.length !== 6 || code.length !== 12) {
    setStatus('Enter a 6-character token and a 12-character card code.', 'error');
    return;
  }

  localStorage.setItem('adrenalyn-token', token);

  if (staticOnly) {
    try {
      await navigator.clipboard.writeText(code);
      setStatus('Card code copied. Paste it into the Panini page.', 'success');
    } catch {
      setStatus(`Copy this code on Panini: ${formatCode(code)}`, 'success');
    }
    window.open('https://panadfl.paniniadrenalyn.com/code/new', '_blank', 'noopener,noreferrer');
    return;
  }

  activateButton.disabled = true;
  setStatus('Activating card...');

  try {
    const response = await fetch('/api/activate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token, code }),
    });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.message || 'Activation failed.');

    setStatus(result.message, 'success');
    codeInput.value = '';
  } catch (error) {
    setStatus(error.message, 'error');
  } finally {
    activateButton.disabled = false;
  }
});

startCameraButton.addEventListener('click', startCamera);
scanButton.addEventListener('click', scanCode);
window.addEventListener('pagehide', () => {
  stream?.getTracks().forEach((track) => track.stop());
  worker?.terminate();
});

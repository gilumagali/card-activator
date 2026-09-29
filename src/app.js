import { createWorker } from 'tesseract.js';
import { extractCardCode, formatCode, normalizeCode } from './code-utils.js';
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
const pagesNote = document.querySelector('#pages-note');
const staticOnly = import.meta.env.VITE_STATIC_ONLY === 'true';

let stream;
let worker;

const savedToken = localStorage.getItem('adrenalyn-token');
tokenInput.value = savedToken || import.meta.env.VITE_ADRENALYN_TOKEN || '';
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
      tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      preserve_interword_spaces: '1',
    });
  }
  return worker;
}

async function startCamera() {
  try {
    stream?.getTracks().forEach((track) => track.stop());
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 } },
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

function captureCodeArea() {
  const sourceWidth = camera.videoWidth;
  const sourceHeight = camera.videoHeight;
  const cropWidth = Math.round(sourceWidth * 0.92);
  const cropHeight = Math.round(sourceHeight * 0.34);
  const sourceX = Math.round((sourceWidth - cropWidth) / 2);
  const sourceY = Math.round((sourceHeight - cropHeight) / 2);
  const scale = 2;

  canvas.width = cropWidth * scale;
  canvas.height = cropHeight * scale;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.filter = 'grayscale(1) contrast(1.9)';
  context.drawImage(
    camera,
    sourceX,
    sourceY,
    cropWidth,
    cropHeight,
    0,
    0,
    canvas.width,
    canvas.height,
  );
  return canvas;
}

async function scanCode() {
  scanButton.disabled = true;
  setStatus('Reading the card code...');
  setProgress(0);

  try {
    const ocr = await getWorker();
    const result = await ocr.recognize(captureCodeArea());
    const code = extractCardCode(result.data.text);
    if (!code) {
      throw new Error('No 12-character code found. Move closer, improve the lighting, and try again.');
    }
    codeInput.value = formatCode(code);
    setStatus('Code found. Check it, then press Activate card.', 'success');
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

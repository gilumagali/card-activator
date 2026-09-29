import test from 'node:test';
import assert from 'node:assert/strict';
import { extractCardCode, formatCode, normalizeCode } from '../src/code-utils.js';

test('normalizes and formats card codes', () => {
  assert.equal(normalizeCode('ab12-cd34 ef56'), 'AB12CD34EF56');
  assert.equal(formatCode('ab12cd34ef56'), 'AB12 CD34 EF56');
});

test('extracts grouped OCR card codes', () => {
  assert.equal(extractCardCode('Card code:\nAB12  CD34  EF56'), 'AB12CD34EF56');
  assert.equal(extractCardCode('AB12-CD34-EF56'), 'AB12CD34EF56');
});

test('rejects OCR text without a complete code', () => {
  assert.equal(extractCardCode('AB12 CD34'), '');
});

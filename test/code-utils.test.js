import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildCardCodeConsensus,
  countCharacterDifferences,
  extractCardCode,
  extractCardCodes,
  expandDottedFontAlternatives,
  formatCode,
  normalizeCode,
  rankCardCodeReadings,
  repairDottedFontConsensus,
} from '../src/code-utils.js';

test('normalizes and formats card codes', () => {
  assert.equal(normalizeCode('ab12-cd34 ef56'), 'AB12CD34EF56');
  assert.equal(formatCode('ab12cd34ef56'), 'AB12 CD34 EF56');
});

test('extracts grouped OCR card codes', () => {
  assert.equal(extractCardCode('Card code:\nAB12  CD34  EF56'), 'AB12CD34EF56');
  assert.equal(extractCardCode('AB12-CD34-EF56'), 'AB12CD34EF56');
});

test('extracts every complete card-code candidate', () => {
  assert.deepEqual(
    extractCardCodes('First AB12-CD34-EF56\nSecond: ZX98 YW76 VT54'),
    ['AB12CD34EF56', 'ZX98YW76VT54'],
  );
});

test('ranks repeated OCR readings ahead of one-off alternatives', () => {
  const ranked = rankCardCodeReadings([
    { text: 'AB12-CD34-EF56', confidence: 42 },
    { text: 'AB12 CD34 EF56', confidence: 18 },
    { text: 'AB1Z-CD34-EF56', confidence: 55 },
  ]);

  assert.equal(ranked[0].code, 'AB12CD34EF56');
  assert.equal(ranked[0].occurrences, 2);
  assert.equal(ranked[1].code, 'AB1ZCD34EF56');
});

test('suggests common dotted-font OCR alternatives', () => {
  const alternatives = expandDottedFontAlternatives('ABCDUZHL546R');

  assert.equal(alternatives[0], 'ABCDV2HL546R');
  assert.ok(alternatives.includes('ABCDV2HL546R'));
  assert.ok(alternatives.includes('ABCDU2HL546R'));
  assert.ok(alternatives.includes('ABCDVZHL546R'));
  assert.ok(!alternatives.includes('ABCDUZHL546R'));
});

test('combines and repairs repeated dotted-font OCR readings', () => {
  const consensus = buildCardCodeConsensus([
    'PUMMUZHL546R',
    'PUWMUZHL546R',
    'PUWWU2HL546R',
  ]);

  assert.equal(consensus, 'PUWMUZHL546R');
  assert.equal(repairDottedFontConsensus(consensus), 'PWWMV2HL546R');
  assert.equal(repairDottedFontConsensus('PUMMUZHLS4ER'), 'PWWMV2HL546R');
  assert.equal(countCharacterDifferences('PUMMUZHLS4ER', 'PWWMV2HL546R'), 6);
});

test('rejects OCR text without a complete code', () => {
  assert.equal(extractCardCode('AB12 CD34'), '');
});

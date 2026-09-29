export function normalizeCode(value) {
  return String(value || '').replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 12);
}

export function formatCode(value) {
  return normalizeCode(value).replace(/(.{4})(?=.)/g, '$1 ');
}

export function buildPaniniActivationUrl(token, code) {
  const url = new URL('https://panadfl.paniniadrenalyn.com/code/new');
  url.searchParams.set('adrenalyn_token', String(token || '').trim().toUpperCase());
  url.searchParams.set('code', normalizeCode(code));
  return url.toString();
}

export function extractCardCodes(text) {
  const uppercase = String(text || '').toUpperCase();
  const codes = new Set();

  for (const line of uppercase.split(/\r?\n/)) {
    const compact = line.replace(/[^A-Z0-9]/g, '');
    if (compact.length === 12) codes.add(compact);

    const groupedPattern = /(?:^|[^A-Z0-9])([A-Z0-9]{4})[\s:_-]+([A-Z0-9]{4})[\s:_-]+([A-Z0-9]{4})(?=$|[^A-Z0-9])/g;
    for (const grouped of line.matchAll(groupedPattern)) {
      codes.add(grouped.slice(1).join(''));
    }
  }

  return [...codes];
}

export function extractCardCode(text) {
  return extractCardCodes(text)[0] || '';
}

export function rankCardCodeReadings(readings) {
  const ranked = new Map();

  for (const reading of readings) {
    const confidence = Number(reading?.confidence) || 0;
    for (const code of extractCardCodes(reading?.text)) {
      const current = ranked.get(code) || { code, score: 0, occurrences: 0, bestConfidence: 0 };
      current.occurrences += 1;
      current.bestConfidence = Math.max(current.bestConfidence, confidence);
      current.score += 100 + confidence;
      ranked.set(code, current);
    }
  }

  return [...ranked.values()].sort((left, right) => (
    right.score - left.score
    || right.occurrences - left.occurrences
    || right.bestConfidence - left.bestConfidence
    || left.code.localeCompare(right.code)
  ));
}

export function buildCardCodeConsensus(codes) {
  const normalized = codes.map(normalizeCode).filter((code) => code.length === 12);
  if (!normalized.length) return '';

  return Array.from({ length: 12 }, (_, index) => {
    const counts = new Map();
    for (const code of normalized) {
      counts.set(code[index], (counts.get(code[index]) || 0) + 1);
    }
    return [...counts.entries()]
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))[0][0];
  }).join('');
}

export function repairDottedFontConsensus(value) {
  const code = normalizeCode(value);
  if (code.length !== 12) return '';

  const groups = [code.slice(0, 4), code.slice(4, 8), code.slice(8, 12)];
  groups[0] = groups[0].replace(/^(.?)U(?=[LMW])/, '$1W');
  if (/^.[W][ML][ML]$/.test(groups[0])) {
    groups[0] = `${groups[0].slice(0, 2)}W${groups[0][3] === 'L' ? 'M' : groups[0][3]}`;
  }
  groups[1] = groups[1].replace(/^UZ/, 'V2');
  groups[2] = groups[2]
    .replace(/^[SB]/, '5')
    .replace(/^(.{2})[EG]/, '$16');
  return groups.join('');
}

export function countCharacterDifferences(left, right) {
  const first = normalizeCode(left);
  const second = normalizeCode(right);
  if (first.length !== second.length) return Math.max(first.length, second.length);
  return [...first].reduce((count, character, index) => (
    count + (character === second[index] ? 0 : 1)
  ), 0);
}

const dottedFontConfusions = {
  U: ['V', 'W'],
  V: ['U'],
  Z: ['2'],
  2: ['Z'],
  S: ['5'],
  5: ['S'],
  G: ['6'],
  6: ['G'],
  O: ['0'],
  0: ['O'],
  I: ['1', 'M'],
  1: ['I'],
};

export function expandDottedFontAlternatives(value, maxChanges = 2) {
  const code = normalizeCode(value);
  if (code.length !== 12) return [];

  const priorityAlternatives = [];
  const seen = new Set([code]);

  for (let index = 0; index < code.length - 1; index += 1) {
    if (code.slice(index, index + 2) !== 'UZ') continue;
    const candidate = `${code.slice(0, index)}V2${code.slice(index + 2)}`;
    if (!seen.has(candidate)) {
      seen.add(candidate);
      priorityAlternatives.push(candidate);
    }
  }

  const alternatives = [];
  let frontier = [{ code, changes: 0 }];

  while (frontier.length && alternatives.length < 32) {
    const next = [];
    for (const item of frontier) {
      if (item.changes >= maxChanges) continue;

      for (let index = 0; index < item.code.length; index += 1) {
        for (const replacement of dottedFontConfusions[item.code[index]] || []) {
          const candidate = `${item.code.slice(0, index)}${replacement}${item.code.slice(index + 1)}`;
          if (seen.has(candidate)) continue;
          seen.add(candidate);
          alternatives.push(candidate);
          next.push({ code: candidate, changes: item.changes + 1 });
        }
      }
    }
    frontier = next;
  }

  return [...priorityAlternatives, ...alternatives];
}

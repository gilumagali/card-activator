const measuredGlyphTemplates = {
  P: [[0.65,0.77,0.65,0.54,0.1,0.65,0,0,0.03,0.55,0.65,0,0,0.02,0.68,0.61,0.69,0.65,0.55,0,0.63,0.01,0,0,0,0.64,0.04,0,0,0,0.65,0.11,0,0,0]],
  W: [
    [0.63,0.07,0,0,0.56,0.54,0.03,0,0.04,0.66,0.63,0.04,0,0.04,0.57,0.64,0.03,0,0.01,0.52,0.38,0.15,0,0.01,0.56,0.07,0.47,0.15,0.65,0.2,0,0,0.61,0.1,0],
    [0.48,0,0,0,0.44,0.45,0,0,0,0.44,0.48,0,0,0,0.46,0.45,0,0.45,0.02,0.39,0.48,0.27,0.2,0.44,0.48,0.48,0.39,0,0.23,0.61,0.48,0.02,0,0,0.46],
    [0.56,0.19,0,0,0.62,0.5,0.06,0,0,0.75,0.75,0.12,0,0,0.62,0.56,0.19,0,0,0.5,0.25,0.19,0,0,0.44,0.19,0.56,0.25,0.62,0.38,0,0,0.5,0.2,0],
  ],
  M: [[0.49,0,0,0,0.39,0.43,0,0,0,0.48,0.49,0,0,0,0.41,0.47,0,0.36,0.04,0.43,0.45,0.22,0.28,0.43,0.45,0.57,0.37,0,0.07,0.72,0.47,0.02,0,0,0.43]],
  V: [[0.55,0.13,0,0,0.54,0.52,0.05,0,0.05,0.59,0.64,0.04,0,0.07,0.55,0.57,0.06,0,0.02,0.61,0.42,0.12,0,0,0.49,0.09,0.59,0.15,0.56,0.37,0,0,0.46,0.19,0]],
  2: [[0.13,0.69,0.67,0.63,0.2,0.62,0,0,0.08,0.38,0,0,0,0.18,0.53,0,0.05,0.68,0.6,0,0.1,0.63,0,0,0,0.66,0,0,0,0,0.61,0.72,0.69,0.68,0.69]],
  H: [[0.53,0.08,0,0.02,0.63,0.56,0.01,0,0.06,0.57,0.61,0,0,0.04,0.47,0.64,0.65,0.59,0.54,0.53,0.56,0,0,0.1,0.5,0.53,0.04,0,0.09,0.57,0.49,0.14,0,0.05,0.53]],
  L: [[0.4,0.13,0,0,0,0.53,0.04,0,0,0,0.59,0.01,0,0,0,0.56,0.05,0,0,0,0.51,0.04,0,0,0,0.52,0.12,0,0,0,0.39,0.66,0.63,0.59,0.58]],
  5: [[0.53,0.71,0.62,0.58,0.45,0.64,0,0,0,0,0.64,0,0,0,0,0.54,0.67,0.67,0.56,0.04,0.08,0,0,0.06,0.5,0,0,0,0.03,0.62,0.45,0.78,0.73,0.6,0]],
  4: [[0,0,0,0.62,0,0,0.04,0.66,0.55,0,0.05,0.57,0.13,0.43,0,0.53,0.02,0.12,0.47,0.03,0.6,0.67,0.7,0.59,0.6,0,0,0.03,0.59,0,0,0,0,0.58,0.06]],
  6: [[0,0,0.63,0.69,0.61,0.02,0.56,0,0,0,0.57,0.03,0,0,0,0.66,0.65,0.66,0.61,0.01,0.64,0.03,0,0,0.65,0.4,0.03,0,0,0.55,0.2,0.6,0.69,0.61,0.09]],
  R: [[0.47,0.58,0.57,0.51,0,0.5,0,0.02,0.11,0.44,0.54,0.02,0,0.11,0.41,0.55,0.64,0.62,0.45,0.02,0.47,0.08,0.54,0,0,0.51,0.08,0,0.52,0.02,0.46,0.07,0,0,0.59]],
};

const glyphPatterns = {
  A: ['01110','10001','10001','11111','10001','10001','10001'],
  B: ['11110','10001','10001','11110','10001','10001','11110'],
  C: ['01111','10000','10000','10000','10000','10000','01111'],
  D: ['11110','10001','10001','10001','10001','10001','11110'],
  E: ['11111','10000','10000','11110','10000','10000','11111'],
  F: ['11111','10000','10000','11110','10000','10000','10000'],
  G: ['01111','10000','10000','10111','10001','10001','01111'],
  H: ['10001','10001','10001','11111','10001','10001','10001'],
  I: ['11111','00100','00100','00100','00100','00100','11111'],
  J: ['00111','00010','00010','00010','00010','10010','01100'],
  K: ['10001','10010','10100','11000','10100','10010','10001'],
  L: ['10000','10000','10000','10000','10000','10000','11111'],
  M: ['10001','11011','10101','10101','10001','10001','10001'],
  N: ['10001','11001','10101','10011','10001','10001','10001'],
  O: ['01110','10001','10001','10001','10001','10001','01110'],
  P: ['11110','10001','10001','11110','10000','10000','10000'],
  Q: ['01110','10001','10001','10001','10101','10010','01101'],
  R: ['11110','10001','10001','11110','10100','10010','10001'],
  S: ['01111','10000','10000','01110','00001','00001','11110'],
  T: ['11111','00100','00100','00100','00100','00100','00100'],
  U: ['10001','10001','10001','10001','10001','10001','01110'],
  V: ['10001','10001','10001','10001','10001','01010','00100'],
  W: ['10001','10001','10001','10101','10101','10101','01010'],
  X: ['10001','10001','01010','00100','01010','10001','10001'],
  Y: ['10001','10001','01010','00100','00100','00100','00100'],
  Z: ['11111','00001','00010','00100','01000','10000','11111'],
  0: ['01110','10001','10011','10101','11001','10001','01110'],
  1: ['00100','01100','00100','00100','00100','00100','01110'],
  2: ['01110','10001','00001','00010','00100','01000','11111'],
  3: ['11110','00001','00001','01110','00001','00001','11110'],
  4: ['00010','00110','01010','10010','11111','00010','00010'],
  5: ['11111','10000','10000','11110','00001','00001','11110'],
  6: ['01110','10000','10000','11110','10001','10001','01110'],
  7: ['11111','00001','00010','00100','01000','01000','01000'],
  8: ['01110','10001','10001','01110','10001','10001','01110'],
  9: ['01110','10001','10001','01111','00001','00001','01110'],
};

const glyphTemplates = Object.fromEntries(
  Object.entries(glyphPatterns).map(([character, rows]) => [
    character,
    [
      ...(measuredGlyphTemplates[character] || []),
      rows.join('').split('').map((value) => (value === '1' ? 0.55 : 0)),
    ],
  ]),
);

function darkPixel(data, width, x, y, threshold) {
  const index = (y * width + x) * 4;
  const luminance = (
    data[index] * 0.299
    + data[index + 1] * 0.587
    + data[index + 2] * 0.114
  );
  return luminance < threshold;
}

function activeColumnRuns(data, width, height, threshold, verticalRange = null) {
  const active = new Array(width).fill(false);
  const firstY = verticalRange?.top ?? 0;
  const lastY = verticalRange?.bottom ?? height - 1;
  const minimumDarkPixels = Math.max(2, Math.round((lastY - firstY + 1) * 0.02));

  for (let x = 0; x < width; x += 1) {
    let dark = 0;
    for (let y = firstY; y <= lastY; y += 1) {
      if (darkPixel(data, width, x, y, threshold)) dark += 1;
    }
    active[x] = dark >= minimumDarkPixels;
  }

  const runs = [];
  let start = -1;
  for (let x = 0; x <= width; x += 1) {
    if (x < width && active[x] && start === -1) start = x;
    if ((x === width || !active[x]) && start !== -1) {
      runs.push({ start, end: x - 1 });
      start = -1;
    }
  }

  const maximumInnerGap = Math.max(2, Math.round(width * 0.004));
  const merged = [];
  for (const run of runs) {
    const previous = merged.at(-1);
    if (previous && run.start - previous.end - 1 <= maximumInnerGap) {
      previous.end = run.end;
    } else {
      merged.push({ ...run });
    }
  }

  const minimumWidth = Math.max(3, Math.round(width * 0.008));
  return merged.filter(({ start: left, end: right }) => right - left + 1 >= minimumWidth);
}

function darkBounds(data, width, height, run, threshold, verticalRange = null) {
  const firstY = verticalRange?.top ?? 0;
  const lastY = verticalRange?.bottom ?? height - 1;
  let left = run.start;
  let right = run.end;
  let top = height;
  let bottom = -1;
  const columnCounts = [];
  for (let x = run.start; x <= run.end; x += 1) {
    let count = 0;
    for (let y = firstY; y <= lastY; y += 1) {
      if (darkPixel(data, width, x, y, threshold)) count += 1;
    }
    columnCounts.push(count);
  }
  const minimumColumnInk = Math.max(2, Math.round((lastY - firstY + 1) * 0.025));
  while (left <= right && columnCounts[left - run.start] < minimumColumnInk) left += 1;
  while (right >= left && columnCounts[right - run.start] < minimumColumnInk) right -= 1;

  for (let y = firstY; y <= lastY; y += 1) {
    for (let x = left; x <= right; x += 1) {
      if (!darkPixel(data, width, x, y, threshold)) continue;
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
    }
  }
  return bottom < top ? null : { start: left, end: right, top, bottom };
}

function glyphVector(data, width, height, run, threshold, verticalRange = null) {
  const bounds = darkBounds(data, width, height, run, threshold, verticalRange);
  if (!bounds) return null;

  const vector = [];
  const glyphWidth = bounds.end - bounds.start + 1;
  const glyphHeight = bounds.bottom - bounds.top + 1;
  for (let row = 0; row < 7; row += 1) {
    const y0 = Math.floor(bounds.top + glyphHeight * row / 7);
    const y1 = Math.max(y0 + 1, Math.floor(bounds.top + glyphHeight * (row + 1) / 7));
    for (let column = 0; column < 5; column += 1) {
      const x0 = Math.floor(bounds.start + glyphWidth * column / 5);
      const x1 = Math.max(x0 + 1, Math.floor(bounds.start + glyphWidth * (column + 1) / 5));
      let dark = 0;
      let total = 0;
      for (let y = y0; y < y1; y += 1) {
        for (let x = x0; x < x1; x += 1) {
          total += 1;
          if (darkPixel(data, width, x, y, threshold)) dark += 1;
        }
      }
      vector.push(total ? dark / total : 0);
    }
  }
  return vector;
}

function matchGlyph(vector) {
  const matches = [];
  for (const [character, templates] of Object.entries(glyphTemplates)) {
    let characterDistance = Infinity;
    for (const template of templates) {
      const distance = vector.reduce((sum, value, index) => {
        const difference = value - template[index];
        return sum + difference * difference;
      }, 0);
      characterDistance = Math.min(characterDistance, distance);
    }
    matches.push({ character, distance: characterDistance });
  }
  matches.sort((left, right) => left.distance - right.distance);
  return {
    ...matches[0],
    secondCharacter: matches[1].character,
    margin: matches[1].distance - matches[0].distance,
  };
}

function splitGroup(data, width, group, verticalRange, threshold) {
  const groupWidth = group.end - group.start + 1;
  const targetWidth = groupWidth / 4;
  const minimumCellWidth = Math.floor(targetWidth * 0.66);
  const maximumCellWidth = Math.ceil(targetWidth * 1.34);
  const cutCost = new Map();

  for (let x = group.start + 1; x <= group.end; x += 1) {
    let ink = 0;
    for (let offset = -1; offset <= 1; offset += 1) {
      const column = Math.max(group.start, Math.min(group.end, x + offset));
      for (let y = verticalRange.top; y <= verticalRange.bottom; y += 1) {
        if (darkPixel(data, width, column, y, threshold)) ink += 1;
      }
    }
    cutCost.set(x, ink / (verticalRange.bottom - verticalRange.top + 1));
  }

  let states = new Map([[group.start, { score: 0, cuts: [] }]]);
  for (let cellIndex = 0; cellIndex < 3; cellIndex += 1) {
    const nextStates = new Map();
    for (const [previousCut, state] of states) {
      const remainingCells = 3 - cellIndex;
      const earliestCut = previousCut + minimumCellWidth;
      const latestCut = Math.min(
        previousCut + maximumCellWidth,
        group.end - remainingCells * minimumCellWidth + 1,
      );
      for (let cut = earliestCut; cut <= latestCut; cut += 1) {
        const cellWidth = cut - previousCut;
        const widthPenalty = ((cellWidth - targetWidth) / targetWidth) ** 2 * 0.18;
        const score = state.score + cutCost.get(cut) + widthPenalty;
        const current = nextStates.get(cut);
        if (!current || score < current.score) {
          nextStates.set(cut, { score, cuts: [...state.cuts, cut] });
        }
      }
    }
    states = nextStates;
  }

  let best = null;
  for (const [lastCut, state] of states) {
    const finalWidth = group.end + 1 - lastCut;
    if (finalWidth < minimumCellWidth || finalWidth > maximumCellWidth) continue;
    const widthPenalty = ((finalWidth - targetWidth) / targetWidth) ** 2 * 0.18;
    const score = state.score + widthPenalty;
    if (!best || score < best.score) best = { score, cuts: state.cuts };
  }
  if (!best) return [];

  const boundaries = [group.start, ...best.cuts, group.end + 1];
  return Array.from({ length: 4 }, (_, index) => ({
    start: boundaries[index],
    end: boundaries[index + 1] - 1,
    verticalRange,
  }));
}

function locateGlyphCells(data, width, height, threshold) {
  const searchRange = {
    top: Math.round(height * 0.18),
    bottom: Math.round(height * 0.86),
  };
  const runs = activeColumnRuns(data, width, height, threshold, searchRange)
    .map((run) => ({
      ...run,
      bounds: darkBounds(data, width, height, run, threshold, searchRange),
    }))
    .filter(({ bounds }) => bounds);
  const hyphens = runs.filter(({ start, end, bounds }) => (
    start > width * 0.15
    && end < width * 0.85
    && end - start + 1 > width * 0.025
    && end - start + 1 < width * 0.08
    && bounds.bottom - bounds.top + 1 < height * 0.2
  ));
  if (hyphens.length !== 2) return [];

  const [firstHyphen, secondHyphen] = hyphens;
  const middleRuns = runs.filter(({ start, end }) => (
    start > firstHyphen.end && end < secondHyphen.start
  ));
  if (!middleRuns.length) return [];

  const middleStart = middleRuns[0].start;
  const middleEnd = middleRuns.at(-1).end;
  const groupWidth = middleEnd - middleStart + 1;
  const firstRuns = runs.filter(({ start, end }) => (
    end < firstHyphen.start && start >= firstHyphen.start - groupWidth * 1.3
  ));
  if (!firstRuns.length) return [];

  const firstStart = firstRuns[0].start;
  const firstEnd = firstRuns.at(-1).end;
  const thirdRuns = runs.filter(({ start }) => (
    start > secondHyphen.end && start < secondHyphen.end + groupWidth * 1.2
  ));
  if (!thirdRuns.length) return [];
  const thirdStart = thirdRuns[0].start;
  const thirdEnd = Math.min(width - 1, thirdStart + groupWidth - 1);

  const hyphenCenterY = Math.round((
    firstHyphen.bounds.top
    + firstHyphen.bounds.bottom
    + secondHyphen.bounds.top
    + secondHyphen.bounds.bottom
  ) / 4);
  const verticalRange = {
    top: Math.max(0, Math.round(hyphenCenterY - height * 0.34)),
    bottom: Math.min(height - 1, Math.round(hyphenCenterY + height * 0.34)),
  };

  return [
    { start: firstStart, end: firstEnd },
    { start: middleStart, end: middleEnd },
    { start: thirdStart, end: thirdEnd },
  ].flatMap((group) => splitGroup(data, width, group, verticalRange, threshold));
}

function recognizeAtThreshold(image, width, height, threshold) {
  const glyphCells = locateGlyphCells(image.data, width, height, threshold);
  const matches = glyphCells.map((cell) => {
    const vector = glyphVector(
      image.data,
      width,
      height,
      cell,
      threshold,
      cell.verticalRange,
    );
    return vector ? matchGlyph(vector) : null;
  });
  if (matches.length !== 12 || matches.some((match) => !match)) return '';
  if (matches.some(({ distance }) => distance > 1.35)) return '';
  if (matches.some(({ character, secondCharacter, margin }) => (
    margin < 0.04 && !'MW'.includes(character) && !'MW'.includes(secondCharacter)
  ))) return '';
  return {
    code: matches.map(({ character }) => character).join(''),
    score: matches.reduce((sum, { distance }) => sum + distance, 0) / matches.length,
  };
}

export function recognizeDotMatrixCode(canvas) {
  const context = canvas.getContext('2d', { willReadFrequently: true });
  const image = context.getImageData(0, 0, canvas.width, canvas.height);
  const candidates = [120, 140, 160, 180, 200]
    .map((threshold) => recognizeAtThreshold(image, canvas.width, canvas.height, threshold))
    .filter(Boolean);
  if (!candidates.length) return '';

  const ranked = new Map();
  for (const candidate of candidates) {
    const current = ranked.get(candidate.code) || {
      code: candidate.code,
      occurrences: 0,
      bestScore: Infinity,
    };
    current.occurrences += 1;
    current.bestScore = Math.min(current.bestScore, candidate.score);
    ranked.set(candidate.code, current);
  }

  return [...ranked.values()]
    .sort((left, right) => (
      right.occurrences - left.occurrences
      || left.bestScore - right.bestScore
    ))[0].code;
}

export function normalizeCode(value) {
  return String(value || '').replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 12);
}

export function formatCode(value) {
  return normalizeCode(value).replace(/(.{4})(?=.)/g, '$1 ');
}

export function extractCardCode(text) {
  const uppercase = String(text || '').toUpperCase();
  for (const line of uppercase.split(/\r?\n/)) {
    const compact = line.replace(/[^A-Z0-9]/g, '');
    if (compact.length === 12) return compact;

    const grouped = line.match(/(?:^|[^A-Z0-9])([A-Z0-9]{4})[\s:_-]+([A-Z0-9]{4})[\s:_-]+([A-Z0-9]{4})(?:$|[^A-Z0-9])/);
    if (grouped) return grouped.slice(1).join('');
  }

  return '';
}

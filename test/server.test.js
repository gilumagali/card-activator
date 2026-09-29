import test from 'node:test';
import assert from 'node:assert/strict';

process.env.NODE_ENV = 'test';
const { pageMessage, validateActivationInput } = await import('../server.js');

test('validates and normalizes activation input', () => {
  assert.deepEqual(validateActivationInput('abc123', 'ab12 cd34 ef56'), {
    token: 'ABC123',
    code: 'AB12CD34EF56',
  });
  assert.throws(() => validateActivationInput('bad', 'AB12CD34EF56'), /6 letters/);
  assert.throws(() => validateActivationInput('ABC123', 'short'), /12 letters/);
});

test('extracts a useful response message', () => {
  assert.equal(pageMessage('<div class="alert"> Card activated successfully </div>'), 'Card activated successfully');
});

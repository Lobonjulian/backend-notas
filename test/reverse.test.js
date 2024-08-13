const { test } = require('node:test')
const assert = require('node:assert')

const reverse = require('../utils/for_testing').reverse

test('reverses a string', () => {
  const result = reverse('a')

  assert.strictEqual(result, 'a')
})

test('reverses of react', () => {
  const result = reverse('react')

  assert.strictEqual(result, 'tcaer')
})

test('reverses of a sentence', () => {
  const result = reverse('solos')

  assert.strictEqual(result, 'solos')
})
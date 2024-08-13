const { test, describe } = require('node:test')
const assert = require('node:assert')

const average = require('../utils/for_testing').average

describe('average', () => {
  test('de un valor es el valor mismo', () => {
    assert.strictEqual(average([1]), 1)
  })

  test('de muchos se calcula correctamente', () => {
    assert.strictEqual(average([1, 2, 3, 4, 5, 6]), 3.5)
  })

  test('el array es cero', () => {
    assert.strictEqual(average([]), 0)
  })
})
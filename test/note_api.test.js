const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const Nota = require('../models/notas')

const api = supertest(app)

const initialNotas = [
  {
    contenido: 'HTML es facil',
    important: false,
  },
  {
    contenido: 'los navegadores son para JavaScript',
    important: true,
  }
]


test('las notas se devuelven como Json', async () => {
  await api
    .get('/api/notas')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('la primera nota es sobre los metodos HTTP', async () => {
  const response = await api.get('/api/notas')

  const contents = response.body.map(e => e.contenido)
  assert.strictEqual(contents.includes('HTML es facil'), true)
})


beforeEach(async () => {
  await Nota.deleteMany({})
  let notaObject = new Nota(initialNotas[0])
  await notaObject.save()
  notaObject = new Nota(initialNotas[1])
  await notaObject.save()
})

after(async () => {
  await mongoose.connection.close()
})

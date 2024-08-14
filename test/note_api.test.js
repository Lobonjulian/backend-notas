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

beforeEach(async () => {
  await Nota.deleteMany({})

  let notaObject = new Nota(initialNotas[0])
  await notaObject.save()

  notaObject = new Nota(initialNotas[1])
  await notaObject.save()
})

test('las notas se devuelven como Json', async () => {
  await api
    .get('/api/notas')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('la primera nota es sobre los métodos HTTP', async () => {
  const response = await api.get('/api/notas')

  const contents = response.body.map(e => e.contenido)
  assert.strictEqual(contents.includes('HTML es facil'), true)
})

test('se puede agregar una nota valida'), async () => {
  const newNota = {
    contenido: 'async/await simplifica el manejo de promesas',
    important: true,
  }

  await api.post('/api/notas')
    .send(newNota)
    .expect(201)
    .expect('Content-T  ype', /application\/json/)

  const response = await api.get('/api/notas')

  const contenido = response.body.map(r => r.contenido)

  assert.strictEqual(response.body.length, initialNotas.length + 1)
  assert(contenido.includes('async/await simplifica el manejo de promesas'))
}

after(async () => {
  await mongoose.connection.close()
})

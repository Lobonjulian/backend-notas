const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Nota = require('../models/notas')

beforeEach(async () => {
  await Nota.deleteMany({})

  await Nota.insertMany(helper.initialNotas)
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

test('se puede agregar una nota valida', async () => {
  const newNota = {
    contenido: 'async/await simplifica el manejo de promesas',
    important: true,
  }

  await api
    .post('/api/notas')
    .send(newNota)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/notas')

  const contenido = response.body.map(r => r.contenido)

  assert.strictEqual(response.body.length, helper.initialNotas.length + 1)

  assert(contenido.includes('async/await simplifica el manejo de promesas'))
})

test('no se agrega nota sin contenido', async () => {
  const newNota = {
    important : true
  }

  await api
    .post('/api/notas')
    .send(newNota)
    .expect(400)

  const response = await api.get('/api/notas')

  assert.strictEqual(response.body.length, helper.initialNotas.length)
})

test('se puede ver una nota especifica', async () => {
  const notasAtStart = await helper.notaIdDb()

  const notaToView = notasAtStart[0]

  const resultNota = await api
    .get(`/api/notas/${notaToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resultNota.body, notaToView)
})

test('se puede eliminar una nota', async () => {
  const notasAtStart = await helper.notaIdDb()
  const notaToDelete = notasAtStart[0]

  await api
    .delete(`/api/notas/${notaToDelete.id}`)
    .expect(204)

  const notasFin = await helper.notaIdDb()

  const contenido = notasFin.map(r => r.contenido)
  assert(!contenido.includes(notaToDelete.contenido))

  assert.strictEqual(notasFin.length, helper.initialNotas.length - 1)
})

after(async () => {
  await mongoose.connection.close()
})
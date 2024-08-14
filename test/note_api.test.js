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

  let notaObject = new Nota(helper.initialNotas[0])
  await notaObject.save()

  notaObject = new Nota(helper.initialNotas[1])
  await notaObject.save()

})

test('las notas se devuelven como Json', async () => {
  await api
    .get('/api/notas')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('todas las notas retornadas', async () => {
  const response = await api.get('/api/notas')

  assert.strictEqual(response.body, helper.initialNotas)
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

  const notasFin = await helper.notasInDb()
  assert.strictEqual(notasFin.length, helper.initialNotas.length + 1)

  const contenido = notasFin.map(r => r.contenido)

  assert(contenido.includes('async/await simplifica el manejo de promesas'))
}

test('no se agrega nota sin contenido'), async () => {
  const newNota = {
    important : true
  }

  await api.post('/api/notas')
    .send(newNota)
    .expect(400)

  const notasFin = await helper.notasInDb()

  assert.strictEqual(notasFin.length, helper.initialNotas.length)
}

after(async () => {
  await mongoose.connection.close()
})

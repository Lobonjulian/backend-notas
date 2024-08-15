const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const User = require('../models/usuario')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

const Nota = require('../models/notas')

describe('cuando inicialmente hay algunas notas guardadas', () => {
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

    const contents = response.body.map((e) => e.contenido)
    assert.strictEqual(contents.includes('HTML es fácil'), true)
  })

  describe('cuando agrego una nota', () => {
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

      const contenido = response.body.map((r) => r.contenido)

      assert.strictEqual(response.body.length, helper.initialNotas.length + 1)

      assert(
        contenido.includes('async/await simplifica el manejo de promesas')
      )
    })

    test('no se agrega nota sin contenido', async () => {
      const newNota = {
        important: true,
      }

      await api.post('/api/notas').send(newNota).expect(400)

      const response = await api.get('/api/notas')

      assert.strictEqual(response.body.length, helper.initialNotas.length)
    })

    test('se puede ver una nota especifica', async () => {
      const notasAtStart = await helper.notaInDb()

      const notaToView = notasAtStart[0]

      const resultNota = await api
        .get(`/api/notas/${notaToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(resultNota.body, notaToView)
    })
  })

  describe('cuando elimino una nota', () => {
    test('se puede eliminar una nota', async () => {
      const notasAtStart = await helper.notaInDb()
      const notaToDelete = notasAtStart[0]

      await api.delete(`/api/notas/${notaToDelete.id}`).expect(204)

      const notasFin = await helper.notaInDb()
      assert.strictEqual(notasFin.length, helper.initialNotas.length - 1)

      const contenido = notasFin.map((r) => r.contenido)
      assert(!contenido.includes(notaToDelete.contenido))
    })
  })
})

describe('cuando inicialmente hay un usuario en la base de datos', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('la creación se realizó correctamente con un nuevo nombre de usuario', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUsuario = {
      username: 'julito',
      name: 'Julian Lobon',
      password: 'averigualo',
    }

    await api
      .post('/api/users')
      .send(newUsuario)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const username = usersAtEnd.map((u) => u.username)
    assert(username.includes(newUsuario.username))

  })

  test('la creación falla con el código de estado y el mensaje adecuados si el nombre de usuario ya está en uso', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUsario = {
      username: 'root',
      name: 'Superuser',
      password: 'averigualo',
    }

    const resultado = await api
      .post('/api/users')
      .send(newUsario)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(resultado.body.error.includes('se esperaba que `username` fuera unico'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})

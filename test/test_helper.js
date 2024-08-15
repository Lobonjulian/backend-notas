const Nota = require('../models/notas')
const User = require('../models/usuario')

const initialNotas = [
  {
    contenido: 'HTML es fácil',
    important: false,
  },
  {
    contenido: 'los navegadores son para JavaScript',
    important: true,
  }
]
const noExisteId = async () => {
  const nota = new Nota({
    contenido: 'HTML es fácil'
  })
  await nota.save()
  await nota.deleteOne()

  return nota._id.toString()
}

const notaInDb = async () => {
  const notas = await Nota.find({})
  return notas.map(nota => nota.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = { initialNotas, noExisteId, notaInDb, usersInDb }
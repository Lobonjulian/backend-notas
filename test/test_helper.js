const Nota = require('../models/notas')

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

const notaIdDb = async () => {
  const notas = await Nota.find({})
  return notas.map(nota => nota.toJSON())
}

module.exports = { initialNotas, noExisteId, notaIdDb }
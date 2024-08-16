const notasRouter = require('express').Router()
const Nota = require('../models/notas')
const User = require('../models/usuario')

notasRouter.get('/', async (request, response) => {
  const notas = await Nota.find({}).populate('user', { username: 1, name: 1 })

  response.json(notas)
})

notasRouter.get('/:id', async (request, res) => {
  const nota = await Nota.findById(request.params.id)
  if (nota) {
    res.json(nota)
  } else {
    res.status(404).end()
  }
})

notasRouter.post('/', async (request, res) => {
  const body = request.body

  const user = await User.findById(body.userId)

  const nota = new Nota({
    contenido: body.contenido, //generar el contenido y por la lógica lo hace obligatorio
    important: body.important === undefined ? false : body.important, //generar false por defect
    user: body.id,
  })

  const saveNota = await nota.save()
  user.notas = user.notas.concat(saveNota._id)
  await user.save()

  res.status(201).json(saveNota)
})

// eliminar Nota
notasRouter.delete('/:id', async (request, res) => {
  await Nota.findByIdAndDelete(request.params.id)
  res.status(204).end()
})

//actualizar Nota
notasRouter.put('/:id', (request, res, next) => {
  const { contenido, important } = request.body

  Nota.findByIdAndUpdate(
    request.params.id,
    { contenido, important },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedNota) => {
      res.json(updatedNota)
    })
    .catch((error) => next(error))
})

module.exports = notasRouter

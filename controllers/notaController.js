const notasRouter = require('express').Router()
const Nota = require('../models/notas')

notasRouter.get('/', async(request, response) => {
  const notas = await Nota.find({})
  response.json(notas)
})

notasRouter.get('/:id', (request, res, next) => {
  Nota.findById(request.params.id)
    .then((nota) => {
      if (nota) {
        res.json(nota)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

notasRouter.post('/', (request, res, next) => {
  const body = request.body

  const nota = new Nota({
    contenido: body.contenido, //generar el contenido y por la lógica lo hace obligatorio
    important: body.important || false, //generar false por defect
  })

  nota.save()
    .then((saveNota) => {
      res.status(201).json(saveNota)
    })
    .catch((error) => next(error))
})

// eliminar Nota
notasRouter.delete('/:id', (request, res, next) => {
  Nota.findByIdAndDelete(request.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

//actualizar Nota
notasRouter.put('/:id', (request, res, next) => {
  const { contenido, important } = request.body

  Nota.findByIdAndUpdate(request.params.id, { contenido, important }, { new: true, runValidators: true, context: 'query' })
    .then((updatedNota) => {
      res.json(updatedNota)
    })
    .catch((error) => next(error))
})

module.exports = notasRouter
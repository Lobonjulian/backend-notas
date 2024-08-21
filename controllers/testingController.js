const testingRouter = require('express').Router()
const Nota = require('../models/notas')
const User = require('../models/usuario')

testingRouter.get('/reset', async (request, response) => {
  await Nota.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = testingRouter

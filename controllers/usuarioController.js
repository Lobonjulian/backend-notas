const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/usuario')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const guardarUsuario = await user.save()

  response.status(201).json(guardarUsuario)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('notas', { contenido: 1, important: 1 })

  response.json(users)
})

module.exports = usersRouter
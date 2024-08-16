const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const loginRouter = require('express').Router()
const User = require('../models/usuario')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const usuario = await User.findOne({ username })
  const passwordCorrect = usuario === null
    ? false : await bcrypt.compare(password, usuario.passwordHash)

  if (!(usuario && passwordCorrect)) {
    return response.status(401).json({
      error: 'Usuario O Contraseña incorrecta'
    })
  }

  const userForToken = {
    username: usuario.username,
    id: usuario._id
  }

  //El tokken expira en 60*60 segundos, es decir en una Hora
  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60 * 60 })

  response
    .status(200)
    .send({ token, username: usuario.username, name: usuario.name })

})

module.exports = loginRouter
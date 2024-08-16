const config = require('./utils/config')
const express = require('express')
const app = express()
require('express-async-errors')
const cors = require('cors')
const notasRouter = require('./controllers/notaController')
const usersRouter = require('./controllers/usuarioController')

const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('conectando a: ', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('conectado a MongoDB')
  })
  .catch((error) => {
    logger.error('error conectando a MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notas', notasRouter)
app.use('/api/users',usersRouter)

app.use(middleware.puntoDesconocido)
app.use(middleware.errorHandler) // este debe ser el último middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!

module.exports = app
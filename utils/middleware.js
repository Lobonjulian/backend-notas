const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const puntoDesconocido = (request, response) => {
  response.status(404).send({ error: 'punto desconocido' })
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'id invalido' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 error de clave duplicada')) {
    return response.status(400).json({ error: 'se requiere un `username` unico' })
  }

  next(error)
}

module.exports = { requestLogger, puntoDesconocido, errorHandler }
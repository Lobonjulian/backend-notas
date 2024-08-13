const app = require('./app') //la aplicación de express real
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
  logger.info(`escuchando en el puerto ${config.PORT}`)
})

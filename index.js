const http = require('http')

const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-type': 'text/plain' })
  response.end('Hola mundo')
})

const PORT = 3000
app.listen(PORT)
console.log(`corriendo el puerto ${PORT}`);
const http = require('http')

let notas = [
  {
    id: 1,
    contenido: "HTML es facil",
    import: true
  },
  {
    id: 2,
    contenido: "los Navegadores solo ejecutan JavaScript", 
    import: false
  },
  {
    id: 3,
    contenido: "GET y POST son los mejores peticiones HTTP",
    import: true
  }

]

const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(notas))
})

const PORT = 3000
app.listen(PORT)
console.log(`corriendo el puerto ${PORT}`);
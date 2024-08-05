const express = require('express')

const app = express()

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

app.get('/', (require, res) => {
  res.send("<h1>Hola mundo</h1>")
})

app.get('/api/notas', (require, res) => {
  res.json(notas)
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`corriendo el puerto ${PORT}`)
})
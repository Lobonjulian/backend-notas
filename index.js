const express = require('express')
const app = express()

app.use(express.json())

let notas = [
  {
    id: 1,
    contenido: "HTML es fácil",
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

//raiz de la app
app.get('/', (require, res) => {
  res.send("<h1>Hola mundo</h1>")
})
 
//obtencion de notas
app.get('/api/notas', (request, res) => {
  res.json(notas)
})


app.get('/api/notas/:id', (request, res) => { 
  const id =Number(request.params.id)
  const nota = notas.find(nota =>  nota.id === id)

  if (nota) {
    res.json(nota)
  } else {
    res.status(404).end()
  }
})

// eliminar Nota
app.delete('/api/notas/:id', (request, res) => { 
  const id = Number(request.params.id)
  notas = notas.filter(nota => nota.id !== id)

  res.status(204).end()
})

//recibir información
app.post('/api/notas', (request, res) => {
  const nota = request.body
  console.log(nota)
  res.json(nota)
})

 
const PORT = 3001
app.listen(PORT, () => {
  console.log(`corriendo el puerto ${PORT}`)
})
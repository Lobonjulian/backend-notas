const express = require('express');
const app = express();
const cors = require('cors');

let notas = [
  {
    id: 1,
    contenido: 'HTML es fácil',
    important: true,
  },
  {
    id: 2,
    contenido: 'los Navegadores solo ejecutan JavaScript',
    important: false,
  },
  {
    id: 3,
    contenido: 'GET y POST son los mejores peticiones HTTP',
    important: true,
  },
];

// middleware
app.use(express.json());
app.use(express.static('dist'));
app.use(cors());

//raíz de la app
app.get('/', (require, res) => {
  res.send('<h1>Notas</h1>');
});

//obtención de notas
app.get('/api/notas', (request, res) => {
  res.json(notas);
});

app.get('/api/notas/:id', (request, res) => {
  const id = Number(request.params.id);
  const nota = notas.find((nota) => nota.id === id);

  if (nota) {
    res.json(nota);
  } else {
    res.status(404).end();
  }
});

// eliminar Nota
app.delete('/api/notas/:id', (request, res) => {
  const id = Number(request.params.id);
  notas = notas.filter((nota) => nota.id !== id);

  res.status(204).end();
});

//recibir información
const generarId = () => {
  const maxId = notas.length > 0 ? Math.max(...notas.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post('/api/notas', (request, res) => {
  const body = request.body;
  if (!body.contenido) {
    return res.status(400).json({
      error: 'El contenido es obligatorio',
    });
  }

  const nota = {
    contenido: body.contenido, //generar el contenido y por la lógica lo hace obligatorio
    important: Boolean(body.important) || false, //generar false por defect
    id: generarId(), //generar el id
  };
  notas = notas.concat(nota);

  res.json(nota);
});

const puntoDesconocido = (request, response) => {
  response.status(404).send({ error: 'punto desconocido' });
};

app.use(puntoDesconocido);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`corriendo el puerto ${PORT}`);
});

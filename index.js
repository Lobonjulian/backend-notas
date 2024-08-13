const express = require('express');
const app = express();
require('dotenv').config();

const Nota = require('./models/notas');

app.use(express.static('dist'));

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'id invalido' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message });
  }

  next(error);
};

const cors = require('cors');
app.use(express.json());
app.use(cors());
// app.use(logger); // request.body es undefined

const puntoDesconocido = (request, response) => {
  response.status(404).send({ error: 'punto desconocido' });
};

//raíz de la app
app.get('/', (require, res) => {
  res.send('<h1>Notas</h1>');
});

//obtención de notas
app.get('/api/notas', (request, res) => {
  Nota.find({}).then((notas) => {
    res.json(notas);
  });
});

app.get('/api/notas/:id', (request, res, next) => {
  Nota.findById(request.params.id)
    .then((nota) => {
      if (nota) {
        res.json(nota);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post('/api/notas', (request, res, next) => {
  // request.body es undefined
  const body = request.body;

  const nota = new Nota({
    contenido: body.contenido, //generar el contenido y por la lógica lo hace obligatorio
    important: body.important || false, //generar false por defect
  });

  nota
    .save()
    .then((saveNota) => {
      res.json(saveNota);
    })
    .catch((error) => next(error));
});

// eliminar Nota
app.delete('/api/notas/:id', (request, res, next) => {
  Nota.findByIdAndDelete(request.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

//actualizar Nota
app.put('/api/notas/:id', (request, res, next) => {
  const body = request.body;

  const nota = {
    contenido: body.contenido,
    important: body.important,
  };

  Nota.findByIdAndUpdate(request.params.id, nota, { new: true })
    .then((updatedNota) => {
      res.json(updatedNota);
    })
    .catch((error) => next(error));
});

//controlador de solicitudes de endpoints desconocidos
app.use(puntoDesconocido);

//controlador de solicitudes de error
app.use(errorHandler); // este debe ser el último middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`corriendo el puerto ${PORT}`);
});

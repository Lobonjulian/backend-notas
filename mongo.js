const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('dar contraseña como argumento');
  process.exit(1);
}

const password = process.arg[2];

const url = process.argv[3];

mongoose.set('strictQuery', false);

mongoose.connect(url);

const notaSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

const Nota = mongoose.model('Nota', notaSchema);

const nota = new Nota(
  {
    content: 'CSS es fácil',
    important: true,
  },
  {
    content: 'Mongo es Complejo',
    important: false,
  },
  { content: 'Solid es fácil', important: true }
);

// nota.save().then((result) => {
//   console.log('nota guardada');
//   mongoose.connection.close();
// });

Nota.find({}).then((result) => {
  result.forEach((nota) => {
    console.log(nota);
  });
  mongoose.connection.close();
});

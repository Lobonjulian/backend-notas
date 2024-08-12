const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('dar contraseña como argumento');
  process.exit(1);
}

const password = 527;

const url = `mongodb+srv://julitolos6:${password}@cluster0.krs4t.mongodb.net/notaApp?retryWrites=true&w=majority`;

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

const mongoose = require('mongoose')

const notaSchema = new mongoose.Schema({
  contenido: {
    type: String,
    minlength: 5,
    required: true,
  },
  important: Boolean,
})

notaSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Nota', notaSchema)

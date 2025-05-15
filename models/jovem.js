const mongoose = require('mongoose');

const jovemSchema = new mongoose.Schema({
  nome: String,
  nascimento: String,
  cidade: String,
  bairro: String,
  whatsapp: String,
  email: String,
  raca: String,
  estudando: String,
  escola: String,
  serie: String,
  turno: String,
  cursos: [String],
  objetivo: {
    type: mongoose.Schema.Types.Mixed // permite string, array ou null
  },
  experiencias: [String],
  habilidades: [String],
}, {
  timestamps: true
});

module.exports = mongoose.model('Jovem', jovemSchema);

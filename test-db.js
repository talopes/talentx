require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000
})
.then(() => {
  console.log("✅ Conectado com sucesso ao MongoDB");
  process.exit();
})
.catch(err => {
  console.error("❌ Erro de conexão:", err.message);
  process.exit(1);
});

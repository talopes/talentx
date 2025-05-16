require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const ejs = require('ejs');
const Jovem = require('./models/jovem');

const app = express();

// Conexão com MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('🟢 MongoDB conectado'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'talentx_secret',
  resave: false,
  saveUninitialized: true,
}));

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rotas
app.get('/intro', (req, res) => res.render('intro'));
app.get('/', (req, res) => res.redirect('/intro'));

app.get('/step1', (req, res) => res.render('step1'));
app.post('/step1', (req, res) => {
  req.session.formData = { ...req.body };
  res.redirect('/step2');
});

app.get('/step2', (req, res) => res.render('step2'));
app.post('/step2', (req, res) => {
  const cursos = [].concat(req.body.cursos || []);
  req.session.formData = {
    ...req.session.formData,
    ...req.body,
    cursos
  };
  res.redirect('/step2-transition');
});

app.get('/step2-transition', (req, res) => res.render('step2_transition'));

app.get('/step3', (req, res) => res.render('step3'));
app.post('/step3', (req, res) => {
  const experiencias = [].concat(req.body.experiencias || []);
  req.session.formData = {
    ...req.session.formData,
    ...req.body,
    experiencias
  };
  res.redirect('/step4');
});

app.get('/step4', (req, res) => res.render('step4'));
app.post('/step4', async (req, res) => {
  const habilidades = [].concat(req.body.habilidades || []);
  const objetivo = Array.isArray(req.body.objetivo) ? req.body.objetivo[0] : req.body.objetivo;
  req.session.formData = {
  ...req.session.formData,
  ...req.body,
  objetivo,
  habilidades
};
  console.log("Dados que serão salvos no MongoDB:", req.session.formData); // <--- AQUI

  try {
    await Jovem.create(req.session.formData);
    console.log("Dados que serão salvos no banco:", req.session.formData);
    res.redirect('/resumo');
  } catch (err) {
    console.error('Erro ao salvar jovem:', err); // <-- VER O QUE DIZ AQUI
    res.status(500).send(`Erro ao salvar dados: ${err.message}`);
  }
});


app.get('/resumo', (req, res) => {
  res.render('resumo', { fullData: req.session.formData });
});

app.get('/missao', (req, res) => {
  res.render('missao');
});

const puppeteer = require('puppeteer');

app.get('/download-pdf', async (req, res) => {
  const filePath = path.join(__dirname, 'views', 'resumo.ejs');
  const data = req.session.formData;

  ejs.renderFile(filePath, { fullData: data }, async (err, html) => {
    if (err) {
      console.error('Erro ao renderizar EJS:', err);
      return res.status(500).send('Erro ao gerar PDF');
    }

    try {
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({ format: 'A4' });

      await browser.close();

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=curriculo-talentx.pdf',
        'Content-Length': pdfBuffer.length
      });

     res.status(500).send(`
        <h2 style="text-align:center; font-family:sans-serif; color:#e11d48;">
         🚫 Erro ao gerar PDF<br> Tente novamente mais tarde.
        </h2>
`);

  });
});



// Start
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 TalentX rodando em http://localhost:${PORT}`);
});

const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();



const roomRoutes = require('./routes/roomRoutes');
const movieRoutes = require('./routes/movieRoutes');
const voteRoutes = require('./routes/voteRoutes');

const app = express();

app.use(cors({
  origin: '*', // Aceita requisições de qualquer IP (Celular, PC, etc)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'x-session-uuid'] // <--- OBRIGATÓRIO: Libera seu header de UUID
}));
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;


app.use(cors()); 
app.use(express.json()); 


app.get('/', (req, res) => {
  res.json({ 
    status: 'online', 
    message: 'CineMatch API is running 🚀' 
  });
});


app.use('/api/rooms', roomRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/votes', voteRoutes);


const start = async () => {
  try {
    console.log('⏳ Conectando ao Banco de Dados...');
    await prisma.$connect(); 
    console.log('✅ Banco de dados conectado com sucesso!');
    
    app.listen(PORT, '0.0.0.0',() => {
      console.log(`🔥 Servidor rodando na porta ${PORT}`);
      console.log(`➡️  Rota de teste: http://localhost:${PORT}/api/rooms (POST)`);
    });
  } catch (error) {
    console.error('❌ Erro fatal ao iniciar o servidor:', error);
    process.exit(1);
  }
};

start();
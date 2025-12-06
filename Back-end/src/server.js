const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const roomRoutes = require('./routes/roomRoutes');

const app = express();
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

const start = async () => {
  try {
    console.log('⏳ Conectando ao Banco de Dados...');
    await prisma.$connect(); 
    console.log('✅ Banco de dados conectado com sucesso!');
    
    app.listen(PORT, () => {
      console.log(`🔥 Servidor rodando na porta ${PORT}`);
      console.log(`➡️  Rota de teste: http://localhost:${PORT}/api/rooms (POST)`);
    });
  } catch (error) {
    console.error('❌ Erro fatal ao iniciar o servidor:', error);
    process.exit(1);
  }
};

start();
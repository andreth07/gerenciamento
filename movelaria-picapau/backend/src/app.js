const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração para servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Configuração do MongoDB com retry
const connectWithRetry = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Conectado ao MongoDB com sucesso!');
    } catch (err) {
        console.error('Erro ao conectar ao MongoDB:', err);
        console.log('Tentando reconectar em 5 segundos...');
        setTimeout(connectWithRetry, 5000);
    }
};

connectWithRetry();

// Tratamento de eventos do MongoDB
mongoose.connection.on('error', (err) => {
    console.error('Erro na conexão com MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB desconectado. Tentando reconectar...');
    connectWithRetry();
});

// Rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/leader', require('./routes/leader'));

// Rota básica para teste da API
app.get('/', (req, res) => {
    res.json({ 
        message: 'API da Movelaria Pica Pau está funcionando!',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
    });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro:', err.stack);
    
    // Tratamento específico para erros do Multer
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
            message: 'Arquivo muito grande. Tamanho máximo permitido: 5MB' 
        });
    }

    // Tratamento específico para erros de validação do Mongoose
    if (err.name === 'ValidationError') {
        return res.status(400).json({ 
            message: 'Erro de validação', 
            errors: Object.values(err.errors).map(e => e.message) 
        });
    }

    // Erro genérico
    res.status(500).json({ 
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
    res.status(404).json({ 
        message: 'Rota não encontrada',
        path: req.path
    });
});

// Configuração da porta
const PORT = process.env.PORT || 3000;

// Inicialização do servidor
const server = app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`URL da API: http://localhost:${PORT}`);
});

// Tratamento gracioso de encerramento
process.on('SIGTERM', () => {
    console.log('Recebido SIGTERM. Encerrando graciosamente...');
    server.close(() => {
        console.log('Servidor encerrado');
        mongoose.connection.close(false, () => {
            console.log('Conexão MongoDB fechada');
            process.exit(0);
        });
    });
});

// Tratamento de erros não capturados
process.on('uncaughtException', (err) => {
    console.error('Erro não tratado:', err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('Promise rejeitada não tratada:', err);
    process.exit(1);
});

module.exports = app;
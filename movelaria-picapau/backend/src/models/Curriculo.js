const mongoose = require('mongoose');

const curriculoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    cargoPretendido: {
        type: String,
        required: true
    },
    arquivoUrl: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pendente', 'em_analise', 'aprovado', 'rejeitado'],
        default: 'pendente'
    },
    dataEnvio: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Curriculo', curriculoSchema);
const mongoose = require('mongoose');

const avaliacaoSchema = new mongoose.Schema({
    funcionarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Funcionario',
        required: true
    },
    liderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    equipeId: {
        type: String,
        required: true
    },
    mes: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    },
    ano: {
        type: Number,
        required: true
    },
    pontuacao: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    observacoes: {
        type: String,
        maxlength: 500
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Índices para melhor performance nas consultas
avaliacaoSchema.index({ funcionarioId: 1, mes: 1, ano: 1 }, { unique: true });
avaliacaoSchema.index({ equipeId: 1 });

module.exports = mongoose.model('Avaliacao', avaliacaoSchema);
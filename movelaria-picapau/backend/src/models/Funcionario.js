const mongoose = require('mongoose');

const funcionarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    cargo: {
        type: String,
        required: true,
        enum: ['lider', 'funcionario']
    },
    equipe: {
        type: String,
        required: true,
        enum: ['equipe1', 'equipe2', 'equipe3', 'equipe4', 'equipe5']
    },
    dataAdmissao: {
        type: Date,
        required: true
    },
    avaliacao: {
        type: Number,
        default: 0,
        min: 0,
        max: 10
    },
    bonificado: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Funcionario', funcionarioSchema);
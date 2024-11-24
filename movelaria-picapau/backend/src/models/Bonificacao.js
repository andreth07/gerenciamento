const mongoose = require('mongoose');

const bonificacaoSchema = new mongoose.Schema({
    funcionarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Funcionario',
        required: true
    },
    mes: {
        type: Number,
        required: true
    },
    ano: {
        type: Number,
        required: true
    },
    valor: {
        type: Number,
        required: true
    },
    dataConcessao: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Bonificacao', bonificacaoSchema);
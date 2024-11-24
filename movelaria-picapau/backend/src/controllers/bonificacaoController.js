const Bonificacao = require('../models/Bonificacao');
const Funcionario = require('../models/Funcionario');

exports.listarBonificacoes = async (req, res) => {
    try {
        const funcionarios = await Funcionario.find().sort('equipe');
        
        // Agrupa funcionários por equipe
        const equipes = {};
        funcionarios.forEach(func => {
            if (!equipes[func.equipe]) {
                equipes[func.equipe] = [];
            }
            equipes[func.equipe].push(func);
        });

        // Formata dados para resposta
        const bonificacoes = Object.keys(equipes).map(equipe => ({
            nome: equipe,
            funcionarios: equipes[equipe].map(func => ({
                id: func._id,
                nome: func.nome,
                avaliacao: func.avaliacao,
                bonificado: func.bonificado
            }))
        }));

        res.json(bonificacoes);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar bonificações' });
    }
};

exports.concederBonificacao = async (req, res) => {
    try {
        const { funcionarioId, valor } = req.body;
        const data = new Date();

        const bonificacao = await Bonificacao.create({
            funcionarioId,
            mes: data.getMonth() + 1,
            ano: data.getFullYear(),
            valor
        });

        // Atualiza status do funcionário
        await Funcionario.findByIdAndUpdate(funcionarioId, {
            bonificado: true
        });

        res.status(201).json(bonificacao);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao conceder bonificação' });
    }
};
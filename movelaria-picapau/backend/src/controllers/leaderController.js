const User = require('../models/User');
const Funcionario = require('../models/Funcionario');
const Avaliacao = require('../models/Avaliacao');

// Informações do líder e sua equipe
exports.getLeaderInfo = async (req, res) => {
    try {
        const leader = await User.findById(req.userId);
        if (!leader) {
            return res.status(404).json({ message: 'Líder não encontrado' });
        }

        res.json({
            name: leader.name,
            teamId: leader.equipeId,
            teamNumber: leader.equipeId.replace('equipe', '')
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar informações do líder' });
    }
};

// Lista membros da equipe
exports.getTeamMembers = async (req, res) => {
    try {
        const leader = await User.findById(req.userId);
        const funcionarios = await Funcionario.find({ equipe: leader.equipeId })
            .select('nome cargo foto dataAdmissao');

        // Buscar últimas avaliações para cada funcionário
        const funcionariosComAvaliacoes = await Promise.all(
            funcionarios.map(async (func) => {
                const avaliacoes = await Avaliacao.find({ 
                    funcionarioId: func._id 
                })
                .sort('-createdAt')
                .limit(5);

                const ultimaAvaliacao = avaliacoes[0]?.createdAt;

                return {
                    ...func.toObject(),
                    avaliacoes,
                    ultimaAvaliacao
                };
            })
        );

        res.json(funcionariosComAvaliacoes);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar membros da equipe' });
    }
};

// Criar nova avaliação
exports.createAvaliacao = async (req, res) => {
    try {
        const { funcionarioId, mes, pontuacao, observacoes } = req.body;
        const leader = await User.findById(req.userId);

        // Verificar se o funcionário pertence à equipe do líder
        const funcionario = await Funcionario.findOne({
            _id: funcionarioId,
            equipe: leader.equipeId
        });

        if (!funcionario) {
            return res.status(403).json({ 
                message: 'Funcionário não pertence à sua equipe' 
            });
        }

        // Verificar se já existe avaliação para este mês
        const anoAtual = new Date().getFullYear();
        const avaliacaoExistente = await Avaliacao.findOne({
            funcionarioId,
            mes,
            ano: anoAtual
        });

        if (avaliacaoExistente) {
            return res.status(400).json({ 
                message: 'Já existe uma avaliação para este funcionário neste mês' 
            });
        }

        const avaliacao = await Avaliacao.create({
            funcionarioId,
            liderId: req.userId,
            equipeId: leader.equipeId,
            mes,
            ano: anoAtual,
            pontuacao,
            observacoes
        });

        res.status(201).json(avaliacao);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar avaliação' });
    }
};

// Listar avaliações
exports.getAvaliacoes = async (req, res) => {
    try {
        const { mes, funcionarioId } = req.query;
        const leader = await User.findById(req.userId);

        let query = { equipeId: leader.equipeId };

        if (mes) query.mes = parseInt(mes);
        if (funcionarioId) query.funcionarioId = funcionarioId;

        const avaliacoes = await Avaliacao.find(query)
            .populate('funcionarioId', 'nome')
            .sort('-createdAt');

        const avaliacoesFormatadas = avaliacoes.map(av => ({
            id: av._id,
            funcionario: {
                id: av.funcionarioId._id,
                nome: av.funcionarioId.nome
            },
            mes: av.mes,
            ano: av.ano,
            pontuacao: av.pontuacao,
            observacoes: av.observacoes,
            createdAt: av.createdAt
        }));

        res.json(avaliacoesFormatadas);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar avaliações' });
    }
};
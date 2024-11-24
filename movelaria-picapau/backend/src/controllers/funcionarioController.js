const Funcionario = require('../models/Funcionario');

exports.listarFuncionarios = async (req, res) => {
    try {
        const funcionarios = await Funcionario.find().sort('nome');
        res.json(funcionarios);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar funcionários' });
    }
};

exports.criarFuncionario = async (req, res) => {
    try {
        const { nome, cargo, equipe, dataAdmissao } = req.body;

        const funcionario = await Funcionario.create({
            nome,
            cargo,
            equipe,
            dataAdmissao
        });

        res.status(201).json(funcionario);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao criar funcionário' });
    }
};

exports.atualizarFuncionario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, cargo, equipe, dataAdmissao } = req.body;

        const funcionario = await Funcionario.findByIdAndUpdate(id, {
            nome,
            cargo,
            equipe,
            dataAdmissao
        }, { new: true });

        if (!funcionario) {
            return res.status(404).json({ message: 'Funcionário não encontrado' });
        }

        res.json(funcionario);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao atualizar funcionário' });
    }
};

exports.deletarFuncionario = async (req, res) => {
    try {
        const { id } = req.params;
        await Funcionario.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: 'Erro ao deletar funcionário' });
    }
};
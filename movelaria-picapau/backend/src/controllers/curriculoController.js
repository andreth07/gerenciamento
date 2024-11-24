const Curriculo = require('../models/Curriculo');
const multer = require('multer');
const path = require('path');

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/curriculos/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

exports.upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Apenas arquivos PDF são permitidos'));
        }
    }
}).single('curriculo');

exports.listarCurriculos = async (req, res) => {
    try {
        const curriculos = await Curriculo.find().sort('-dataEnvio');
        res.json(curriculos);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar currículos' });
    }
};

exports.criarCurriculo = async (req, res) => {
    try {
        const { nome, email, cargoPretendido } = req.body;
        const arquivoUrl = req.file.path;

        const curriculo = await Curriculo.create({
            nome,
            email,
            cargoPretendido,
            arquivoUrl
        });

        res.status(201).json(curriculo);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao cadastrar currículo' });
    }
};

exports.atualizarStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const curriculo = await Curriculo.findByIdAndUpdate(id, {
            status
        }, { new: true });

        if (!curriculo) {
            return res.status(404).json({ message: 'Currículo não encontrado' });
        }

        res.json(curriculo);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao atualizar status' });
    }
};
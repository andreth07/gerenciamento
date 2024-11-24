const express = require('express');
const router = express.Router();
const funcionarioController = require('../controllers/funcionarioController');
const curriculoController = require('../controllers/curriculoController');
const bonificacaoController = require('../controllers/bonificacaoController');
const authMiddleware = require('../middlewares/auth');

// Middleware de autenticação
router.use(authMiddleware);

// Rotas de Funcionários
router.get('/funcionarios', funcionarioController.listarFuncionarios);
router.post('/funcionarios', funcionarioController.criarFuncionario);
router.put('/funcionarios/:id', funcionarioController.atualizarFuncionario);
router.delete('/funcionarios/:id', funcionarioController.deletarFuncionario);

// Rotas de Currículos
router.get('/curriculos', curriculoController.listarCurriculos);
router.post('/curriculos', curriculoController.upload, curriculoController.criarCurriculo);
router.put('/curriculos/:id/status', curriculoController.atualizarStatus);

// Rotas de Bonificações
router.get('/bonificacoes', bonificacaoController.listarBonificacoes);
router.post('/bonificacoes', bonificacaoController.concederBonificacao);

module.exports = router;
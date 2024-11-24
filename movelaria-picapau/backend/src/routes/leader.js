const express = require('express');
const router = express.Router();
const leaderController = require('../controllers/leaderController');
const authMiddleware = require('../middlewares/auth');

// Middleware de autenticação
router.use(authMiddleware);

// Middleware para verificar se é líder
router.use((req, res, next) => {
    if (req.userType !== 'leader') {
        return res.status(403).json({ message: 'Acesso não autorizado' });
    }
    next();
});

// Rotas
router.get('/info', leaderController.getLeaderInfo);
router.get('/team', leaderController.getTeamMembers);
router.get('/avaliacoes', leaderController.getAvaliacoes);
router.post('/avaliacoes', leaderController.createAvaliacao);

module.exports = router;
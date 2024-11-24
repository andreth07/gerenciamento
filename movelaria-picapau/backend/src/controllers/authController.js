const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Função de login
const login = async (req, res) => {
    try {
        const { email, password, userType } = req.body;

        // Buscar usuário
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(400).json({ message: 'Usuário não encontrado' });
        }

        // Verificar se o tipo de usuário corresponde
        if (user.userType !== userType) {
            return res.status(400).json({ message: 'Tipo de usuário inválido' });
        }

        // Verificar senha
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Senha inválida' });
        }

        // Gerar token
        const token = jwt.sign(
            { id: user.id, userType: user.userType },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.json({
            token,
            userType: user.userType
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// Função de registro
const register = async (req, res) => {
    try {
        const { name, email, password, userType } = req.body;

        // Verificar se o email já existe
        if (await User.findOne({ email })) {
            return res.status(400).json({ message: 'Email já cadastrado' });
        }

        // Criar novo usuário
        const user = await User.create({
            name,
            email,
            password,
            userType
        });

        // Remover password do objeto de retorno
        user.password = undefined;

        // Gerar token
        const token = jwt.sign(
            { id: user.id, userType: user.userType },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(201).json({
            user,
            token
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao registrar usuário' });
    }
};

module.exports = {
    login,
    register
};
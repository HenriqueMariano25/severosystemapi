const { Usuario } = require("../models")
const {Op} = require("sequelize");

class UsuarioController {
    async cadastrar(req, res) {
        const {nome, senha, usuario: novoUsuario, cargo, data_admissao } = req.body

        if (!nome || !senha || !novoUsuario || !cargo || !data_admissao)
            return res.status(400).json({message: "Dados faltando para realizar o cadastro!"})

        const usuarioCriado = await Usuario.findOne({where: {usuario: novoUsuario}})

        if (usuarioCriado)
            return res.status(400).json({message: "Usuário ou email já utilizado"})

        const usuario = await Usuario.create({
            nome,
            senha,
            usuario: novoUsuario,
            cargo,
            data_admissao
        })

        return res.status(200).json({usuario})
    }


    async editar(req, res) {
        const {id, nome} = req.body

        const usuario = await Usuario.findOne({where: {id}})

        if (!usuario)
            return res.status(400).json({message: "Usuário não encontrado"})

        await usuario.update({nome})

        return res.status(200).json({usuario})
    }

    async deletar(req, res) {
        const {id} = req.params

        const usuario = await Usuario.findOne({where: {id}})

        if (!usuario) return res.status(400).json({message: "Usuário não encontrado"})

        await usuario.destroy()

        return res.status(200).json({usuario})
    }

    async buscar(req, res) {
        const {id} = req.params

        const usuario = await Usuario.findOne({where: {id}})

        if (!usuario) return res.status(400).json({message: "Usuário não encontrado"})

        return res.status(200).json({usuario})
    }

    async buscarTodos(req, res) {
        let usuarios = await Usuario.findAll()

        return res.status(200).json({usuarios: usuarios})
    }

    async login(req, res) {
        const {usuario: usuarioCriado, senha} = req.query

        const usuario = await Usuario.findOne({
            where: {usuario: usuarioCriado}
        })

        if (!usuario) return res.status(401).json({message: "Usuário não encontrado", type: "invalid_data"})

        if (!(await usuario.verificarSenha(senha))) {
            return res.status(401).json({message: "Senha incorreta", type: "invalid_data"})
        }

        const token = usuario.gerarToken()

        return res.status(200).json({'usuario': usuario, 'Authorization': token})
    }
}

module.exports = new UsuarioController()
const {Cliente} = require("../models")

class ClienteController {
    async cadastrar(req, res) {
        let {nome, email, cpf_cnpj, telefone, cnh} = req.body

        if (!nome || !email || !cpf_cnpj || !telefone || !cnh)
            return res.status(400).json({message: "Dados obrigatorios faltando"})

        let cliente = await Cliente.create({nome, email, cpf_cnpj, telefone, cnh})

        return res.status(200).json({cliente: cliente})
    }

    async editar(req, res) {
        let {nome, email, cpf_cnpj, telefone, cnh} = req.body
        let {id} = req.params

        let cliente = await Cliente.findOne({where: {id}})

        await cliente.update({nome, email, cpf_cnpj, telefone, cnh})

        return res.status(200).json({cliente: cliente})
    }

    async deletar(req, res) {
        let {id} = req.params

        let cliente = await Cliente.findOne({where: {id}})

        await cliente.destroy()

        return res.status(200).json({cliente: cliente})
    }

    async buscarTodos(req, res) {
        let clientes = await Cliente.findAll()

        return res.status(200).json({clientes: clientes})
    }

    async buscar(req, res) {
        let {id} = req.params

        let cliente = await Cliente.findOne({where: {id}})

        return res.status(200).json({ cliente: cliente})
    }
}

module.exports = new ClienteController()
const {Plano} = require("../models");

class PlanoController {
    async cadastrar(req, res) {
        let {descricao, valor} = req.body

        if (!descricao || !valor)
            return res.status(400).json({message: "Dados obrigatorios faltando"})

        let plano = await Plano.create({descricao, valor})

        return res.status(200).json({plano: plano})
    }

    async editar(req, res) {
        let {descricao, valor} = req.body
        let {id} = req.params

        let plano = await Plano.findOne({where: {id}})

        await plano.update({descricao, valor})

        return res.status(200).json({plano: plano})
    }

    async deletar(req, res) {
        let {id} = req.params

        let plano = await Plano.findOne({where: {id}})

        await plano.destroy()

        return res.status(200).json({plano: plano})
    }

    async buscarTodos(req, res) {
        let planos = await Plano.findAll()

        return res.status(200).json({planos: planos})
    }

    async buscar(req, res) {
        let {id} = req.params

        let plano = await Plano.findOne({where: {id}})

        return res.status(200).json({plano: plano})
    }
}

module.exports = new PlanoController()
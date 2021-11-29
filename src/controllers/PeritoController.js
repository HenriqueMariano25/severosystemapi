const {Perito} = require("../models");

class PeritoController {
    async cadastrar(req, res) {
        let {nome} = req.body

        if (!nome)
            return res.status(400).json({message: "Dados obrigatorios faltando"})

        let perito = await Perito.create({nome})

        return res.status(200).json({perito: perito})
    }

    async editar(req, res) {
        let {nome} = req.body
        let {id} = req.params

        let perito = await Perito.findOne({where: {id}})

        await perito.update({nome})

        return res.status(200).json({perito: perito})
    }

    async deletar(req, res) {
        let {id} = req.params

        let perito = await Perito.findOne({where: {id}})

        await perito.destroy()

        return res.status(200).json({perito: perito})
    }

    async buscarTodos(req, res) {
        let peritos = await Perito.findAll()

        return res.status(200).json({peritos: peritos})
    }

    async buscar(req, res) {
        let {id} = req.params

        let perito = await Perito.findOne({where: {id}})

        return res.status(200).json({perito: perito})
    }
}

module.exports = new PeritoController()
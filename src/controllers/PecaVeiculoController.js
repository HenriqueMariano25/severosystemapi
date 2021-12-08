const {PecaVeiculo} = require("../models");

class PecaVeiculoController{
    async cadastrar(req, res) {
        let {descricao} = req.body

        if (!descricao)
            return res.status(400).json({message: "Dados obrigatorios faltando"})

        let pecaVeiculo = await PecaVeiculo.create({descricao})

        return res.status(200).json({pecaVeiculo: pecaVeiculo})
    }

    async editar(req, res) {
        let {descricao} = req.body
        let {id} = req.params

        let pecaVeiculo = await PecaVeiculo.findOne({where: {id}})

        await pecaVeiculo.update({descricao})

        return res.status(200).json({pecaVeiculo: pecaVeiculo})
    }

    async deletar(req, res) {
        let {id} = req.params

        let pecaVeiculo = await PecaVeiculo.findOne({where: {id}})

        await pecaVeiculo.destroy()

        return res.status(200).json({pecaVeiculo: pecaVeiculo})
    }

    async buscarTodos(req, res) {
        let pecaVeiculo = await PecaVeiculo.findAll()

        return res.status(200).json({pecasVeiculo: pecasVeiculo})
    }

    async buscar(req, res) {
        let {id} = req.params

        let pecaVeiculo = await PecaVeiculo.findOne({where: {id}})

        return res.status(200).json({ pecaVeiculo: pecaVeiculo})
    }

}

module.exports = new PecaVeiculoController()
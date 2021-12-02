const {Servico} = require("../models");

class ServicoController{
    async cadastrar(req, res) {
        let {valor, tipo_servico_id} = req.body

        if (!valor || !tipo_servico_id)
            return res.status(400).json({message: "Dados obrigatorios faltando"})

        let servico = await Servico.create({valor, tipo_servico_id})

        return res.status(200).json({servico: servico})
    }

    async editar(req, res) {
        let {valor, tipo_servico_id} = req.body
        let {id} = req.params

        let servico = await Servico.findOne({where: {id}})

        await servico.update({valor, tipo_servico_id})

        return res.status(200).json({servico: servico})
    }

    async deletar(req, res) {
        let {id} = req.params

        let servico = await Servico.findOne({where: {id}})

        await servico.destroy()

        return res.status(200).json({servico: servico})
    }

    async buscarTodos(req, res) {
        let servicos = await Servico.findAll()

        return res.status(200).json({servicos: servicos})
    }

    async buscar(req, res) {
        let {id} = req.params

        let servico = await Servico.findOne({where: {id}})

        return res.status(200).json({ servico: servico})
    }
}

module.exports = new ServicoController()
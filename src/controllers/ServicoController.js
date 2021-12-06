const {Servico, TipoServico} = require("../models");

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

    async cadastrarTipoServico(req, res){
        let {descricao} = req.body

        if(!descricao)
            return res.status(400).json({message: "Dados obrigatorios faltando"})

        let tipoServico = await TipoServico.create({ descricao })

        return res.status(200).json({tipoServico: tipoServico})

    }

    async buscarTipoServico(req, res) {
        let tiposServico = await TipoServico.findAll({order: ['descricao']})

        return res.status(200).json({tiposServico: tiposServico})
    }

    async editarTipoServico(req, res) {
        let {descricao} = req.body
        let {id} = req.params

        let tipoServico = await TipoServico.findOne({where: {id}})

        await tipoServico.update({descricao})

        return res.status(200).json({tipoServico: tipoServico})
    }

    async deletarTipoServico(req, res) {
        let {id} = req.params

        let tipoServico = await TipoServico.findOne({where: {id}})

        await tipoServico.destroy()

        return res.status(200).json({tipoServico: tipoServico})
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
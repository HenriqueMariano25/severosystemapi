const { Servico, TipoServico } = require("../models")

class ServicoController {
	async cadastrar(req, res) {
		let { valor, tipo_servico_id } = req.body

		if (!valor || !tipo_servico_id)
			return res.status(400).json({ message: "Dados obrigatorios faltando" })

		let servico = await Servico.create({ valor, tipo_servico_id })

		return res.status(200).json({ servico: servico })
	}

	async editar(req, res) {
		let { valor, tipo_servico_id } = req.body
		let { id } = req.params

		let servico = await Servico.findOne({ where: { id } })

		await servico.update({ valor, tipo_servico_id })

		return res.status(200).json({ servico: servico })
	}

	async cadastrarTipoServico(req, res) {
		let {
			descricao,
			valor,
			valor_variavel,
			aparecer_laudo,
			entrada_saida,
			obrigatorio_cliente,
			obrigatorio_detalhe,
		} = req.body

		if (!descricao) return res.status(400).json({ message: "Dados obrigatorios faltando" })

		let tipoServico = await TipoServico.create({
			descricao,
			valor,
			valor_variavel,
			aparecer_laudo,
			entrada_saida,
			obrigatorio_cliente,
			obrigatorio_detalhe,
		})

		return res.status(200).json({ tipoServico: tipoServico })
	}

	async buscarTiposServico(req, res) {
		const { entrada_saida } = req.query

		let filtro = {}
		if (entrada_saida) {
			filtro = { where: { entrada_saida } }
		}


		let tiposServico = await TipoServico.findAll({ ...filtro, order: ["descricao"] })

		return res.status(200).json({ tiposServico: tiposServico })
	}

	async buscarTiposServicoCriacaoLaudo(req, res) {
		try {
			const tiposServico = await TipoServico.findAll({
				order: ["descricao"],
				where: { aparecer_laudo: true },
			})

			return res.status(200).json({ falha: false, dados: { tiposServico } })
		} catch (error) {
			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async buscarTipoServico(req, res) {
		const { id } = req.params
		try {
			const tipoServico = await TipoServico.findOne({ where: { id } })
			return res.status(200).json({ falha: false, dados: { tipoServico } })
		} catch (error) {
			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async editarTipoServico(req, res) {
		let {
			descricao,
			valor,
			valor_variavel,
			aparecer_laudo,
			entrada_saida,
			obrigatorio_cliente,
			obrigatorio_detalhe,
		} = req.body
		let { id } = req.params

		let tipoServico = await TipoServico.findOne({ where: { id } })

		await tipoServico.update({
			descricao,
			valor,
			valor_variavel,
			aparecer_laudo,
			entrada_saida,
			obrigatorio_cliente,
			obrigatorio_detalhe,
		})

		return res.status(200).json({ tipoServico: tipoServico })
	}

	async deletarTipoServico(req, res) {
		let { id } = req.params

		let tipoServico = await TipoServico.findOne({ where: { id } })

		await tipoServico.destroy()

		return res.status(200).json({ tipoServico: tipoServico })
	}

	async deletar(req, res) {
		let { id } = req.params

		let servico = await Servico.findOne({ where: { id } })

		await servico.destroy()

		return res.status(200).json({ servico: servico })
	}

	async buscarTodos(req, res) {
		let servicos = await Servico.findAll()

		return res.status(200).json({ servicos: servicos })
	}

	async buscar(req, res) {
		let { id } = req.params

		let servico = await Servico.findOne({ where: { id } })

		return res.status(200).json({ servico: servico })
	}
}

module.exports = new ServicoController()

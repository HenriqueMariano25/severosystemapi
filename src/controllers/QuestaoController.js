const { Questao, Gravidade, TipoVeiculo } = require("../models")

class QuestaoController {
	async cadastrar(req, res) {
		let { titulo, tipo_veiculo_id, situacao_observada, gravidade_id, componente } = req.body

		if (!titulo || !tipo_veiculo_id || !gravidade_id || !componente)
			return res.status(400).json({ message: "Dados obrigatorios faltando" })

		let questao = await Questao.create({
			titulo,
			tipo_veiculo_id,
			situacao_observada,
			gravidade_id,
			componente,
		})

		let questaoCriada = await Questao.findOne({
			include: [
				{ model: Gravidade, attributes: ["id", "descricao"] },
				{ model: TipoVeiculo, attributes: ["id", "descricao"] },
			],
			where: { id: questao.id },
		})

		return res.status(200).json({ questao: questaoCriada })
	}

	async editar(req, res) {
		let { titulo, tipo_veiculo_id, situacao_observada, gravidade_id, componente } = req.body
		let { id } = req.params

		await Questao.update({ titulo, tipo_veiculo_id, situacao_observada, gravidade_id, componente }, { where: { id }})

        let questao = await Questao.findOne({ where: { id }, attributes: { exclude: ['createdAt', 'deletedAt', 'updatedAt']}, include: [
            { model: Gravidade, attributes: ["id", "descricao"] },
            { model: TipoVeiculo, attributes: ["id", "descricao"] },
        ], })

		return res.status(200).json({ questao: questao })
	}

	async deletar(req, res) {
		let { id } = req.params

		let questao = await Questao.findOne({ where: { id } })

		await questao.destroy()

		return res.status(200).json({ questao: questao })
	}

	async buscarGravidades(req, res) {
		let gravidades = await Gravidade.findAll()

		return res.status(200).json({ gravidades: gravidades })
	}

	async buscarTodosPorTipoVeiculo(req, res) {
		let { tipo_veiculo_id } = req.params

		let questoes = await Questao.findAll({
			where: { tipo_veiculo_id: tipo_veiculo_id },
			include: [{ model: Gravidade }, { model: TipoVeiculo, attributes: ["id", "descricao"] }],
			attributes: { exclude: ["createdAt", "deletedAt", "updatedAt"] },
			order: [["titulo"]],
		})

		return res.status(200).json({ questoes: questoes })
	}

	async buscarTodos(req, res) {
		let questoes = await Questao.findAll({
			include: [
				{
					model: Gravidade,
					attributes: { exclude: ["createdAt", "deletedAt", "updatedAt"] },
				},
				{ model: TipoVeiculo },
			],
			attributes: { exclude: ["createdAt", "deletedAt", "updatedAt"] },
			order: [["titulo"]],
		})

		return res.status(200).json({ questoes: questoes })
	}

	async buscar(req, res) {
		let { id } = req.params

		let questao = await Questao.findOne({ where: { id } })

		return res.status(200).json({ questao: questao })
	}
}

module.exports = new QuestaoController()

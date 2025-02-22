const { Cliente } = require("../models")
const { Op } = require("sequelize")

class ClienteController {
	async cadastrar(req, res) {
		let {
			nome_razao_social,
			email,
			cpf_cnpj,
			telefone,
			cnh,
			rua,
			bairro,
			cidade,
			uf,
			cep,
			numero,
			complemento,
			tipo_cliente,
			valor_desconto,
		} = req.body

		if (!nome_razao_social) return res.status(400).json({ message: "Dados obrigatorios faltando" })

		try {
			let cliente = await Cliente.create({
				nome_razao_social,
				email,
				cpf_cnpj,
				telefone,
				cnh,
				rua,
				bairro,
				cidade,
				uf,
				cep,
				numero,
				complemento,
				tipo_cliente,
				valor_desconto,
			})
			return res.status(200).json({ cliente: cliente })
		} catch (error) {
			console.log(error)
			return res.status(400).json({ mensagem: "Erro ao cadastrar cliente" })
		}
	}

	async editar(req, res) {
		let {
			nome_razao_social,
			email,
			cpf_cnpj,
			telefone,
			cnh,
			rua,
			bairro,
			cidade,
			uf,
			cep,
			numero,
			complemento,
			tipo_cliente,
			valor_desconto,
		} = req.body
		let { id } = req.params

		const cliente = await Cliente.findOne({ where: { id } })

		await cliente.update({
			nome_razao_social,
			email,
			cpf_cnpj,
			telefone,
			cnh,
			rua,
			bairro,
			cidade,
			uf,
			cep,
			numero,
			complemento,
			tipo_cliente,
			valor_desconto,
		})

		return res.status(200).json({ cliente: cliente })
	}

	async deletar(req, res) {
		let { id } = req.params

		let cliente = await Cliente.findOne({ where: { id } })

		await cliente.destroy()

		return res.status(200).json({ cliente: cliente })
	}

	async buscarTodos(req, res) {
		let clientes = await Cliente.findAll({ order: ["nome_razao_social"] })

		return res.status(200).json({ clientes: clientes })
	}

	async buscar(req, res) {
		const { id } = req.params
		let cliente = await Cliente.findOne({ where: { id } })

		return res.status(200).json({ cliente: cliente })
	}

	async buscarNovoPadrao(req, res) {
		let { filtro } = req.query

		if (filtro) {
			filtro = {
				[Op.or]: [
					{ nome_razao_social: { [Op.iLike]: `%${filtro}%` } },
					{ telefone: { [Op.iLike]: `%${filtro}%` } },
				],
			}
		}

		try {
			let clientes = await Cliente.findAndCountAll({
				where: { ...filtro },
				order: ["nome_razao_social"],
			})

			return res.status(200).json({ falha: false, dados: { clientes } })
		} catch (error) {
			console.log(error)
			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async buscarSimplificado(req, res) {
		try {
			const { filtro } = req.query
			const clientes = await Cliente.findAll({
				where: { nome_razao_social: { [Op.iLike]: `%${filtro}%` } },
				order: ["nome_razao_social"],
				attributes: ["id", "nome_razao_social", "tipo_cliente", "valor_desconto"],
			})

			return res.status(200).json({ falha: false, dados: { clientes } })
		} catch (error) {
			return res.status(500).json({ falha: true, erro: error })
		}
	}
}

module.exports = new ClienteController()

const { Veiculo, TipoVeiculo, PecaVeiculo } = require("../models")
const { Op } = require("sequelize")

class VeiculoController {
	async cadastrar(req, res) {
		let {
			placa,
			ano,
			hodometro,
			uf,
			cidade,
			marca_modelo,
			chassi_bin,
			chassi_atual,
			motor_bin,
			motor_atual,
			cor_bin,
			cor_atual,
			combustivel,
			renavam,
		} = req.body

		if (
			!placa ||
			!ano ||
			!hodometro ||
			!uf ||
			!cidade ||
			!marca_modelo ||
			!chassi_bin ||
			!chassi_atual ||
			!motor_bin ||
			!motor_atual ||
			!cor_bin ||
			!cor_atual ||
			!combustivel ||
			!renavam
		)
			return res.status(400).json({ message: "Dados obrigatorios faltando" })

		let veiculo = await Veiculo.create({
			placa,
			ano,
			hodometro,
			uf,
			cidade,
			marca_modelo,
			chassi_bin,
			chassi_atual,
			motor_bin,
			motor_atual,
			cor_bin,
			cor_atual,
			combustivel,
			renavam,
		})

		return res.status(200).json({ veiculo: veiculo })
	}

	async editar(req, res) {
		let {
			placa,
			ano,
			hodometro,
			uf,
			cidade,
			marca_modelo,
			chassi_bin,
			chassi_atual,
			motor_bin,
			motor_atual,
			cor_bin,
			cor_atual,
			combustivel,
			renavam,
		} = req.body
		let { id } = req.params

		let veiculo = await Veiculo.findOne({ where: { id } })

		await veiculo.update({
			placa,
			ano,
			hodometro,
			uf,
			cidade,
			marca_modelo,
			chassi_bin,
			chassi_atual,
			motor_bin,
			motor_atual,
			cor_bin,
			cor_atual,
			combustivel,
			renavam,
		})

		return res.status(200).json({ veiculo: veiculo })
	}

	async deletar(req, res) {
		let { id } = req.params

		let veiculo = await Veiculo.findOne({ where: { id } })

		await veiculo.destroy()

		return res.status(200).json({ veiculo: veiculo })
	}

	async buscarTodos(req, res) {
		let veiculos = await Veiculo.findAll()

		return res.status(200).json({ veiculos: veiculos })
	}

	async buscarTipoVeiculo(req, res) {
		let tipoVeiculo = await TipoVeiculo.findAll({
			attributes: ["id", "descricao"],
			include: [{ model: PecaVeiculo, as: "PecaVeiculo", attributes: ["id", "descricao"] }],
			order: ["descricao"],
		})

		return res.status(200).json({ tipoVeiculo: tipoVeiculo })
	}

	async buscar(req, res) {
		let { id } = req.params

		let veiculo = await Veiculo.findOne({ where: { id } })

		return res.status(200).json({ veiculo: veiculo })
	}

	//TIPO VEICULO

	async cadastrarTipoVeiculo(req, res) {
		let { descricao } = req.body
		try {
			let [tipoVeiculo, criado] = await TipoVeiculo.findOrCreate({
				where: {
					descricao: { [Op.iLike]: descricao },
				},
				defaults: {
					descricao: descricao,
				},
			})
			if (!criado) {
				return res.status(200).json({
					falha: true,
					dados: { mensagem: "Já existe um tipo de veículo com essa descrição!" },
				})
			}
			return res.status(200).json({ falha: false, dados: { tipoVeiculo } })
		} catch (erro) {
			return res.status(400).json({ erro: erro })
		}
	}

	async editarTipoVeiculo(req, res) {
		let { id, descricao, pecas } = req.body

		try {
			let outroTipoVeiculoEncontrado = await TipoVeiculo.findOne({
				where: { descricao: { [Op.iLike]: descricao }, id: { [Op.not]: id } },
			})

			if (outroTipoVeiculoEncontrado) {
				return res.status(200).json({
					falha: true,
					dados: { mensagem: "Já existe um tipo de veículo com essa descrição!" },
				})
			}

			await TipoVeiculo.update({ descricao }, { where: { id } })

			let pecasEncotradas = await PecaVeiculo.findAll({ where: { tipo_veiculo_id: id } }).then(
				(resp) => resp.map((o) => o.descricao),
			)

			for(let peca of pecasEncotradas){
				if(!pecas.some(o => o.descricao === peca)) {
					await PecaVeiculo.destroy({ where: { descricao: peca, tipo_veiculo_id: id }})
				}
			}

			for(let peca of pecas){

				if(!pecasEncotradas.includes(peca.descricao)){
					await PecaVeiculo.create({ descricao: peca.descricao, tipo_veiculo_id: id, tela_inicial: peca.tela_inicial })
				}
			}
			return res.status(200).json({})
		} catch (erro) {
			console.log(erro)

			return res.status(400).json({ erro: erro })
		}
	}

	async buscarPecasTipoVeiculo(req, res){
		let { tipo_veiculo_id } = req.query

		try{
			let pecas = await PecaVeiculo.findAll({ where: { tipo_veiculo_id: tipo_veiculo_id }, attributes: ['id','descricao', 'tela_inicial'] })

		  return res.status(200).json({ falha: false, dados: { pecas }})
		}catch(erro){
		  console.log(erro)
		  return res.status(400).json({erro: erro})
		}
	}
}

module.exports = new VeiculoController()

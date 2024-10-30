let {
	ConfiguracaoLeilao,
	Usuario,
	Cliente,
	Veiculo,
	Laudo,
	TipoVeiculo,
	StatusLaudo,
	TipoServico,
	Questao,
	Gravidade,
	ImagemLaudo, sequelize, CaixaLancamento, CaixaFormaLanc,
} = require("../models")
const { Op } = require("sequelize")

class LeilaoController {
	async cadastrarEditarConfiguracao(req, res) {
		let { cliente, perito } = req.body

		try {
			let configuracaoEncontrada = await ConfiguracaoLeilao.findOne()
			let configuracao

			if (!configuracaoEncontrada) {
				let configuracaoCriada = await ConfiguracaoLeilao.create({
					cliente_leilao_id: cliente.id,
					perito_id: perito.id,
				})

				configuracao = await ConfiguracaoLeilao.findOne({
					where: { id: configuracaoCriada.id },
					include: [
						{ model: Usuario, attributes: ["nome", "id"] },
						{ model: Cliente, attributes: ["nome_razao_social", "id", "cpf_cnpj"] },
					],
					attributes: ["cliente_leilao_id", "id", "perito_id"],
				})
			} else {
				await ConfiguracaoLeilao.update(
					{
						cliente_leilao_id: cliente.id,
						perito_id: perito.id,
					},
					{ where: { id: configuracaoEncontrada.id } },
				)
				configuracao = await ConfiguracaoLeilao.findOne({
					where: { id: configuracaoEncontrada.id },
					include: [
						{ model: Usuario, attributes: ["nome", "id"] },
						{ model: Cliente, attributes: ["nome_razao_social", "id", "cpf_cnpj"] },
					],
					attributes: ["cliente_leilao_id", "id", "perito_id"],
				})
			}

			return res.status(200).json({ configuracao: configuracao })
		} catch (error) {
			console.log(error)

			return res.status(500).json({ menssagem: error })
		}
	}

	async buscarConfiguracoes(req, res) {
		try {
			let configuracao = await ConfiguracaoLeilao.findOne({
				include: [
					{ model: Usuario, attributes: ["nome", "id"] },
					{ model: Cliente, attributes: ["nome_razao_social", "cpf_cnpj", "id"] },
				],
				attributes: ["cliente_leilao_id", "id", "perito_id"],
			})

			if (!configuracao) {
				return res.status(204).json({ mensagem: "Configuração não cadastrada" })
			} else {
				return res.status(200).json({ configuracao: configuracao })
			}
		} catch (error) {
			console.log(error)
			return res.status(500).send({ error })
		}
	}

	async buscarLaudoLeilao(req, res) {
		try {
			let laudos = await Laudo.findAll({
				where: { tipo_servico_id: 3 },
				include: [
					{
						model: Veiculo,
						include: [{ model: TipoVeiculo, attributes: ["descricao"] }],
						attributes: { exclude: ["createdAt", "updatedAt"] },
					},
					{
						model: Cliente,
						attributes: { exclude: ["createdAt", "updatedAt"] },
					},
					{
						model: StatusLaudo,
						attributes: ["id", "descricao"],
					},
					{
						model: Usuario,
						as: "perito",
						attributes: ["nome"],
					},
					{
						model: Usuario,
						as: "perito_auxiliar",
						attributes: ["nome"],
					},
					{
						model: Usuario,
						as: "digitador",
						attributes: ["nome"],
					},
					{
						model: TipoServico,
						attributes: ["descricao"],
					},
				],
				order: [["id", "DESC"]],
			})

			return res.status(200).json({ laudos: laudos })
		} catch (error) {
			console.log(error)

			return res.status(500).json({ messagem: error })
		}
	}

	async buscarLaudoLeilaoNovoPadrao(req, res) {
		let { page, size, busca } = req.query
		busca = JSON.parse(busca) || {}

		try {
			const { rows: laudos, count: total } = await Laudo.findAndCountAll({
				where: {
					tipo_servico_id: 3,
					[Op.or]: [
						{ id: busca.texto.match(/\d+/g) != null ? busca.texto.match(/\d+/g)[0] : null },
						{ "$Veiculo.placa$": { [Op.iLike]: "%" + busca.texto + "%" } },
						{ "$Veiculo.marca_modelo$": { [Op.iLike]: "%" + busca.texto + "%" } },
						{ "$Veiculo.chassi_bin$": { [Op.iLike]: "%" + busca.texto + "%" } },
						{ "$Veiculo.chassi_atual$": { [Op.iLike]: "%" + busca.texto + "%" } },
						{ "$Cliente.nome_razao_social$": { [Op.iLike]: "%" + busca.texto + "%" } },
						{ "$perito.nome$": { [Op.iLike]: "%" + busca.texto + "%" } },
						{ "$perito_auxiliar.nome$": { [Op.iLike]: "%" + busca.texto + "%" } },
						{ "$digitador.nome$": { [Op.iLike]: "%" + busca.texto + "%" } },
					],
					[Op.and]: [
						busca.data_final != null && busca.data_final != ""
							? {
									createdAt: {
										[Op.lte]: dayjs(busca.data_final).add(1, "day").format("YYYY-MM-DD"),
									},
							  }
							: "",
						busca.data_inicial != null && busca.data_inicial != ""
							? { createdAt: { [Op.gte]: busca.data_inicial } }
							: "",
					],
				},
				limit: size,
				offset: page * size,
				include: [
					{
						model: Veiculo,
						include: [{ model: TipoVeiculo, attributes: ["descricao"] }],
						attributes: { exclude: ["createdAt", "updatedAt"] },
					},
					{
						model: Cliente,
						attributes: { exclude: ["createdAt", "updatedAt"] },
					},
					{
						model: StatusLaudo,
						attributes: ["id", "descricao"],
					},
					{
						model: Usuario,
						as: "perito",
						attributes: ["nome"],
					},
					{
						model: Usuario,
						as: "perito_auxiliar",
						attributes: ["nome"],
					},
					{
						model: Usuario,
						as: "digitador",
						attributes: ["nome"],
					},
					{
						model: TipoServico,
						attributes: ["descricao"],
					},
				],
				order: [["id", "DESC"]],
			})
			return res.status(200).json({ falha: false, dados: { laudos, total } })
		} catch (error) {
			console.log(error)
			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async cadastrarLaudoLeilao(req, res) {
		let { lancamentoCaixa } = req.body

		let {
			tipo_veiculo_id,
			placa,
			ano,
			cidade,
			marca_modelo,
			chassi_bin,
			chassi_atual,
			motor_bin,
			motor_atual,
			grv,
			cor_bin,
			cor_atual,
			combustivel,
			cambio_bin,
			cambio_atual,
		} = req.body.veiculo
		try {
			let veiculo_id

			let { id: cliente_id } = req.body.cliente

			const transacao = await sequelize.transaction()

			let veiculoCriado = await Veiculo.create({
				placa,
				ano,
				cidade,
				grv,
				marca_modelo,
				chassi_bin,
				chassi_atual,
				motor_bin,
				motor_atual,
				cor_bin,
				cor_atual,
				combustivel,
				cambio_bin,
				cambio_atual,
				tipo_veiculo_id,
			}, { transaction: transacao})

			veiculo_id = veiculoCriado.id

			let laudoCriado = await Laudo.create({
				cliente_id,
				veiculo_id,
				tipo_servico_id: 3,
				status_laudo_id: 1,
			}, { transaction: transacao})

			if(lancamentoCaixa.lancamento){
				lancamentoCaixa.lancamento.descricao = lancamentoCaixa.lancamento.descricao.replace('*000000000*', ("000000000" + laudoCriado.id).slice(-9))
				lancamentoCaixa.lancamento.laudo_id = laudoCriado.id

				const dados = await CaixaLancamento.create(lancamentoCaixa.lancamento, { transaction: transacao})

				if (lancamentoCaixa?.pagamento.length) {
					for (let pag of lancamentoCaixa.pagamento) {
						pag.lancamento_id = dados.id

						await CaixaFormaLanc.create(pag, { transaction: transacao})
					}
				}
			}

			await transacao.commit()

			let laudo = await Laudo.findOne({
				where: { id: laudoCriado.id },
				include: [
					{ model: Cliente },
					{ model: Questao, include: { model: Gravidade, attributes: ["cor", "icone"] } },
					{ model: Usuario, as: "perito" },
					{
						model: Usuario,
						as: "perito_auxiliar",
					},
					{
						model: Usuario,
						as: "digitador",
						attributes: ["nome", "id"],
					},
					{
						model: ImagemLaudo,
						attributes: ["peca_veiculo", "url", "id"],
					},
					{
						model: Veiculo,
						include: { model: TipoVeiculo, attributes: ["descricao"] },
					},
					{
						model: StatusLaudo,
						attributes: ["id", "descricao"],
					},
					{
						model: TipoServico,
						attributes: ["descricao"],
					},
				],
			})

			return res.status(200).json({ laudo: laudo, veiculo: veiculoCriado })
		} catch (e) {
			console.log(e)
			return res.status(500).json({ mensagem: "Erro ao cadastrar laudo" })
		}
	}

	async editarLaudoLeilao(req, res) {
		let { cliente, veiculo, resumo } = req.body
		let { id: laudo_id } = req.params

		try {
			let {
				placa,
				ano,
				cidade,
				grv,
				marca_modelo,
				chassi_bin,
				chassi_atual,
				motor_bin,
				motor_atual,
				cor_bin,
				cor_atual,
				combustivel,
				cambio_bin,
				cambio_atual,
			} = veiculo

			let { id: veiculo_id } = await Veiculo.update(
				{
					placa,
					ano,
					cidade,
					grv,
					marca_modelo,
					chassi_bin,
					chassi_atual,
					motor_bin,
					motor_atual,
					cor_bin,
					cor_atual,
					combustivel,
					cambio_bin,
					cambio_atual,
				},
				{ where: { id: veiculo.id } },
			)

			let {
				situacao,
				observacao,
				perito: perito_id,
				perito_auxiliar: perito_auxiliar_id,
				digitador: digitador_id,
			} = resumo

			let { id: cliente_id } = cliente

			let laudo
			await Laudo.update(
				{
					cliente_id,
					veiculo_id,
					situacao,
					observacao,
					perito_id,
					perito_auxiliar_id,
					digitador_id,
				},
				{
					returning: true,
					where: {
						id: laudo_id,
					},
				},
			).then((result) => {
				laudo = result[1]
			})
			return await res.status(200).json({ laudo: laudo })
		} catch (e) {
			console.log(e)
			return res.status(400).json({ mensagem: "Erro ao editar laudo" })
		}
	}
}

module.exports = new LeilaoController()

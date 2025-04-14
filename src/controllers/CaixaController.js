const {
	CaixaDia,
	CaixaLancamento,
	CaixaCategoria,
	CaixaFormaTipo,
	CaixaFormaLanc,
	Usuario,
	CaixaQuitacao,
	Veiculo,
	Laudo,
	TipoServico,
	Cliente,
} = require("../models")
const { Op, sequelize, Sequelize } = require("sequelize")
const dayjs = require("dayjs")
const redis = require("../lib/redis")

async function existeCaixaAberto(payload) {
	const dados = await CaixaDia.findAll({
		where: {
			status_caixa: "Aberto",
			data_abertura: payload.data_abertura,
			usuario_id: payload.usuario_id,
		},
		order: ["id"],
	})
	return dados.length
}

async function vincularLancamentoAoLaudo(lancamento) {
	const regex = /Laudo: (.*?) Tipo/i
	const idLaudo = lancamento?.descricao?.match(regex)
	if (idLaudo) {
		const idLaudoFormatado = idLaudo[1].replace(/^0+/, "")
		let laudoEncontrado = await Laudo.findOne({
			where: { id: idLaudoFormatado },
			attributes: ["id"],
		})
		if (laudoEncontrado) {
			await CaixaLancamento.update(
				{ laudo_id: laudoEncontrado.id },
				{ where: { id: lancamento.id } },
			)
		}
	}
}

class CaixaController {
	async listarCaixaDia(req, res) {
		try {
			let filtro = JSON.parse(req.query.filtro) || {}

			const dados = await CaixaDia.findAll({
				include: [
					{
						model: CaixaLancamento,
						as: "lancamentos",
						attributes: { exclude: ["createdAt", "updatedAt"] },
						include: [
							{ model: CaixaCategoria, as: "categoria", attributes: ["descricao", "id"] },
							{
								model: CaixaFormaLanc,
								as: "pagamento",
								attributes: ["forma_id", "id"],
								include: [{ model: CaixaFormaTipo, as: "tipo", attributes: ["descricao"] }],
							},
						],
					},
					{ model: Usuario, attributes: ["nome"] },
				],
				where: filtro,
				order: ["id"],
			})
			return res.status(200).json({ falha: false, dados: dados })
		} catch (error) {
			console.log(error)

			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async listarCaixaDiaPorDia(req, res) {
		try {
			let parametros = JSON.parse(req.query.filtro) || {}
			let filtro
			let { data_inicial, data_final, busca } = parametros

			if (parametros.busca != null && parametros.busca != "") {
				filtro = {
					[Op.or]: [
						{ "$Usuario.nome$": { [Op.iLike]: `%${busca}%` } },
						{ status_caixa: { [Op.iLike]: `%${busca}%` } },
					],
				}
			}

			const dados = await CaixaDia.findAll({
				include: [
					{
						model: CaixaLancamento,
						as: "lancamentos",
						attributes: { exclude: ["createdAt", "updatedAt"] },
						include: [
							{ model: CaixaCategoria, as: "categoria", attributes: ["descricao", "id"] },
							{
								model: CaixaFormaLanc,
								as: "pagamento",
								attributes: ["forma_id", "id"],
								include: [{ model: CaixaFormaTipo, as: "tipo", attributes: ["descricao"] }],
							},
						],
					},
					{ model: Usuario, attributes: ["nome"] },
				],
				where: {
					data_abertura: {
						[Op.between]: [data_inicial, data_final],
					},
					...filtro,
				},
				order: ["id"],
			})

			return res.status(200).json({ falha: false, dados: dados })
		} catch (error) {
			console.log(error)

			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async listarCaixaDiaExtrato(req, res) {
		try {
			let parametros = JSON.parse(req.query.filtro) || {}
			let filtro

			let { data_inicial, data_final, busca } = parametros

			const dataInicalFormatada = data_inicial.replace("T", " ")
			const dataFinalFormatada = data_final.replace("T", " ")


			if (parametros.opcaoRelatorio === "faturado")
				filtro = { "$pagamento.tipo.descricao$": "Faturado" }

			if (parametros.opcaoRelatorio === "quitados")
				filtro = { "$pagamento.tipo.descricao$": { [Op.not]: "Faturado" } }

			if(parametros.opcaoRelatorio === "todos" && parametros['$pagamento.forma_id$']){
				filtro = {'$pagamento.forma_id$': parametros['$pagamento.forma_id$'] }
			}

			if (parametros.busca != null && parametros.busca != "") {
				filtro = {
					...filtro,
					[Op.or]: [
						{ "$caixa.Usuario.nome$": { [Op.iLike]: `%${busca}%` } },
						{ "$categoria.descricao$": { [Op.iLike]: `%${busca}%` } },
						{ descricao: { [Op.iLike]: `%${busca}%` } },
					],
				}
			}

			const dados = await CaixaLancamento.findAll({
				include: [
					{
						model: Laudo,
						as: "laudo",
						include: [
							{ model: Veiculo, attributes: ["marca_modelo"] },
							{ model: TipoServico, attributes: ["descricao"] },
						],
						attributes: ["id"],
					},
					{ model: TipoServico, as: "tipoServico" },
					{ model: Cliente, as: "cliente" },
					{
						model: CaixaDia,
						as: "caixa",
						include: [{ model: Usuario, attributes: ["nome"] }],
					},
					{ model: CaixaCategoria, as: "categoria", attributes: ["descricao"] },
					{
						model: CaixaFormaLanc,
						as: "pagamento",
						attributes: { exclude: ["lancamento_id", "deletedAt"] },
						include: [{ model: CaixaFormaTipo, as: "tipo", attributes: ["descricao", "id"] }],
					},
					{ model: CaixaQuitacao, attributes: ["data"], as: "CaixaQuitacao" },
				],
				where: {
					...filtro,
					created_at: {
						[Op.between]: [dataInicalFormatada, dataFinalFormatada],
					},
				},
			})

			for (let lancamento of dados) {
				if (lancamento.laudo_id === null) {
					await vincularLancamentoAoLaudo(lancamento)
				}
			}

			return res.status(200).json({ falha: false, dados: dados })
		} catch (error) {
			console.log(error)

			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async listarCaixaDiaExtratoResumido(req, res) {
		try {
			let parametros = JSON.parse(req.query.filtro) || {}
			let filtro

			let { data_inicial, data_final, busca } = parametros

			const dataInicalFormatada = data_inicial.replace("T", " ")
			const dataFinalFormatada = data_final.replace("T", " ")

			if (parametros.opcaoRelatorio === "faturado")
				filtro = { "$pagamento.tipo.descricao$": "Faturado" }

			if (parametros.opcaoRelatorio === "quitados")
				filtro = { "$pagamento.tipo.descricao$": { [Op.not]: "Faturado" } }

			if (parametros.busca != null && parametros.busca != "") {
				filtro = {
					...filtro,
					[Op.or]: [
						{ "$caixa.Usuario.nome$": { [Op.iLike]: `%${busca}%` } },
						{ "$categoria.descricao$": { [Op.iLike]: `%${busca}%` } },
						{ descricao: { [Op.iLike]: `%${busca}%` } },
					],
				}
			}

			const dados = await CaixaLancamento.findAll({
				include: [
					{
						model: Laudo,
						as: "laudo",
						include: [
							{ model: Veiculo, attributes: ["marca_modelo"] },
							{ model: TipoServico, attributes: ["descricao"] },
						],
						attributes: ["id"],
					},
					{
						model: CaixaDia,
						as: "caixa",
						include: [{ model: Usuario, attributes: ["nome"] }],
					},
					{ model: TipoServico, as: "tipoServico" },
					{ model: Cliente, as: "cliente" },
					{ model: CaixaCategoria, as: "categoria", attributes: ["descricao"] },
					{
						model: CaixaFormaLanc,
						as: "pagamento",
						attributes: { exclude: ["lancamento_id", "deletedAt"] },
						include: [{ model: CaixaFormaTipo, as: "tipo", attributes: ["descricao", "id"] }],
					},
					{ model: CaixaQuitacao, attributes: ["data"], as: "CaixaQuitacao" },
				],
				where: {
					...filtro,
					created_at: {
						[Op.between]: [dataInicalFormatada, dataFinalFormatada],
					},
				},
			})

			const regex = /PLACA: (.*?) CLIENTE:/i
			const regexTipoLaudo = /Tipo Laudo: (.*?) Placa:/i

			let novosDados = [...dados]

			for (let dado of novosDados) {
				let placa = dado.descricao?.match(regex)
				let tipoLaudo = dado.descricao?.match(regexTipoLaudo)

				if (placa) {
					let veiculo = await Veiculo.findOne({
						where: { placa: placa[1] },
						attributes: ["id", "marca_modelo"],
					})

					if (veiculo) {
						dado.dataValues["modelo"] = veiculo.marca_modelo
						dado.dataValues["placa"] = placa[1]
					}
				}

				if (tipoLaudo) {
					dado.dataValues["tipoLaudo"] = tipoLaudo[1]
				}
			}

			return res.status(200).json({ falha: false, dados: novosDados })
		} catch (error) {
			console.log(error)

			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async listarCaixaDiaCliente(req, res) {
		try {
			let parametros = JSON.parse(req.query.filtro) || {}
			let filtro

			let { data_inicial, data_final, busca } = parametros

			const dataInicalFormatada = data_inicial.replace("T", " ")
			const dataFinalFormatada = data_final.replace("T", " ")

			if (parametros.opcaoRelatorio === "faturado")
				filtro = { "$pagamento.tipo.descricao$": "Faturado" }

			if (parametros.opcaoRelatorio === "quitados")
				filtro = { "$pagamento.tipo.descricao$": { [Op.not]: "Faturado" } }

			if (parametros.busca != null && parametros.busca != "") {
				filtro = {
					...filtro,
					[Op.or]: [
						{ "$caixa.Usuario.nome$": { [Op.iLike]: `%${busca}%` } },
						{ "$categoria.descricao$": { [Op.iLike]: `%${busca}%` } },
						{ descricao: { [Op.iLike]: `%${busca}%` } },
					],
				}
			}

			const dados = await CaixaLancamento.findAll({
				include: [
					{
						model: Laudo,
						as: "laudo",
						include: [
							{ model: Veiculo, attributes: ["marca_modelo"] },
							{ model: TipoServico, attributes: ["descricao"] },
						],
						attributes: ["id"],
					},
					{ model: TipoServico, as: "tipoServico" },
					{ model: Cliente, as: "cliente" },
					{
						model: CaixaDia,
						as: "caixa",
						include: [{ model: Usuario, attributes: ["nome"] }],
					},
					{ model: CaixaCategoria, as: "categoria", attributes: ["descricao"] },
					{
						model: CaixaFormaLanc,
						as: "pagamento",
						attributes: { exclude: ["lancamento_id", "deletedAt"] },
						include: [{ model: CaixaFormaTipo, as: "tipo", attributes: ["descricao", "id"] }],
					},
					{ model: CaixaQuitacao, attributes: ["data"], as: "CaixaQuitacao" },
				],
				where: {
					...filtro,
					created_at: {
						[Op.between]: [dataInicalFormatada, dataFinalFormatada],
					},
				},
				order: ["created_at"],
			})

			return res.status(200).json({ falha: false, dados: dados })
		} catch (error) {
			console.log(error)

			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async listarCaixaDiaRelatorio(req, res) {
		try {
			let filtro = JSON.parse(req.query.filtro) || {}

			const dados = await CaixaDia.findAll({
				// group: ['CaixaDia.id', 'lancamentos.id', 'lancamentos.categoria.descricao', 'lancamentos.categoria.id', 'Usuario.id'],
				attributes: { exclude: ["deletedAt", "updatedAt", "createdAt"] },
				include: [
					{
						model: CaixaLancamento,
						as: "lancamentos",
						attributes: { exclude: ["deletedAt", "updatedAt"] },
						include: [
							{
								model: CaixaCategoria,
								as: "categoria",
								attributes: ["descricao", "id"],
							},
							{
								model: TipoServico,
								as: "tipoServico",
							},
							{
								model: Cliente,
								as: "cliente",
							},
							{
								model: Laudo,
								as: "laudo",
								attributes: ["id"],
								include: [
									{
										model: TipoServico,
										attributes: ["descricao"],
									},
								],
							},
							{
								model: CaixaFormaLanc,
								as: "pagamento",
								attributes: ["forma_id"],
								include: [{ model: CaixaFormaTipo, as: "tipo", attributes: ["descricao"] }],
							},
						],
					},

					{ model: Usuario, attributes: ["nome"] },
				],
				where: filtro,
				order: ["id"],
			})

			let resumo = await CaixaLancamento.findAll({
				where: { caixadia_id: filtro.id },
				attributes: [
					[Sequelize.fn("SUM", Sequelize.cast(Sequelize.col("pagamento.valor"), "float")), "total"],
				],
				include: [
					{
						model: CaixaFormaLanc,
						as: "pagamento",
						attributes: ["forma_id"],
						include: [{ model: CaixaFormaTipo, as: "tipo", attributes: ["descricao"] }],
					},
				],
				group: ["pagamento.forma_id", "pagamento.tipo.descricao", "pagamento.tipo.id"],
				raw: true,
			})

			return res.status(200).json({ falha: false, dados: dados })
		} catch (error) {
			console.log(error)

			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async abrirUmCaixaDia(req, res) {
		try {
			const dados = await CaixaDia.findOne({
				include: [
					{
						model: CaixaLancamento,
						as: "lancamentos",
						attributes: {
							exclude: ["caixadia_id", "createdAt", "updatedAt", "deletedAt"],
						},
						include: [
							{
								model: CaixaCategoria,
								as: "categoria",
								attributes: ["descricao"],
							},
						],
					},
				],
				where: { id: req.params.id },
			})
			return res.status(200).json({ falha: false, dados: dados })
		} catch (error) {
			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async criarCaixaDia(req, res) {
		try {
			const dataAtual = dayjs(new Date()).format("YYYY-MM-DD")
			const payload = { ...req.body, data_abertura: dataAtual }

			if (await existeCaixaAberto(payload)) {
				return res.status(200).json({
					falha: true,
					erro: "Já existe um caixa desse usuário nesta data!",
				})
			}
			const dados = await CaixaDia.create(payload)
			return res.status(200).json({ falha: false, dados: dados })
		} catch (error) {
			console.log(error)

			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async alterarCaixaDia(req, res) {
		try {
			const dados = await CaixaDia.update(req.body, {
				where: { id: req.params.id },
			})
			return res.status(200).json({ falha: false, dados: dados })
		} catch (error) {
			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async deletarCaixaDia(req, res) {
		try {
			//Se o parametro id for 0, será deletados todos
			const dados = await CaixaDia.destroy({
				where: req.params.id == 0 ? {} : { id: req.params.id },
			})
			return res.status(200).json({ falha: false, dados: dados })
		} catch (error) {
			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async verificarCaixaAberto(req, res) {
		let { usuario_id } = req.params
		let data_abertura = dayjs().format("YYYY-MM-DD")

		try {
			const dados = await CaixaDia.findOne({
				where: {
					usuario_id,
				},
				include: [
					{
						model: CaixaLancamento,
						as: "lancamentos",
						attributes: ["descricao", "id", "valor", "created_at"],
						include: [
							{ model: CaixaCategoria, as: "categoria" },
							{
								model: CaixaFormaLanc,
								as: "pagamento",
								attributes: ["forma_id", "id"],
								include: [{ model: CaixaFormaTipo, as: "tipo", attributes: ["descricao"] }],
							},
						],
					},
				],
				order: [
					["createdAt", "DESC"],
					[{ model: CaixaLancamento, as: "lancamentos" }, "createdAt", "DESC"],
				],
			})

			return res.status(200).json({ falha: false, dados: dados })
		} catch (error) {
			console.log(error)

			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async fecharCaixa(req, res) {
		let { valor_fechamento, valor_total, id, usuario_id } = req.body

		try {
			let data_fechamento = dayjs().format("YYYY-MM-DD")
			await CaixaDia.update(
				{ valor_fechamento, data_fechamento, valor_total, status_caixa: "Fechado" },
				{ where: { id } },
			)

			let caixaAberto = await CaixaDia.findOne({
				where: { usuario_id, status_caixa: "Aberto" },
				attributes: ["id"],
				order: ["id"],
			})

			return res.status(200).json({ falha: false, dados: { caixa: caixaAberto } })
		} catch (error) {
			console.log(error)
			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async buscarCaixaDiaRelatorio(req, res) {
		try {
			let parametros = JSON.parse(req.query.filtros) || {}
			let filtros
			let { data_inicial, data_final, busca } = parametros

			if (parametros.busca != null && parametros.busca != "") {
				filtros = {
					[Op.or]: [
						{ "$Usuario.nome$": { [Op.iLike]: `%${busca}%` } },
						{ status_caixa: { [Op.iLike]: `%${busca}%` } },
					],
				}
			}

			const { rows: caixas, count: total } = await CaixaDia.findAndCountAll({
				include: [
					{
						model: CaixaLancamento,
						as: "lancamentos",
						attributes: { exclude: ["createdAt", "updatedAt"] },
						include: [
							{ model: CaixaCategoria, as: "categoria", attributes: ["descricao", "id"] },
							{
								model: CaixaFormaLanc,
								as: "pagamento",
								attributes: ["forma_id", "id"],
								include: [{ model: CaixaFormaTipo, as: "tipo", attributes: ["descricao"] }],
							},
						],
					},
					{ model: Usuario, attributes: ["nome"] },
				],
				where: {
					data_abertura: {
						[Op.between]: [data_inicial, data_final],
					},
					...filtros,
				},
				order: ["id"],
			})

			return res.status(200).json({ falha: false, dados: { caixas, total } })
		} catch (error) {
			console.log(error)

			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async buscarCaixaAtual(req, res) {
		let { usuario_id } = req.query

		try {
			let caixa = await CaixaDia.findOne({
				where: { usuario_id, status_caixa: "Aberto" },
				order: ["id"],
			})

			return res.status(200).json({ falha: false, dados: { caixa } })
		} catch (error) {
			console.log(error)
			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async buscarCaixaAtualNovoPadrao(req, res) {
		let { usuario_id } = req.query

		try {
			let caixa = await CaixaDia.findOne({
				where: { usuario_id, status_caixa: "Aberto" },
				include: [
					{
						model: CaixaLancamento,
						as: "lancamentos",
						order: [["created_at", "ASC"]],
						include: [
							{ model: TipoServico, as: "tipoServico", attributes: ["id", "descricao", "valor"] },
							{ model: Cliente, as: "cliente" },
							{ model: CaixaCategoria, as: "categoria" },
							{
								model: CaixaFormaLanc,
								as: "pagamento",
								include: [{ model: CaixaFormaTipo, as: "tipo" }],
							},
							{
								model: Laudo,
								as: "laudo",
								attributes: ["id"],
								include: [{ model: TipoServico, attributes: ["descricao"] }],
							},
						],
					},
				],
				order: [["id", "DESC"]],
			})

			if (!caixa) {
				caixa = await CaixaDia.findOne({
					where: { usuario_id, data_fechamento: dayjs().format("YYYY-MM-DD") },
					include: [
						{
							model: CaixaLancamento,
							as: "lancamentos",
							include: [
								{ model: CaixaCategoria, as: "categoria" },
								{
									model: CaixaFormaLanc,
									as: "pagamento",
									include: [{ model: CaixaFormaTipo, as: "tipo" }],
								},
								{
									model: Laudo,
									as: "laudo",
									attributes: ["id"],
									include: [{ model: TipoServico, attributes: ["descricao"] }],
								},
							],
						},
					],
				})
			}

			return res.status(200).json({ falha: false, dados: { caixa } })
		} catch (error) {
			console.log(error)
			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async buscarCaixa(req, res) {
		let { id } = req.params

		try {
			let caixa = await CaixaDia.findOne({
				where: { id },
				include: [
					{
						model: CaixaLancamento,
						as: "lancamentos",
						include: [
							{ model: CaixaCategoria, as: "categoria" },
							{
								model: CaixaFormaLanc,
								as: "pagamento",
								include: [{ model: CaixaFormaTipo, as: "tipo" }],
							},
							{
								model: TipoServico,
								as: "tipoServico",
							},
							{
								model: Cliente,
								as: "cliente",
							},
							{
								model: Laudo,
								as: "laudo",
								attributes: ["id"],
								include: [{ model: TipoServico, attributes: ["descricao"] }],
							},
						],
					},
				],
				order: ["id"],
			})

			return res.status(200).json({ falha: false, dados: { caixa } })
		} catch (error) {
			console.log(error)
			return res.status(500).json({ falha: true, erro: error })
		}
	}

	// -------  Categorias ----------  //

	async listarCategoria(req, res) {
		let filtro = JSON.parse(req.query.filtro) || {}

		try {
			const dados = await CaixaCategoria.findAll({
				where: { ...filtro },
				order: ["descricao"],
			})
			return res.status(200).json({ falha: false, dados: dados })
		} catch (error) {
			console.log(error)

			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async buscarCategorias(req, res) {
		let { tipo } = req.query

		try {
			let categoriasBuscadas = await redis.get("CaixaCategoria")
			if (!categoriasBuscadas) {
				categoriasBuscadas = await CaixaCategoria.findAll({
					order: ["descricao"],
					attributes: ["id", "descricao", "tipo"],
				})
				await redis.set("CaixaCategoria", categoriasBuscadas, 1800)
			}

			if (tipo) {
				categoriasBuscadas = categoriasBuscadas.filter((o) => o.ftipo === tipo)
			}

			return res.status(200).json({ falha: false, dados: { categorias: categoriasBuscadas } })
		} catch (error) {
			console.log(error)
			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async listarCategoriaEntrada(req, res) {
		try {
			const dados = await CaixaCategoria.findAll({
				where: { tipo: "Entrada" },
				order: ["descricao"],
			})
			return res.status(200).json({ falha: false, dados: dados })
		} catch (error) {
			console.log(error)

			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async listarCategoriaSaida(req, res) {
		try {
			const dados = await CaixaCategoria.findAll({
				where: { tipo: "Saída" },
				order: ["descricao"],
			})
			return res.status(200).json({ falha: false, dados: dados })
		} catch (error) {
			console.log(error)

			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async criarCategoria(req, res) {
		try {
			const payload = req.body
			const dados = await CaixaCategoria.create(payload)
			return res.status(200).json({ falha: false, dados: dados })
		} catch (error) {
			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async alterarCategoria(req, res) {
		try {
			const dados = await CaixaCategoria.update(req.body, {
				where: { id: req.params.id },
			})
			return res.status(200).json({ falha: false, dados: dados })
		} catch (error) {
			return res.status(500).json({ falha: true, erro: error })
		}
	}

	// -------  Lancamentos ----------  //
	async listarLancamento(req, res) {
		try {
			let filtro = req.body || {}
			const dados = await CaixaLancamento.findAll({
				...filtro,
				include: [
					{
						model: CaixaDia,
						as: "caixa",
						attributes: { exclude: ["createdAt", "updatedAt"] },
					},
					{ model: CaixaCategoria, as: "categoria", attributes: ["descricao"] },
				],
				order: [["createdAt", "DESC"]],
			})
			return res.status(200).json({ falha: false, dados: dados })
		} catch (error) {
			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async abrirUmLancamento(req, res) {
		try {
			const filtro = req.body || {}
			const dados = await CaixaLancamento.findOne({
				...filtro,
				include: [
					{ model: CaixaCategoria, as: "categoria", attributes: ["descricao"] },
					{
						model: CaixaFormaLanc,
						as: "pagamento",
						attributes: { exclude: ["lancamento_id", "deletedAt"] },
						include: [{ model: CaixaFormaTipo, as: "tipo", attributes: ["descricao"] }],
					},
				],
			})

			return res.status(200).json({ falha: false, dados: dados })
		} catch (error) {
			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async criarLancamento(req, res) {
		try {
			let { lancamento, pagamento } = req.body

			const dados = await CaixaLancamento.create(lancamento)

			if (pagamento.length) {
				for (let pag of pagamento) {
					pag.lancamento_id = dados.id

					await CaixaFormaLanc.create(pag)
				}
			}

			let lancamentoCriado = await CaixaLancamento.findOne({
				where: { id: dados.id },
				include: [
					{ model: CaixaCategoria, as: "categoria" },
					{ model: TipoServico, as: "tipoServico", attributes: ["id", "descricao", "valor"] },
					{ model: Cliente, as: "cliente" },
					{
						model: CaixaFormaLanc,
						as: "pagamento",
						attributes: ["forma_id", "id"],
						include: [{ model: CaixaFormaTipo, as: "tipo", attributes: ["descricao"] }],
					},
				],
			})
			return res.status(200).json({ falha: false, dados: lancamentoCriado })
		} catch (error) {
			console.log(error)

			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async alterarLancamento(req, res) {
		let { id: pagamento_id } = req.body.pagamento[0]

		try {
			await CaixaLancamento.update(req.body.lancamento, {
				where: { id: req.params.id },
			})
			await CaixaFormaLanc.update(req.body.pagamento[0], {
				where: { id: pagamento_id },
			})

			const lancamento = await CaixaLancamento.findOne({
				where: { id: req.params.id },
				include: [
					{ model: CaixaCategoria, as: "categoria" },
					{ model: TipoServico, as: "tipoServico", attributes: ["id", "descricao", "valor"] },
					{ model: Cliente, as: "cliente", attributes: ["id", "nome_razao_social"] },
					{
						model: CaixaFormaLanc,
						as: "pagamento",
						include: [{ model: CaixaFormaTipo, as: "tipo" }],
					},
				],
			})
			return res.status(200).json({ falha: false, dados: lancamento })
		} catch (error) {
			console.log(error)

			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async deletarLancamento(req, res) {
		try {
			let dados = await CaixaLancamento.destroy({
				where: { id: req.params.id },
			})

			return res.status(200).json({ falha: false, dados: dados })
		} catch (error) {
			return res.status(500).json({ falha: true, erro: error })
		}
	}

	// -------  Tipos de Pagamentos ----------  //
	async listarTipoPagamento(req, res) {
		try {
			const dados = await CaixaFormaTipo.findAll({ order: ["id"] })
			return res.status(200).json({ falha: false, dados: dados })
		} catch (error) {
			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async buscarTipoPagamento(req, res) {
		try {
			let formasBuscados = await redis.get("CaixaFormaTipo")

			if (!formasBuscados) {
				formasBuscados = await CaixaFormaTipo.findAll({ order: ["descricao"] })

				await redis.set("CaixaFormaTipo", formasBuscados, 1800)
			}
			return res.status(200).json({ falha: false, dados: { formasPagamentos: formasBuscados } })
		} catch (error) {
			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async criarTipoPagamento(req, res) {
		try {
			const payload = req.body
			const dados = await CaixaFormaTipo.create(payload)
			return res.status(200).json({ falha: false, dados: dados })
		} catch (error) {
			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async alterarTipoPagamento(req, res) {
		try {
			const dados = await CaixaFormaTipo.update(req.body, {
				where: { id: req.params.id },
			})
			return res.status(200).json({ falha: false, dados: dados })
		} catch (error) {
			return res.status(500).json({ falha: true, erro: error })
		}
	}

	// -------  Lançamento das Formas de pagamento ----------  //
	async listarFormaPagamento(req, res) {
		try {
			const dados = await CaixaFormaLanc.findAll({
				include: [
					{
						model: CaixaLancamento,
						as: "lancamento",
						attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
					},
					{ model: CaixaFormaTipo, as: "tipo", attributes: ["descricao"] },
				],
				order: ["id"],
			})
			return res.status(200).json({ falha: false, dados: dados })
		} catch (error) {
			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async criarFormaPagamento(req, res) {
		try {
			const payload = req.body
			const dados = await CaixaFormaLanc.create(payload)
			return res.status(200).json({ falha: false, dados: dados })
		} catch (error) {
			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async alterarFormaPagamento(req, res) {
		try {
			const dados = await CaixaFormaLanc.update(req.body, {
				where: { id: req.params.id },
			})
			return res.status(200).json({ falha: false, dados: dados })
		} catch (error) {
			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async deletarFormaPagamento(req, res) {
		try {
			//Se o parametro id for 0, será deletados todos
			const dados = await CaixaFormaLanc.destroy({
				where: req.params.id == 0 ? {} : { id: req.params.id },
			})
			return res.status(200).json({ falha: false, dados: dados })
		} catch (error) {
			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async quitarFaturado(req, res) {
		let { usuario_id, lancamento_id } = req.body
		try {
			let data = dayjs().format("YYYY-MM-DD")

			let quitacao = await CaixaQuitacao.create({ data, usuario_id, lancamento_id })

			return res.status(200).json({ falha: false, dados: { quitacao: quitacao } })
		} catch (error) {
			console.log(error)

			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async desquitarFaturado(req, res) {
		let { lancamento_id } = req.body
		try {
			await CaixaQuitacao.destroy({ where: { lancamento_id } })

			return res.status(200).json({ falha: false, dados: { deletado: true } })
		} catch (error) {
			console.log(error)

			return res.status(500).json({ falha: true, erro: error })
		}
	}
}

module.exports = new CaixaController()

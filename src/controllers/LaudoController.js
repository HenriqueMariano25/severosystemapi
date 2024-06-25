const {
	Cliente,
	Veiculo,
	Laudo,
	LaudoQuestao,
	ImagemLaudo,
	StatusLaudo,
	Questao,
	TipoVeiculo,
	Usuario,
	Gravidade,
	TipoServico,
	CaixaLancamento,
	RascunhoLaudo,
	PecaVeiculo,
} = require("../models")
const dayjs = require("dayjs")
const path = require("path")
const sharp = require("sharp")
const aws = require("aws-sdk")
const fs = require("fs")
const { Op, Sequelize } = require("sequelize")

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_DEFAULT_REGION } = process.env

const sharpify = async (originalFile) => {
	try {
		const image = sharp(originalFile.buffer)
		const meta = await image.metadata()
		const { format } = meta
		const config = {
			jpeg: { quality: 90 },
			webp: { quality: 90 },
			png: { quality: 90 },
		}
		return await image[format](config[format])
		// .resize({width: 1000, withoutEnlargement: true})
	} catch (err) {
		throw new Error(err)
	}
}

const uploadToAWS = (props) => {
	return new Promise((resolve, reject) => {
		const s3 = new aws.S3({
			accessKeyId: AWS_ACCESS_KEY_ID,
			secretAccessKey: AWS_SECRET_ACCESS_KEY,
			region: AWS_DEFAULT_REGION,
		})
		s3.upload(props, (err, data) => {
			if (err) reject(err)
			resolve(data)
		})
	})
}

async function adicionaRemoveQuestoes(laudo_id, questoes) {
	let questoesLaudo = await LaudoQuestao.findAll({
		where: { laudo_id: laudo_id },
		attributes: ["questao_id"],
	})
	let questoesLaudoIds = questoesLaudo.map((o) => o.questao_id)

	//ADICIONANDO NO LAUDO
	for (let questao of questoes) {
		if (!questoesLaudoIds.includes(questao)) {
			await LaudoQuestao.create({ laudo_id: laudo_id, questao_id: questao })
		}
	}

	//REMOVE NO LAUDO
	for (let questao of questoesLaudoIds) {
		if (!questoes.includes(questao)) {
			await LaudoQuestao.destroy({ where: { laudo_id, questao_id: questao } })
		}
	}
}

class LaudoController {
	async cadastrarLaudo(req, res) {
		let { tipo_servico_id } = req.body

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
			cambio_bin,
			cambio_atual,
			crlv,
			tipo_lacre,
			lacre,
		} = req.body.veiculo

		let {
			nome_razao_social: prop_nome,
			cpf_cnpj: prop_cpf_cnpj,
			cnh: prop_cnh,
			telefone: prop_telefone,
			email: prop_email,
		} = req.body.proprietario

		let { id: cliente_id } = req.body.cliente

		try {
			let { id: veiculo_id } = await Veiculo.create({
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
				cambio_bin,
				cambio_atual,
				crlv,
				tipo_lacre,
				lacre,
				tipo_veiculo_id: req.body.veiculo.tipo_veiculo_id,
			})

			let laudoCriado = await Laudo.create({
				cliente_id,
				prop_nome,
				prop_cpf_cnpj,
				prop_cnh,
				prop_telefone,
				prop_email,
				veiculo_id,
				status_laudo_id: 1,
				tipo_servico_id,
			})

			let laudoBuscado = await Laudo.findOne({
				where: { id: laudoCriado.id },
				attributes: ["id", "createdAt", "updatedAt"],
				include: [{ model: Veiculo, attributes: ["placa", "id"] }],
			})

			return res.status(200).json({ falha: false, dados: { laudo: laudoBuscado } })
		} catch (error) {
			console.log(error)
			return res.status(500).json({ falha: true, erro: error })
		}
	}
	async cadastrar(req, res) {
		let { tipo_servico_id } = req.body

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
			cambio_bin,
			cambio_atual,
			crlv,
			tipo_lacre,
			lacre,
		} = req.body.veiculo

		let { id: veiculo_id } = await Veiculo.create({
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
			cambio_bin,
			cambio_atual,
			crlv,
			tipo_lacre,
			lacre,
			tipo_veiculo_id: req.body.veiculo.tipo_veiculo.id,
		})

		let {
			nome_razao_social: prop_nome,
			cpf_cnpj: prop_cpf_cnpj,
			cnh: prop_cnh,
			telefone: prop_telefone,
			email: prop_email,
		} = req.body.proprietario

		let { id: cliente_id } = req.body.cliente

		try {
			let laudoCriado = await Laudo.create({
				cliente_id,
				prop_nome,
				prop_cpf_cnpj,
				prop_cnh,
				prop_telefone,
				prop_email,
				veiculo_id,
				status_laudo_id: 1,
				tipo_servico_id,
			})

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

			return res.status(200).json({ veiculo_id, laudo })
		} catch (error) {
			console.log(error)
			return res.status(400).json({ mensagem: "Erro ao cadastrar laudo" })
		}
	}

	async salvarFotos(req, res) {
		try {
			let dados = JSON.parse(req.body.data)

			let { laudo_id, perito_auxiliar_id, perito_id } = dados
			let img = dados.img
			let resumo = dados.resumo

			if (resumo.perito_auxiliar) {
				let perito_auxiliar_id = resumo.perito_auxiliar
				await Laudo.update(
					{ perito_auxiliar_id },
					{
						where: {
							id: laudo_id,
						},
					},
				)
			}

			if (perito_auxiliar_id) {
				await Laudo.update(
					{ perito_auxiliar_id },
					{
						where: {
							id: laudo_id,
						},
					},
				)
			}

			if (perito_id) {
				await Laudo.update(
					{ perito_id },
					{
						where: {
							id: laudo_id,
						},
					},
				)
			}

			const file = req.files[0]

			let peca_veiculo = img.nome

			let extensao
			if (file.mimetype === "image/jpeg") {
				extensao = "jpg"
			}
			let nomeFormatado = `laudo${laudo_id}-${dayjs().format("DDMMYYYYHHmmssSSS")}.${extensao}`

			let url = ""

			if (process.env.STORAGE_TYPE === "production") {
				await sharp(file.buffer).toFile(path.resolve("../images", nomeFormatado))
			} else if (process.env.STORAGE_TYPE === "local") {
				await sharp(file.buffer).toFile(path.resolve("tmp/uploads/", nomeFormatado))
			} else if (process.env.STORAGE_TYPE === "s3") {
				const originalFile = file
				const newFile = await sharpify(file)
				await uploadToAWS({
					Body: newFile,
					ACL: "public-read",
					Bucket: process.env.BUCKET_NAME,
					ContentType: newFile.mimetype,
					Key: `${nomeFormatado}`,
				})
			}

			if (process.env.STORAGE_TYPE === "production") {
				url = `${req.protocol}://104.197.15.193/api/files/${nomeFormatado}`
			} else if (process.env.STORAGE_TYPE === "s3") {
				url = `https://severo-nuxt.s3.sa-east-1.amazonaws.com/${nomeFormatado}`
			} else {
				url = `${req.protocol}://${req.get("host")}/files/${nomeFormatado}`
			}

			let imgCriada = await ImagemLaudo.create({
				url,
				nome: nomeFormatado,
				laudo_id,
				peca_veiculo,
				peca_veiculo_id: 1,
			})
			return res.status(200).json({ falha: false, dados: { img: imgCriada } })
			// return res.status(200).json({ falha: false, dados: {  } })
		} catch (error) {
			console.log(error)
			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async salvarRascunhos(req, res) {
		let dados = JSON.parse(req.body.data)

		let { laudo_id } = dados

		const files = req.files

		let rascunhosRetornadas = []

		for (let key in files) {
			let nomeFormatado = `${dayjs().format("DDMMYYYYHHmmssSSS")}-${files[key].originalname}`
			let url = ""
			let nome = nomeFormatado

			if (process.env.STORAGE_TYPE === "production") {
				if (files[key].mimetype != "application/pdf")
					await sharp(files[key].buffer).toFile(path.resolve("../images", nomeFormatado))
				else fs.writeFileSync(`images/${nomeFormatado}`, files[key].buffer, "binary")

				url = `${req.protocol}://104.197.15.193/api/files/${nome}`
			} else if (process.env.STORAGE_TYPE === "local") {
				if (files[key].mimetype != "application/pdf")
					await sharp(files[key].buffer).toFile(path.resolve("tmp/uploads/", nomeFormatado))
				else {
					fs.writeFileSync(`tmp/uploads/${nomeFormatado}`, files[key].buffer, "binary")
				}

				url = `${req.protocol}://localhost:3000/files/${nome}`
			}

			try {
				let rascunho = await RascunhoLaudo.create({
					url,
					nome: nome,
					laudo_id,
				})
				rascunhosRetornadas.push(rascunho)
			} catch (error) {
				console.log(error)
			}
		}

		return res.status(200).json({ rascunhos: rascunhosRetornadas })
	}

	async deletarRascunho(req, res) {
		let { id } = req.params

		try {
			let rascunho = await RascunhoLaudo.findOne({ where: { id } })

			await RascunhoLaudo.destroy({ where: { id } })

			if (process.env.STORAGE_TYPE === "production") {
				fs.unlink(
					path.resolve(__dirname, "..", "..", "..", "images", rascunho.nome),
					function (err) {
						if (err) throw err
					},
				)
			} else {
				fs.unlink(
					path.resolve(__dirname, "..", "..", "tmp", "uploads", rascunho.nome),
					function (err) {
						if (err) throw err
					},
				)
			}

			return res.status(200).json({ falha: false, deletado: true })
		} catch (error) {
			console.log(error)

			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async deletarFoto(req, res) {
		let { id } = req.params

		try {
			if (id) {
				let img = await ImagemLaudo.findOne({ where: { id } })
				if (img) {
					if (process.env.STORAGE_TYPE === "production") {
						fs.unlink(path.resolve(__dirname, "..", "..", "images", img.nome), function (err) {
							if (err) throw err
						})
					} else if (process.env.STORAGE_TYPE === "s3") {
					} else {
						fs.unlink(
							path.resolve(__dirname, "..", "..", "tmp", "uploads", img.nome),
							function (err) {
								if (err) console.log(err)
							},
						)
					}
				}

				await ImagemLaudo.destroy({ where: { id } })
			}
			return res.status(200).json({ falha: false, dados: { id: id } })
		} catch (error) {
			console.log(error)
			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async editarPecaImagem(req, res) {
		let { id } = req.params
		let { peca_id } = req.body
		let img = await ImagemLaudo.update(
			{ peca_veiculo_id: peca_id },
			{ where: { id }, returning: true },
		)
		return res.status(200).json({ img: img[1][0] })
	}

	async salvarQuestoes(req, res) {
		let { questoes, resumo } = req.body
		let { id: laudo_id } = req.params

		if (resumo.digitador) {
			let digitador_id = resumo.digitador
			await Laudo.update(
				{ digitador_id },
				{
					where: {
						id: laudo_id,
					},
				},
			)
		}

		let id_questoes = []
		for (let key in questoes) {
			if (questoes[key]["LaudoQuestao"] === undefined) {
				let { id } = await LaudoQuestao.create({ laudo_id, questao_id: questoes[key].id })
				id_questoes.push(id)
			} else {
				id_questoes.push(questoes[key]["LaudoQuestao"]["id"])
			}
		}

		await LaudoQuestao.destroy({
			where: { [Op.and]: [{ id: { [Op.not]: id_questoes } }, { laudo_id: laudo_id }] },
		})

		return res.json({ menssagem: "Questões salvar com sucesso" })
	}

	async editar(req, res) {
		let { cliente, proprietario, veiculo, resumo } = req.body
		let { id: laudo_id } = req.params

		try {
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
				cambio_bin,
				cambio_atual,
				crlv,
				tipo_lacre,
				lacre,
			} = veiculo

			let { id: veiculo_id } = await Veiculo.update(
				{
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
					cambio_bin,
					cambio_atual,
					crlv,
					tipo_lacre,
					lacre,
					tipo_veiculo_id: veiculo.tipo_veiculo.id,
				},
				{ where: { id: veiculo.id } },
			)
			let {
				nome_razao_social: prop_nome,
				cpf_cnpj: prop_cpf_cnpj,
				cnh: prop_cnh,
				telefone: prop_telefone,
				email: prop_email,
			} = proprietario

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
					prop_nome,
					prop_cpf_cnpj,
					prop_cnh,
					prop_telefone,
					prop_email,
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
		} catch (error) {
			console.log(error)
			return res.status(400).json({ mensagem: "Erro ao editar laudo" })
		}
	}

	async editarNovoPadrao(req, res) {
		let { cliente, proprietario, veiculo, resumo, questoes } = req.body
		let { id: laudo_id } = req.params

		try {
			let {
				placa,
				ano,
				hodometro,
				uf,
				grv,
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
				cambio_bin,
				cambio_atual,
				crlv,
				tipo_lacre,
				lacre,
				tipo_veiculo_id,
			} = veiculo

			let { id: veiculo_id } = await Veiculo.update(
				{
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
					grv,
					cor_atual,
					combustivel,
					renavam,
					cambio_bin,
					cambio_atual,
					crlv,
					tipo_lacre,
					lacre,
					tipo_veiculo_id: tipo_veiculo_id,
				},
				{ where: { id: veiculo.id } },
			)

			let {
				nome_razao_social: prop_nome,
				cpf_cnpj: prop_cpf_cnpj,
				cnh: prop_cnh,
				telefone: prop_telefone,
				email: prop_email,
			} = proprietario

			let {
				situacao,
				observacao,
				perito: perito_id,
				perito_auxiliar: perito_auxiliar_id,
				digitador: digitador_id,
			} = resumo

			await Laudo.update(
				{
					cliente_id: cliente,
					prop_nome,
					prop_cpf_cnpj,
					prop_cnh,
					prop_telefone,
					prop_email,
					veiculo_id,
					situacao,
					observacao,
					perito_id,
					perito_auxiliar_id,
					digitador_id,
				},
				{ where: { id: laudo_id } },
			)

			await adicionaRemoveQuestoes(laudo_id, questoes)

			return res.status(200).json({ falha: false, dados: {} })
		} catch (error) {
			console.log(error)
			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async finalizar(req, res) {
		let { id } = req.params

		let laudo = await Laudo.update(
			{
				status_laudo_id: 3,
			},
			{ where: { id: id } },
		)

		return res.status(200).json({ laudo })
	}

	// async buscarTodos(req, res) {
	//   let laudos = await Laudo.findAll({
	//     where: {
	//       tipo_servico_id: { [Op.not]: [3] },
	//     },
	//     include: [
	//       {
	//         model: Veiculo,
	//         include: [{ model: TipoVeiculo, attributes: ["descricao"] }],
	//         attributes: { exclude: ["createdAt", "updatedAt"] },
	//       },
	//       {
	//         model: Cliente,
	//         attributes: { exclude: ["createdAt", "updatedAt"] },
	//       },
	//       {
	//         model: StatusLaudo,
	//         attributes: ["id", "descricao"],
	//       },
	//       {
	//         model: Usuario,
	//         as: "perito",
	//         attributes: ["nome"],
	//       },
	//       {
	//         model: Usuario,
	//         as: "perito_auxiliar",
	//         attributes: ["nome"],
	//       },
	//       {
	//         model: Usuario,
	//         as: "digitador",
	//         attributes: ["nome"],
	//       },
	//     ],
	//     order: [["id", "DESC"]],
	//   })
	//
	//   return res.status(200).json({ laudos: laudos })
	// }

	async buscarTodosCliente(req, res) {
		let { cliente_id, page, size } = req.query

		let laudos = await Laudo.findAndCountAll({
			where: {
				cliente_id: cliente_id,
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
			],
			order: [["id", "DESC"]],
		})

		return res.status(200).json({ laudos: laudos })
	}

	async buscarEspecificoCliente(req, res) {
		let { cliente_id, busca } = req.query

		busca = JSON.parse(busca)

		try {
			const laudos = await Laudo.findAndCountAll({
				where: {
					cliente_id: cliente_id,
					[Op.or]: [
						{ "$Veiculo.placa$": { [Op.like]: "%" + busca.texto + "%" } },
						{ "$Veiculo.marca_modelo$": { [Op.like]: "%" + busca.texto + "%" } },
						{ "$Veiculo.chassi_bin$": { [Op.like]: "%" + busca.texto + "%" } },
						{ "$Veiculo.chassi_atual$": { [Op.like]: "%" + busca.texto + "%" } },
						{ "$Cliente.nome_razao_social$": { [Op.like]: "%" + busca.texto + "%" } },
						{ "$perito.nome$": { [Op.like]: "%" + busca.texto + "%" } },
						{ "$perito_auxiliar.nome$": { [Op.like]: "%" + busca.texto + "%" } },
						{ "$digitador.nome$": { [Op.like]: "%" + busca.texto + "%" } },
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
				],
				order: [["id", "DESC"]],
			})

			return res.status(200).json({ laudos: laudos })
		} catch (error) {
			console.log(error)

			return res.status(500).json({ mensagem: error })
		}
	}

	async buscar(req, res) {
		let { id } = req.params
		let laudo = await Laudo.findOne({
			where: { id },
			include: [
				{ model: Cliente },
				{
					model: Questao,
					include: { model: Gravidade, attributes: ["cor", "icone", "descricao"] },
				},
				{ model: Usuario, as: "perito", attributes: ["nome", "id"] },
				{
					model: Usuario,
					as: "perito_auxiliar",
					attributes: ["nome", "id"],
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
				{ model: RascunhoLaudo, attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] } },
				{
					model: Veiculo,
					include: {
						model: TipoVeiculo,
						attributes: ["descricao"],
						include: [
							{
								model: PecaVeiculo,
								as: "PecaVeiculo",
								attributes: ["descricao", "id", "tela_inicial"],
							},
						],
					},
				},
				{
					model: TipoServico,
					attributes: ["id", "descricao"],
				},
			],
		})

		let codigoLaudo = ("000000000" + id).slice(-9)
		let lancamento = await CaixaLancamento.findOne({
			where: { descricao: { [Op.substring]: codigoLaudo } },
		})

		return res.status(200).json({ laudo: laudo, lancamento: lancamento })
	}

	async deletar(req, res) {
		try {
			let { id } = req.params

			let laudo = await Laudo.findOne({ where: { id: id } })

			if (laudo) {
				let idFormatado = ("000000000" + id).slice(-9)

				let lancamentos = await CaixaLancamento.findAll({
					where: { descricao: { [Op.iLike]: `%${idFormatado} T%` } },
					attributes: ["id"],
				})

				if (lancamentos.length > 0) {
					for (let lanc of lancamentos) {
						await CaixaLancamento.destroy({ where: { id: lanc.id } })
					}
				}

				laudo.destroy()
			}

			return res.status(200).json({ laudo: "laudo" })
		} catch (error) {
			console.log(error)
			return res.status(400).json({ mensagem: "Erro ao deletar Laudo!" })
		}
	}

	async buscarTodosPaginados(req, res) {
		let { page, size, busca } = req.query

		busca = JSON.parse(busca) || {}

		const laudos = await Laudo.findAndCountAll({
			where: {
				tipo_servico_id: { [Op.not]: [3] },

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
								createdAt: { [Op.lte]: dayjs(busca.data_final).add(1, "day").format("YYYY-MM-DD") },
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

		return res.status(200).json({ laudos: laudos })
	}

	async buscarTodosPaginadosCliente(req, res) {
		let { page, size, busca, cliente_id } = req.query

		busca = JSON.parse(busca) || {}

		const laudos = await Laudo.findAndCountAll({
			where: {
				tipo_servico_id: { [Op.not]: [3] },
				// cliente_id,

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
								createdAt: { [Op.lte]: dayjs(busca.data_final).add(1, "day").format("YYYY-MM-DD") },
							}
						: "",
					busca.data_inicial != null && busca.data_inicial != ""
						? { createdAt: { [Op.gte]: busca.data_inicial } }
						: "",
				],
				cliente_id: parseInt(cliente_id),
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

		return res.status(200).json({ laudos: laudos })
	}

	async buscarTodosPaginadosPerito(req, res) {
		let { busca, pagina } = req.query

		busca = JSON.parse(busca) || {}

		try {
			const laudos = await Laudo.findAll({
				subQuery: false,
				where: {
					[Op.or]: [
						{ id: busca.texto.match(/\d+/g) != null ? busca.texto.match(/\d+/g)[0] : null },
						{ "$Veiculo.placa$": { [Op.like]: "%" + busca.texto + "%" } },
						{ "$Veiculo.marca_modelo$": { [Op.like]: "%" + busca.texto + "%" } },
						{ "$Veiculo.chassi_bin$": { [Op.like]: "%" + busca.texto + "%" } },
						{ "$Veiculo.chassi_atual$": { [Op.like]: "%" + busca.texto + "%" } },
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
					status_laudo_id: { [Op.not]: 3 },
					processado: { [Op.not]: true },
				},
				include: [
					{
						required: false,
						model: Veiculo,
						include: [
							{
								model: TipoVeiculo,
								attributes: ["descricao"],
								required: false,
								include: [
									// { model: PecaVeiculo, as: "PecaVeiculo", attributes: ["id", "descricao"]},
								],
							},
						],
						attributes: { exclude: ["createdAt", "updatedAt"] },
					},
					{
						model: Usuario,
						required: false,
						as: "perito_auxiliar",
						attributes: ["nome"],
					},
					{
						model: ImagemLaudo,
						attributes: ["url", "peca_veiculo"],
						required: false,
						order: [["peca_veiculo", "DESC"]],
					},
				],
				limit: 50,
				offset: (pagina - 1) * 50,
				order: [["id", "DESC"]],
			})

			const total = await Laudo.findAll({
				where: {
					[Op.or]: [
						{ id: busca.texto.match(/\d+/g) != null ? busca.texto.match(/\d+/g)[0] : null },
						{ "$Veiculo.placa$": { [Op.like]: "%" + busca.texto + "%" } },
						{ "$Veiculo.marca_modelo$": { [Op.like]: "%" + busca.texto + "%" } },
						{ "$Veiculo.chassi_bin$": { [Op.like]: "%" + busca.texto + "%" } },
						{ "$Veiculo.chassi_atual$": { [Op.like]: "%" + busca.texto + "%" } },
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
					status_laudo_id: { [Op.not]: 3 },
					processado: { [Op.not]: true },
				},
				include: [
					{
						model: Veiculo,
						include: [{ model: TipoVeiculo, attributes: ["descricao"] }],
						attributes: { exclude: ["createdAt", "updatedAt"] },
					},
				],
			}).then((o) => o.length)

			return res.status(200).json({ falha: false, dados: { laudos, total } })
		} catch (error) {
			console.log(error)
			return res.status(500).json({ falha: true, erro: error })
		}
	}

	async buscarTodos(req, res) {
		const { page, size } = req.query

		const laudos = await Laudo.findAndCountAll({
			where: {
				tipo_servico_id: { [Op.not]: [3] },
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

		return res.status(200).json({ laudos: laudos })
	}

	async buscarEspecifico(req, res) {
		let busca = req.query

		try {
			const laudos = await Laudo.findAndCountAll({
				where: {
					tipo_servico_id: { [Op.not]: [3] },
					[Op.and]: [
						{
							[Op.or]: [
								{ "$Veiculo.placa$": { [Op.like]: "%" + busca.texto + "%" } },
								{ "$Veiculo.marca_modelo$": { [Op.like]: "%" + busca.texto + "%" } },
								{ "$Veiculo.chassi_bin$": { [Op.like]: "%" + busca.texto + "%" } },
								{ "$Veiculo.chassi_atual$": { [Op.like]: "%" + busca.texto + "%" } },
								{ "$Cliente.nome_razao_social$": { [Op.like]: "%" + busca.texto + "%" } },
								{ "$perito.nome$": { [Op.like]: "%" + busca.texto + "%" } },
								{ "$perito_auxiliar.nome$": { [Op.like]: "%" + busca.texto + "%" } },
								{ "$digitador.nome$": { [Op.like]: "%" + busca.texto + "%" } },
							],
							[Op.and]: [
								busca.data_inicial != null && busca.data_inicial != ""
									? { createdAt: { [Op.gte]: busca.data_inicial } }
									: "",
								busca.data_final != null && busca.data_final != ""
									? {
											createdAt: {
												[Op.lte]: dayjs(busca.data_final).add(1, "day").format("YYYY-MM-DD"),
											},
										}
									: "",
							],
						},
					],
				},
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
				],
				order: [["id", "DESC"]],
			})

			return res.status(200).json({ laudos: laudos })
		} catch (error) {
			console.log(error)

			return res.status(500).json({ mensagem: error })
		}
	}

	async processarLaudo(req, res) {
		let { usuario_id, laudo_id } = req.body

		try {
			await Laudo.update(
				{ processado: true, processado_por_id: usuario_id },
				{ where: { id: laudo_id } },
			)

			return res
				.status(200)
				.json({ falha: false, dados: { laudo_id, mensagem: "Laudo processado com sucesso!" } })
		} catch (erro) {
			console.log(erro)
			return res.status(400).json({ erro: erro })
		}
	}
}

module.exports = new LaudoController()

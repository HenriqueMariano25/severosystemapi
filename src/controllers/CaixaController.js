const {
    CaixaDia,
    CaixaLancamento,
    CaixaCategoria,
    CaixaFormaTipo,
    CaixaFormaLanc,
    Usuario,
} = require("../models")
const {Op, sequelize, Sequelize} = require("sequelize")
const dayjs = require("dayjs")

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

class CaixaController {
    async listarCaixaDia(req, res) {
        try {
            let filtro = JSON.parse(req.query.filtro) || {}

            const dados = await CaixaDia.findAll({
                include: [
                    {
                        model: CaixaLancamento,
                        as: "lancamentos",
                        attributes: {exclude: ["createdAt", "updatedAt"]},
                        include: [
                            {
                                model: CaixaCategoria,
                                as: "categoria",
                                attributes: ["descricao", "id"],
                            },
                            {model: CaixaFormaLanc, as: "pagamento"},
                        ],
                    },
                    {model: Usuario, attributes: ["nome"]},
                ],
                where: filtro,
                order: ["id"],
            })
            return res.status(200).json({falha: false, dados: dados})
        } catch (error) {
            console.log(error)

            return res.status(500).json({falha: true, erro: error})
        }
    }

    async listarCaixaDiaRelatorio(req, res) {
        try {
            console.log(req.query)
            console.log(req.params)
            let filtro = JSON.parse(req.query.filtro) || {}

            const dados = await CaixaDia.findAll({
                // group: ['CaixaDia.id', 'lancamentos.id', 'lancamentos.categoria.descricao', 'lancamentos.categoria.id', 'Usuario.id'],
                attributes: {exclude: ['deletedAt', 'updatedAt', 'createdAt']},
                include: [
                    {
                        model: CaixaLancamento,
                        as: "lancamentos",
                        attributes: {exclude: ["createdAt", "updatedAt"]},
                        include: [
                            {
                                model: CaixaCategoria,
                                as: "categoria",
                                attributes: ["descricao", "id"],
                            },
                            {
                                model: CaixaFormaLanc,
                                as: "pagamento",
                                attributes: ['forma_id'],
                                include: [{model: CaixaFormaTipo, as: "tipo", attributes: ['descricao']}]
                            },
                        ],
                    },

                    {model: Usuario, attributes: ["nome"]},
                ],
                where: filtro,
                order: ["id"],

            })
            // console.log(dados[0].lancamentos)


            let resumo = await CaixaLancamento.findAll({
                where: {caixadia_id: filtro.id},
                attributes: [[Sequelize.fn('SUM', Sequelize.cast(Sequelize.col('pagamento.valor'), 'float')), 'total']],
                include: [
                    {
                        model: CaixaFormaLanc,
                        as: "pagamento",
                        attributes: ['forma_id'],
                        include: [{model: CaixaFormaTipo, as: "tipo", attributes: ['descricao']}]
                    },
                ],
                group: ['pagamento.forma_id', 'pagamento.tipo.descricao', 'pagamento.tipo.id'],
                raw: true,

            })

            console.log(resumo)


            return res.status(200).json({falha: false, dados: dados})
        } catch (error) {
            console.log(error)

            return res.status(500).json({falha: true, erro: error})
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
                where: {id: req.params.id},
            })
            return res.status(200).json({falha: false, dados: dados})
        } catch (error) {
            return res.status(500).json({falha: true, erro: error})
        }
    }

    async criarCaixaDia(req, res) {
        try {
            const dataAtual = dayjs(new Date()).format("YYYY-MM-DD")
            const payload = {...req.body, data_abertura: dataAtual}

            if (await existeCaixaAberto(payload)) {
                return res.status(200).json({
                    falha: true,
                    erro: "Já existe um caixa desse usuário nesta data!",
                })
            }
            const dados = await CaixaDia.create(payload)
            return res.status(200).json({falha: false, dados: dados})
        } catch (error) {
            console.log(error)

            return res.status(500).json({falha: true, erro: error})
        }
    }

    async alterarCaixaDia(req, res) {
        try {
            const dados = await CaixaDia.update(req.body, {
                where: {id: req.params.id},
            })
            return res.status(200).json({falha: false, dados: dados})
        } catch (error) {
            return res.status(500).json({falha: true, erro: error})
        }
    }

    async deletarCaixaDia(req, res) {
        try {
            //Se o parametro id for 0, será deletados todos
            const dados = await CaixaDia.destroy({
                where: req.params.id == 0 ? {} : {id: req.params.id},
            })
            return res.status(200).json({falha: false, dados: dados})
        } catch (error) {
            return res.status(500).json({falha: true, erro: error})
        }
    }

    async verificarCaixaAberto(req, res) {
        let {usuario_id} = req.params
        let data_abertura = dayjs().format("YYYY-MM-DD")

        try {
            const dados = await CaixaDia.findOne({
                where: {usuario_id, data_abertura},
                include: [
                    {
                        model: CaixaLancamento,
                        as: "lancamentos",
                        attributes: ["descricao", "id", "valor", "created_at"],
                        include: [
                            {model: CaixaCategoria, as: "categoria"},
                            {
                                model: CaixaFormaLanc,
                                as: "pagamento",
                                attributes: ['forma_id'],
                                include: [{model: CaixaFormaTipo, as: "tipo", attributes: ['descricao']}]
                            },
                        ],
                    },
                ],
                order: [
                    [{model: CaixaLancamento, as: "lancamentos"}, "created_at", "DESC"],
                ],
            })

            return res.status(200).json({falha: false, dados: dados})
        } catch (error) {
            console.log(error)

            return res.status(500).json({falha: true, erro: error})
        }
    }

    // -------  Categorias ----------  //

    async listarCategoria(req, res) {
        let filtro = JSON.parse(req.query.filtro) || {}

        try {
            const dados = await CaixaCategoria.findAll({
                where: {...filtro},
                order: ["descricao"],
            })
            return res.status(200).json({falha: false, dados: dados})
        } catch (error) {
            console.log(error)

            return res.status(500).json({falha: true, erro: error})
        }
    }

    async listarCategoriaEntrada(req, res) {
        try {
            const dados = await CaixaCategoria.findAll({
                where: {tipo: "Entrada"},
                order: ["descricao"],
            })
            return res.status(200).json({falha: false, dados: dados})
        } catch (error) {
            console.log(error)

            return res.status(500).json({falha: true, erro: error})
        }
    }

    async listarCategoriaSaida(req, res) {
        try {
            const dados = await CaixaCategoria.findAll({
                where: {tipo: "Saída"},
                order: ["descricao"],
            })
            return res.status(200).json({falha: false, dados: dados})
        } catch (error) {
            console.log(error)

            return res.status(500).json({falha: true, erro: error})
        }
    }

    async criarCategoria(req, res) {
        try {
            const payload = req.body
            const dados = await CaixaCategoria.create(payload)
            return res.status(200).json({falha: false, dados: dados})
        } catch (error) {
            return res.status(500).json({falha: true, erro: error})
        }
    }

    async alterarCategoria(req, res) {
        try {
            const dados = await CaixaCategoria.update(req.body, {
                where: {id: req.params.id},
            })
            return res.status(200).json({falha: false, dados: dados})
        } catch (error) {
            return res.status(500).json({falha: true, erro: error})
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
                        attributes: {exclude: ["createdAt", "updatedAt"]},
                    },
                    {model: CaixaCategoria, as: "categoria", attributes: ["descricao"]},
                ],
                order: [["createdAt", "DESC"]],
            })
            return res.status(200).json({falha: false, dados: dados})
        } catch (error) {
            return res.status(500).json({falha: true, erro: error})
        }
    }

    async abrirUmLancamento(req, res) {
        try {
            const filtro = req.body || {}
            const dados = await CaixaLancamento.findOne({
                ...filtro,
                include: [
                    {model: CaixaCategoria, as: "categoria", attributes: ["descricao"]},
                    {
                        model: CaixaFormaLanc,
                        as: "pagamento",
                        attributes: {exclude: ["lancamento_id", "deletedAt"]},
                        include: [
                            {model: CaixaFormaTipo, as: "tipo", attributes: ["descricao"]},
                        ],
                    },
                ],
            })

            return res.status(200).json({falha: false, dados: dados})
        } catch (error) {
            return res.status(500).json({falha: true, erro: error})
        }
    }

    async criarLancamento(req, res) {
        try {
            let {lancamento, pagamento} = req.body

            const dados = await CaixaLancamento.create(lancamento)

            if (pagamento.length) {
                pagamento.map(async (item) => {
                    item.lancamento_id = dados.id
                    await CaixaFormaLanc.create(item)
                })
            }

            let lancamentoCriado = await CaixaLancamento.findOne({
                where: {id: dados.id},
                include: [
                    {
                        model: CaixaCategoria,
                        as: "categoria",
                        attributes: ["descricao", "id"],
                    },
                ],
            })

            let pagamentoEncontrado = await CaixaFormaLanc.findAll({where: {lancamento_id: dados.id}})

            lancamentoCriado.pagamento = pagamentoEncontrado

            return res.status(200).json({falha: false, dados: lancamentoCriado})
        } catch (error) {
            console.log(error)

            return res.status(500).json({falha: true, erro: error})
        }
    }

    async alterarLancamento(req, res) {
        let {id: pagamento_id} = req.body.pagamento[0]

        try {
            await CaixaLancamento.update(req.body.lancamento, {
                where: {id: req.params.id},
            })
            await CaixaFormaLanc.update(req.body.pagamento[0], {
                where: {id: pagamento_id},
            })

            const lancamento = await CaixaLancamento.findOne({
                where: {id: req.params.id},
                include: [
                    {
                        model: CaixaCategoria,
                        as: "categoria",
                        attributes: ["descricao", "id"],
                    },
                ],
            })
            return res.status(200).json({falha: false, dados: lancamento})
        } catch (error) {
            return res.status(500).json({falha: true, erro: error})
        }
    }

    async deletarLancamento(req, res) {
        try {
            let dados = await CaixaLancamento.destroy({
                where: {id: req.params.id},
            })

            return res.status(200).json({falha: false, dados: dados})
        } catch (error) {
            return res.status(500).json({falha: true, erro: error})
        }
    }

    // -------  Tipos de Pagamentos ----------  //
    async listarTipoPagamento(req, res) {
        try {
            const dados = await CaixaFormaTipo.findAll({order: ["id"]})
            return res.status(200).json({falha: false, dados: dados})
        } catch (error) {
            return res.status(500).json({falha: true, erro: error})
        }
    }

    async criarTipoPagamento(req, res) {
        try {
            const payload = req.body
            const dados = await CaixaFormaTipo.create(payload)
            return res.status(200).json({falha: false, dados: dados})
        } catch (error) {
            return res.status(500).json({falha: true, erro: error})
        }
    }

    async alterarTipoPagamento(req, res) {
        try {
            const dados = await CaixaFormaTipo.update(req.body, {
                where: {id: req.params.id},
            })
            return res.status(200).json({falha: false, dados: dados})
        } catch (error) {
            return res.status(500).json({falha: true, erro: error})
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
                        attributes: {exclude: ["createdAt", "updatedAt", "deletedAt"]},
                    },
                    {model: CaixaFormaTipo, as: "tipo", attributes: ["descricao"]},
                ],
                order: ["id"],
            })
            return res.status(200).json({falha: false, dados: dados})
        } catch (error) {
            return res.status(500).json({falha: true, erro: error})
        }
    }

    async criarFormaPagamento(req, res) {
        try {
            const payload = req.body
            const dados = await CaixaFormaLanc.create(payload)
            return res.status(200).json({falha: false, dados: dados})
        } catch (error) {
            return res.status(500).json({falha: true, erro: error})
        }
    }

    async alterarFormaPagamento(req, res) {
        try {
            const dados = await CaixaFormaLanc.update(req.body, {
                where: {id: req.params.id},
            })
            return res.status(200).json({falha: false, dados: dados})
        } catch (error) {
            return res.status(500).json({falha: true, erro: error})
        }
    }

    async deletarFormaPagamento(req, res) {
        try {
            //Se o parametro id for 0, será deletados todos
            const dados = await CaixaFormaLanc.destroy({
                where: req.params.id == 0 ? {} : {id: req.params.id},
            })
            return res.status(200).json({falha: false, dados: dados})
        } catch (error) {
            return res.status(500).json({falha: true, erro: error})
        }
    }
}

module.exports = new CaixaController()

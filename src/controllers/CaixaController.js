const { CaixaDia, CaixaLancamento, CaixaCategoria, CaixaFormaTipo, CaixaFormaLanc } = require('../models')
const { Op } = require('sequelize')
const dayjs = require('dayjs')

async function existeCaixaAberto(payload) {
    const dados = await CaixaDia.findAll({
        where: {
            status_caixa: 'Aberto',
            data_abertura: payload.data_abertura,
            usuario_id: payload.usuario_id
        },
        order: ['id']
    })
    return caixaAberto.length
}


class CaixaController {
    async listarCaixaDia(req, res) {
        try {
            let filtro = req.body || {}
            const dados = await CaixaDia.findAll({
                include: [
                    {
                        model: CaixaLancamento, as: 'lancamentos',
                        attributes: { exclude: ["createdAt", "updatedAt"] },
                        include: [{ model: CaixaCategoria, as: 'categoria', attributes: ['descricao'] }]
                    },
                ],
                where: filtro,
                order: ['id']
            })
            return res.status(200).json({ falha: false, dados: dados })
        } catch (error) {
            return res.status(500).json({ falha: true, erro: error })
        }
    }
    async abrirUmCaixaDia(req, res) {
        try {
            const dados = await CaixaDia.findOne({
                include: [
                    {
                        model: CaixaLancamento, as: 'lancamentos',
                        attributes: { exclude: ["caixadia_id", "createdAt", "updatedAt", 'deletedAt'] },
                        include: [{ model: CaixaCategoria, as: 'categoria', attributes: ['descricao'] }]
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
            const dataAtual = dayjs(new Date()).format('YYYY-MM-DD')
            const payload = { ...req.body, data_abertura: dataAtual }
            if (await existeCaixaAberto(payload)) {
                return res.status(200).json({
                    falha: true,
                    erro: 'Já existe um caixa desse usuário nesta data!'
                })
            }
            const dados = await CaixaDia.create(payload)
            return res.status(200).json({ falha: false, dados: dados })
        } catch (error) {
            return res.status(500).json({ falha: true, erro: error })

        }
    }

    async alterarCaixaDia(req, res) {
        try {
            // codigo abaixao serve para alterar todos de uma vez (cuidado!!)
            // const dados = await CaixaDia.update(req.body, { where: req.params.id == 0 ? {} : { id: req.params.id } })
            const dados = await CaixaDia.update(req.body,
                { where: { id: req.params.id } })
            return res.status(200).json({ falha: false, dados: dados })
        } catch (error) {
            return res.status(500).json({ falha: true, erro: error })
        }
    }

    async deletarCaixaDia(req, res) {
        try {
            //Se o parametro id for 0, será deletados todos
            const dados = await CaixaDia.destroy(
                { where: req.params.id == 0 ? {} : { id: req.params.id } })
            return res.status(200).json({ falha: false, dados: dados })
        } catch (error) {
            return res.status(500).json({ falha: true, erro: error })
        }
    }

    // -------  Categorias ----------  //
    async listarCategoria(req, res) {
        try {
            const dados = await CaixaCategoria.findAll({ order: ['descricao'] })
            return res.status(200).json({ falha: false, dados: dados })
        } catch (error) {
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
            const dados = await CaixaCategoria.update(req.body,
                { where: { id: req.params.id } })
            return res.status(200).json({ falha: false, dados: dados })
        } catch (error) {
            return res.status(500).json({ falha: true, erro: error })
        }
    }

    // -------  Lancamentos ----------  //
    async listarLancamento(req, res) {
        try {
            let filtro = req.body || {}
            const dados = await CaixaLancamento.findAll(
                {
                    ...filtro,
                    include: [
                        { model: CaixaDia, as: 'caixa', attributes: { exclude: ["createdAt", "updatedAt"] } },
                        { model: CaixaCategoria, as: 'categoria', attributes: ['descricao'] },
                    ],
                    order: ['id']
                }
            )
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
                    { model: CaixaCategoria, as: 'categoria', attributes: ['descricao'] },
                    {
                        model: CaixaFormaLanc, as: 'pagamento', attributes: { exclude: ['lancamento_id', 'deletedAt'] },
                        include: [{ model: CaixaFormaTipo, as: 'tipo', attributes: ['descricao'] }]
                    }]
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
                pagamento.map(async (item) => {
                    item.lancamento_id = dados.id
                    await CaixaFormaLanc.create(item)
                })
            }

            return res.status(200).json({ falha: false, dados: dados })
        } catch (error) {
            return res.status(500).json({ falha: true, erro: error })
        }
    }

    async alterarLancamento(req, res) {
        try {
            const dados = await CaixaLancamento.update(req.body, { where: { id: req.params.id } })
            return res.status(200).json({ falha: false, dados: dados })
        } catch (error) {
            return res.status(500).json({ falha: true, erro: error })
        }
    }
    async deletarLancamento(req, res) {
        try {
            //Se o parametro id for 0, será deletados todos
            const dados = await CaixaLancamento.destroy({ where: req.params.id == 0 ? {} : { id: req.params.id } })
            return res.status(200).json({ falha: false, dados: dados })
        } catch (error) {
            return res.status(500).json({ falha: true, erro: error })
        }
    }

    // -------  Tipos de Pagamentos ----------  //
    async listarTipoPagamento(req, res) {
        try {
            const dados = await CaixaFormaTipo.findAll({ order: ['id'] })
            return res.status(200).json({ falha: false, dados: dados })
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
            const dados = await CaixaFormaTipo.update(req.body,
                { where: { id: req.params.id } })
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
                    { model: CaixaLancamento, as: 'lancamento', attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] } },
                    { model: CaixaFormaTipo, as: 'tipo', attributes: ['descricao'] }
                ],
                order: ['id']
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
            const dados = await CaixaFormaLanc.update(req.body,
                { where: { id: req.params.id } })
            return res.status(200).json({ falha: false, dados: dados })
        } catch (error) {
            return res.status(500).json({ falha: true, erro: error })
        }
    }
    async deletarFormaPagamento(req, res) {
        try {
            //Se o parametro id for 0, será deletados todos
            const dados = await CaixaFormaLanc.destroy({ where: req.params.id == 0 ? {} : { id: req.params.id } })
            return res.status(200).json({ falha: false, dados: dados })
        } catch (error) {
            return res.status(500).json({ falha: true, erro: error })
        }
    }
}

module.exports = new CaixaController()
const routes = require('express').Router()
const CaixaController = require('../controllers/CaixaController')

//----- Categorias ---------//
routes.get('/caixa/categoria', CaixaController.listarCategoria)
routes.get('/caixa/categoria/buscar', CaixaController.buscarCategorias)
routes.get('/caixa/categoria/entrada', CaixaController.listarCategoriaEntrada)
routes.get('/caixa/categoria/saida', CaixaController.listarCategoriaSaida)
routes.post('/caixa/categoria', CaixaController.criarCategoria)
routes.put('/caixa/categoria/:id', CaixaController.alterarCategoria)

// -------  Tipos de Pagamentos ----------  //
routes.get('/caixa/tipopagamento', CaixaController.listarTipoPagamento)
routes.get('/caixa/tipopagamento/buscar', CaixaController.buscarTipoPagamento)
routes.post('/caixa/tipopagamento', CaixaController.criarTipoPagamento)
routes.put('/caixa/tipopagamento/:id', CaixaController.alterarTipoPagamento)

//----- Lancamentos ---------//
routes.get('/caixa/lancamento', CaixaController.listarLancamento)
routes.get('/caixa/lancamento/:id', CaixaController.abrirUmLancamento)
routes.post('/caixa/lancamento', CaixaController.criarLancamento)
routes.put('/caixa/lancamento/:id', CaixaController.alterarLancamento)
routes.delete('/caixa/lancamento/:id', CaixaController.deletarLancamento)


// -------  Lançamento das Formas de pagamento ----------  //
routes.get('/caixa/formalanc', CaixaController.listarFormaPagamento)
routes.post('/caixa/formalanc', CaixaController.criarFormaPagamento)
routes.put('/caixa/formalanc/:id', CaixaController.alterarFormaPagamento)
routes.delete('/caixa/formalanc/:id', CaixaController.deletarFormaPagamento)

//----- Caixa Dia ---------//
routes.put("/caixa/fechar", CaixaController.fecharCaixa)
routes.get('/caixas/admin/por_dia', CaixaController.listarCaixaDiaPorDia)
routes.get('/caixas/admin/extrato', CaixaController.listarCaixaDiaExtrato)
routes.get('/caixas/admin/extrato/resumido', CaixaController.listarCaixaDiaExtratoResumido)
routes.get('/caixa/relatorio', CaixaController.listarCaixaDiaRelatorio)
routes.get('/caixa/:id', CaixaController.abrirUmCaixaDia)
routes.post('/caixa', CaixaController.criarCaixaDia)
routes.put('/caixa/:id', CaixaController.alterarCaixaDia)
routes.delete('/caixa/:id', CaixaController.deletarCaixaDia)
routes.get('/caixa/verificar_caixa_aberto/:usuario_id', CaixaController.verificarCaixaAberto)

routes.get('/caixa/atual', CaixaController.buscarCaixaAtual)
routes.get("/caixa/atual/novo_padrao", CaixaController.buscarCaixaAtualNovoPadrao)
routes.get("/caixa/buscar/:id", CaixaController.buscarCaixa)
routes.get("/caixa/relatorio/porDia/novoPadrao", CaixaController.buscarCaixaDiaRelatorio)
routes.get('/caixa', CaixaController.listarCaixaDia)

//------- Caixa Quitação -------//
routes.post("/caixa/quitacao", CaixaController.quitarFaturado)
routes.post("/caixa/desquitacao", CaixaController.desquitarFaturado)

module.exports = routes
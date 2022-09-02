const routes = require('express').Router()
const CaixaController = require('../controllers/CaixaController')

//----- Categorias ---------//
routes.get('/caixa/categoria', CaixaController.listarCategoria)
routes.get('/caixa/categoria/entrada', CaixaController.listarCategoriaEntrada)
routes.get('/caixa/categoria/saida', CaixaController.listarCategoriaSaida)
routes.post('/caixa/categoria', CaixaController.criarCategoria)
routes.put('/caixa/categoria/:id', CaixaController.alterarCategoria)

// -------  Tipos de Pagamentos ----------  //
routes.get('/caixa/tipopagamento', CaixaController.listarTipoPagamento)
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
routes.get('/caixa', CaixaController.listarCaixaDia)
routes.get('/caixa/:id', CaixaController.abrirUmCaixaDia)
routes.post('/caixa', CaixaController.criarCaixaDia)
routes.put('/caixa/:id', CaixaController.alterarCaixaDia)
routes.delete('/caixa/:id', CaixaController.deletarCaixaDia)
routes.get('/caixa/verificar_caixa_aberto/:usuario_id', CaixaController.verificarCaixaAberto)

module.exports = routes
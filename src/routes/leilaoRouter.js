const routes = require("express").Router()
const LeilaoController = require("../controllers/LeilaoController")

// routes.post("/leilao/configuracao", LeilaoController.editarConfiguracoes)
routes.post("/leilao/configuracao", LeilaoController.cadastrarEditarConfiguracao)

routes.get("/leilao/configuracao", LeilaoController.buscarConfiguracoes)

routes.get("/leilao/laudos", LeilaoController.buscarLaudoLeilao)

routes.get("/leilao/laudos/buscar", LeilaoController.buscarLaudoLeilaoNovoPadrao)

routes.post("/leilao/laudo", LeilaoController.cadastrarLaudoLeilao)

routes.put("/leilao/laudo/:id", LeilaoController.editarLaudoLeilao)

routes.get("/leilao/buscar_tipo_servico", LeilaoController.buscarTipoServicoLeilao)

module.exports = routes

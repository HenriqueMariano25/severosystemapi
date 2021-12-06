const routes = require("express").Router()
const ServicoController = require("../controllers/ServicoController")

routes.post('/servico', ServicoController.cadastrar)

routes.put("/servico/:id", ServicoController.editar)

routes.post("/servico/tipo_servico", ServicoController.cadastrarTipoServico)

routes.put("/servico/tipo_servico/:id", ServicoController.editarTipoServico)

routes.get("/servico/tipos_servico", ServicoController.buscarTipoServico)

routes.delete("/servico/tipo_servico/:id", ServicoController.deletarTipoServico)

routes.delete("/servico/:id", ServicoController.deletar)

routes.get("/servicos", ServicoController.buscarTodos)

routes.get("/servico/:id", ServicoController.buscar)


module.exports = routes
const routes = require("express").Router()
const ServicoController = require("../controllers/ServicoController")

routes.post('/servico', ServicoController.cadastrar)

routes.put("/servico/:id", ServicoController.editar)

routes.delete("/servico/:id", ServicoController.deletar)

routes.get("/servicos", ServicoController.buscarTodos)

routes.get("/servico/:id", ServicoController.buscar)

module.exports = routes
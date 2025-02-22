const routes = require("express").Router()
const ClienteController = require("../controllers/ClienteController")

routes.post('/cliente', ClienteController.cadastrar)

routes.put("/cliente/:id", ClienteController.editar)

routes.delete("/cliente/:id", ClienteController.deletar)

routes.get("/clientes", ClienteController.buscarTodos)

routes.get("/cliente/:id", ClienteController.buscar)

// NOVO PADRAO

routes.get('/clientes/buscar', ClienteController.buscarNovoPadrao)

routes.get("/clientes/simplificado", ClienteController.buscarSimplificado)

module.exports = routes
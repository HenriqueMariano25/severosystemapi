const routes = require("express").Router()
const ClienteController = require("../controllers/ClienteController")

routes.post('/cliente', ClienteController.cadastrar)

routes.put("/cliente/:id", ClienteController.editar)

routes.delete("/cliente/:id", ClienteController.deletar)

routes.get("/clientes", ClienteController.buscar)

routes.get("/cliente/:id", ClienteController.buscarUm)

// NOVO PADRAO

routes.get('/clientes/buscar', ClienteController.buscarNovoPadrao)

routes.get("/clientes/simplificado", ClienteController.buscarSimplificado)

routes.get("/clientes/buscarTodos", ClienteController.buscarTodos)

module.exports = routes
const routes = require("express").Router()
const PlanoController = require("../controllers/PlanoController")

routes.post('/plano', PlanoController.cadastrar)

routes.put("/plano/:id", PlanoController.editar)

routes.delete("/plano/:id", PlanoController.deletar)

routes.get("/planos", PlanoController.buscarTodos)

routes.get("/plano/:id", PlanoController.buscar)

module.exports = routes
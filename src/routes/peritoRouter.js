const routes = require("express").Router()
const PeritoController = require("../controllers/PeritoController")

routes.post('/perito', PeritoController.cadastrar)

routes.put("/perito/:id", PeritoController.editar)

routes.delete("/perito/:id", PeritoController.deletar)

routes.get("/peritos", PeritoController.buscarTodos)

routes.get("/perito/:id", PeritoController.buscar)

module.exports = routes
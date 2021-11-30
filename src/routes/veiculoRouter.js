const routes = require("express").Router()
const VeiculoController = require("../controllers/VeiculoController")

routes.post('/veiculo', VeiculoController.cadastrar)

routes.put("/veiculo/:id", VeiculoController.editar)

routes.delete("/veiculo/:id", VeiculoController.deletar)

routes.get("/veiculos", VeiculoController.buscarTodos)

routes.get("/veiculo/:id", VeiculoController.buscar)

module.exports = routes
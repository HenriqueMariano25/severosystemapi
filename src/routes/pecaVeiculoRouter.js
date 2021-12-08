const routes = require("express").Router()
const PecaVeiculoController = require("../controllers/PecaVeiculoController")

routes.post('/peca_veiculo', PecaVeiculoController.cadastrar)

routes.put("/peca_veiculo/:id", PecaVeiculoController.editar)

routes.delete("/peca_veiculo/:id", PecaVeiculoController.deletar)

routes.get("/pecas_veiculo", PecaVeiculoController.buscarTodos)

routes.get("/peca_veiculo/:id", PecaVeiculoController.buscar)

module.exports = routes
const routes = require("express").Router()
const VeiculoController = require("../controllers/VeiculoController")

routes.post('/veiculo', VeiculoController.cadastrar)

routes.put("/veiculo/:id", VeiculoController.editar)

routes.delete("/veiculo/:id", VeiculoController.deletar)

routes.get("/veiculos", VeiculoController.buscarTodos)

routes.get("/veiculo/tipos_veiculo", VeiculoController.buscarTipoVeiculo)

routes.get("/veiculo/:id", VeiculoController.buscar)

//TIPO VEICULO

routes.post("/veiculo/tipo_veiculo/cadastrar", VeiculoController.cadastrarTipoVeiculo)

routes.put("/veiculo/tipo_veiculo/editar", VeiculoController.editarTipoVeiculo)

routes.get("/veiculo/tipos_veiculo/pecas", VeiculoController.buscarPecasTipoVeiculo)

module.exports = routes
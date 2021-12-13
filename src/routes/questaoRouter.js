const routes = require("express").Router()
const QuestaoController = require("../controllers/QuestaoController")

routes.post('/questao', QuestaoController.cadastrar)

routes.put("/questao/:id", QuestaoController.editar)

routes.delete("/questao/:id", QuestaoController.deletar)

routes.get("/questao/gravidades", QuestaoController.buscarGravidades)

routes.get("/questoes/:tipo_veiculo_id", QuestaoController.buscarTodosPorTipoVeiculo)

routes.get("/questoes", QuestaoController.buscarTodos)

routes.get("/questao/:id", QuestaoController.buscar)

module.exports = routes
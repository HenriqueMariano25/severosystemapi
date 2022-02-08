const routes = require("express").Router()
const LaudoController = require("../controllers/LaudoController")
const multer = require("multer");
const multerConfig = require("../config/multer");

routes.post('/laudo', LaudoController.cadastrar)

routes.put('/laudo/:id/finalizar', LaudoController.finalizar)

routes.put("/laudo/:id/salvar_fotos", multer(multerConfig).array('files', 30), LaudoController.salvarFotos)

routes.put("/laudo/:id/salvar_questoes", LaudoController.salvarQuestoes)

routes.put("/laudo/:id", LaudoController.editar)

routes.get("/laudos", LaudoController.buscarTodos)

routes.get("/laudo/:id", LaudoController.buscar)

routes.delete("/laudo/:id", LaudoController.deletar)

module.exports = routes
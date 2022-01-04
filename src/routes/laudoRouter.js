const routes = require("express").Router()
const LaudoController = require("../controllers/LaudoController")
const multer = require("multer");
const multerConfig = require("../config/multer");

routes.post('/laudo', LaudoController.cadastrar)

routes.put('/laudo/:id/finalizar', LaudoController.finalizar)

routes.put("/laudo/:id", multer(multerConfig).array('files', 4), LaudoController.editar)

routes.get("/laudos", LaudoController.buscarTodos)

routes.get("/laudo/:id", LaudoController.buscar)

module.exports = routes
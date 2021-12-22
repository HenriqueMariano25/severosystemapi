const routes = require("express").Router()
const LaudoController = require("../controllers/LaudoController")
const multer = require("multer");
const multerConfig = require("../config/multer");


routes.post('/laudo', LaudoController.cadastrar)

routes.post('/laudo/:id/finalizar', multer(multerConfig).array('files', 4), LaudoController.finalizar)

// routes.put("/laudo/:id", LaudoController.editar)
//
// routes.delete("/laudo/:id", LaudoController.deletar)
//
routes.get("/laudos", LaudoController.buscarTodos)

routes.get("/laudo/:id", LaudoController.buscar)
//
// routes.get("/laudo/:id", LaudoController.buscar)

module.exports = routes
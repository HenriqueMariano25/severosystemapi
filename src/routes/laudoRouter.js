const routes = require("express").Router()
const LaudoController = require("../controllers/LaudoController")
const multer = require("multer")
const multerConfig = require("../config/multer")

routes.post("/laudo", LaudoController.cadastrar)

routes.put("/laudo/:id/finalizar", LaudoController.finalizar)

routes.put(
  "/laudo/:id/salvar_fotos",
  multer(multerConfig).array("files", 30),
  LaudoController.salvarFotos
)

routes.delete("/laudo/deletar_foto/:id", LaudoController.deletarFoto)

routes.put("/laudo/imagem/editar_peca/:id", LaudoController.editarPecaImagem)

routes.put("/laudo/:id/salvar_questoes", LaudoController.salvarQuestoes)

routes.put("/laudo/:id", LaudoController.editar)

routes.get("/laudos", LaudoController.buscarTodos)

routes.get("/laudos/cliente", LaudoController.buscarTodosCliente)

routes.get("/laudos/cliente/busca", LaudoController.buscarEspecificoCliente)

routes.get("/laudo/:id", LaudoController.buscar)

routes.delete("/laudo/:id", LaudoController.deletar)

routes.get("/laudos/busca", LaudoController.buscarEspecifico)


module.exports = routes

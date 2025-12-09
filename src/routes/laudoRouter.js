const routes = require("express").Router()
const LaudoController = require("../controllers/LaudoController")
const multer = require("multer")
const multerConfig = require("../config/multer")

routes.post("/laudo/cadastrar", LaudoController.cadastrarLaudo)

routes.post("/laudo", LaudoController.cadastrar)

routes.put("/laudo/:id/finalizar", LaudoController.finalizar)

routes.put(
  "/laudo/:id/salvar_fotos",
  multer(multerConfig).array("files", 1),
  LaudoController.salvarFotos
)

routes.put(
    "/laudo/:id/salvar_rascunhos",
    multer(multerConfig).array("files", 30),
    LaudoController.salvarRascunhos
)

routes.delete("/laudo/:id/deletar_rascunho", LaudoController.deletarRascunho)

routes.delete("/laudo/deletar_foto/:id", LaudoController.deletarFoto)

routes.put("/laudo/imagem/editar_peca/:id", LaudoController.editarPecaImagem)

routes.put("/laudo/:id/salvar_questoes", LaudoController.salvarQuestoes)

routes.put("/laudo/:id", LaudoController.editar)

routes.put("/laudo/:id/novo_padrao", LaudoController.editarNovoPadrao)

routes.get("/laudos", LaudoController.buscarTodos)

routes.get("/laudos/buscar", LaudoController.buscarTodosPaginados)

routes.get("/laudos/buscar/cliente", LaudoController.buscarTodosPaginadosCliente)

routes.get("/laudo/buscar/peritos", LaudoController.buscarTodosPaginadosPerito)

routes.get("/laudos/cliente", LaudoController.buscarTodosCliente)

routes.get("/laudos/cliente/busca", LaudoController.buscarEspecificoCliente)

routes.get("/laudo/:id", LaudoController.buscar)

//NOVO
routes.get("/laudo/:id/simplificado", LaudoController.buscarSimplificado)


routes.delete("/laudo/:id", LaudoController.deletar)

routes.get("/laudos/busca", LaudoController.buscarEspecifico)

routes.post("/laudo/perito/processar", LaudoController.processarLaudo)

routes.get("/laudo/buscar/placa/:placa", LaudoController.buscarPorPlaca)

//IMAGEM
routes.get("/laudo/:id/imagens_rascunho", LaudoController.buscarImagensRascunhoLaudoId)

//QUESTOES
routes.get("/laudo/:id/questoes", LaudoController.buscarQuestoesLaudoId)

//RESUMO
// routes.get("/laudo/:id/resumo", LaudoController.buscarResumoLaudoId)

module.exports = routes

const routes = require("express").Router()
const UsuarioController = require("../controllers/UsuarioController")

routes.get("/usuario/login/", UsuarioController.login)

routes.post("/usuario",UsuarioController.cadastrar)

routes.put("/usuario/:id", UsuarioController.editar)

routes.delete("/usuario/:id", UsuarioController.deletar)

routes.get("/usuario/status_usuario", UsuarioController.buscarStatuUsuario)

routes.get("/usuario/tipos_usuario", UsuarioController.buscarTipoUsuario)

routes.get("/usuario/peritos", UsuarioController.buscarPeritos)

routes.get("/usuario/:id", UsuarioController.buscar)

routes.get("/usuarios", UsuarioController.buscarTodos)




module.exports = routes
const routes = require("express").Router()
const UsuarioController = require("../controllers/UsuarioController")

routes.get("/usuario/login/", UsuarioController.login)

routes.post("/usuario",UsuarioController.cadastrar)

routes.put("/usuario", UsuarioController.editar)

routes.delete("/usuario/:id", UsuarioController.deletar)

routes.get("/usuario/:id", UsuarioController.buscar)

routes.get("/usuarios", UsuarioController.buscarTodos)



module.exports = routes
const express = require("express")
const cors = require("cors")
const path = require("path");

class AppController{
    constructor() {
        this.express = express()

        this.middlewares()
        this.routes()
    }

    middlewares(){
        this.express.use(express.json())
        this.express.use(express.urlencoded({ extended: true }))
        this.express.use(cors())
        this.express.use("/files", express.static(path.resolve(__dirname, "..", "tmp", "uploads")));
    }

    routes(){
        this.express.use(require("./routes/clienteRouter"))
        this.express.use(require("./routes/peritoRouter"))
        this.express.use(require("./routes/planoRouter"))
        this.express.use(require("./routes/veiculoRouter"))
        this.express.use(require("./routes/questaoRouter"))
        this.express.use(require("./routes/servicoRouter"))
        this.express.use(require("./routes/pecaVeiculoRouter"))
        this.express.use(require("./routes/laudoRouter"))
        this.express.use(require("./routes/usuarioRouter"))
    }
}

module.exports = new AppController().express

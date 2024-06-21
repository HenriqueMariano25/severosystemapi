const express = require("express")
const cors = require("cors")
const path = require("path")

class AppController {
  constructor() {
    this.express = express()

    this.middlewares()
    this.routes()
  }

  middlewares() {
    this.express.use(express.json({ limit: "500mb" }))
    this.express.use(
      express.urlencoded({ extended: true, parameterLimit: 500000, limit: "500mb" })
    )
    this.express.use(cors())
    this.express.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*")
      this.express.use(cors())
      next()
    })
    this.express.use(
      "/files",
      express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
    )
    this.express.use("/files", express.static(path.resolve(__dirname, "..", "images")))
    // this.express.use('/', (req, res, next)=> {
    //   console.log(req.url)
    //   next()
    // })
  }

  routes() {
    this.express.use(require("./routes/clienteRouter"))
    this.express.use(require("./routes/veiculoRouter"))
    this.express.use(require("./routes/questaoRouter"))
    this.express.use(require("./routes/servicoRouter"))
    this.express.use(require("./routes/pecaVeiculoRouter"))
    this.express.use(require("./routes/laudoRouter"))
    this.express.use(require("./routes/leilaoRouter"))
    this.express.use(require("./routes/caixaRouter"))
    this.express.use(require("./routes/usuarioRouter"))
  }
}

module.exports = new AppController().express

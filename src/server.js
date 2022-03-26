const app = require("./app")

let porta = process.env.PORT || 3000

app.listen(porta, () => {
  console.log(`Aplicação rodando na porta ${porta}`)
})

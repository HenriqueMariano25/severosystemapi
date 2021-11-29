const {factory} = require("factory-girl")
const {Cliente, Usuario, Perito, Plano} = require("../../src/models")
const faker = require("faker")

faker.locale = "pt_BR"

factory.define("Cliente", Cliente, async () => {
    return {
        nome: faker.name.findName(),
        email: faker.internet.email(),
        cpf_cnpj: faker.datatype.number(),
        cnh: faker.datatype.number(),
        telefone: faker.phone.phoneNumberFormat(),
    }
})

factory.define("Usuario", Usuario, async () => {
    return {
        nome: faker.name.findName(),
        senha: faker.internet.password(),
        usuario: faker.internet.domainName(),
    }
})

factory.define("Perito", Perito, async () => {
    return {
        nome: faker.name.findName(),
    }
})

factory.define("Plano", Plano, async () => {
    return {
        descricao: faker.company.bs(),
        valor: faker.finance.amount()
    }
})

module.exports = factory
const {factory} = require("factory-girl")
const { Cliente } = require("../../src/models")
const faker = require("faker")

faker.locale = "pt_BR"

factory.define("Cliente", Cliente, async () =>{
    return {
        nome: faker.name.findName(),
        email: faker.internet.email(),
        cpf_cnpj: faker.datatype.number(),
        cnh: faker.datatype.number(),
        telefone: faker.phone.phoneNumberFormat(),
    }
})

module.exports = factory
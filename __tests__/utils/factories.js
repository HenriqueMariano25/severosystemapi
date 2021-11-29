const {factory} = require("factory-girl")
const { Cliente, Usuario, Perito } = require("../../src/models")
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

factory.define("Usuario", Usuario, async () => {
    return {
        nome: faker.name.findName(),
        senha: faker.internet.password(),
        usuario: faker.internet.domainName(),
    }
})

factory.define("Perito", Perito, async () =>{
    return {
        nome: faker.name.findName(),
    }
})

module.exports = factory
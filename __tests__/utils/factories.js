const {factory} = require("factory-girl")
const {Cliente, Usuario, Perito, Plano, Veiculo, StatuUsuario} = require("../../src/models")
const faker = require("faker")

faker.locale = "pt_BR"

factory.define("Cliente", Cliente, async () => {
    return {
        nome_razao_social: faker.name.findName(),
        email: faker.internet.email(),
        cpf_cnpj: faker.datatype.number(),
        cnh: faker.datatype.number(),
        telefone: faker.phone.phoneNumberFormat(),
        rua: faker.address.streetName(),
        cidade: faker.address.cityName(),
        bairro: faker.address.cityName(),
        numero: faker.datatype.number(),
        uf: faker.address.stateAbbr(),
        cep: faker.address.zipCode(),
        complemento: faker.address.secondaryAddress()
    }
})

factory.define("StatuUsuario", StatuUsuario, async () => {
    return {
        descricao: "Ativo"
    }
})

factory.define("Usuario", Usuario, async () => {
    let statuUsuario = await factory.create('StatuUsuario')

    return {
        nome: faker.name.findName(),
        senha: faker.internet.password(),
        usuario: faker.internet.domainName(),
        cargo: 'Gerente',
        data_admissao: '10/10/2010',
        statu_usuario_id: statuUsuario.id
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

factory.define("Veiculo", Veiculo, async () => {
    return {
        placa: faker.vehicle.vrm(),
        ano: faker.datatype.number(),
        marca_modelo: faker.vehicle.vehicle(),
        hodometro: faker.vehicle.vin(),
        chassi_bin: faker.vehicle.vin(),
        chassi_atual: faker.vehicle.vin(),
        motor_bin: faker.vehicle.vin(),
        motor_atual: faker.vehicle.vin(),
        cidade: faker.address.cityName(),
        cor_bin: faker.vehicle.color(),
        cor_atual: faker.vehicle.color(),
        uf: faker.address.stateAbbr(),
        combustivel: faker.vehicle.fuel(),
        renavam: faker.vehicle.vin()
    }
})

module.exports = factory
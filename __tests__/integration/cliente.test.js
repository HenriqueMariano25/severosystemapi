const request = require("supertest")
const app = require("../../src/app")
const truncate = require("../utils/truncate")
const factory = require("../utils/factories")
const faker = require("faker")

faker.locale = "pt_BR"

describe("CRUD", () => {
    beforeEach(async () => {
        await truncate()
    })

    it("deve cadastrar um novo cliente", async () => {

        const resposta = await request(app)
            .post("/cliente")
            .send({
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
            })

        expect(resposta.status).toBe(200)
    })

    it("não deve cadastrar com dados obrigatorios faltando", async () => {
        const resposta = await request(app)
            .post("/cliente")
            .send({})

        expect(resposta.status).toBe(400)
    })

    it("deve editar um cliente já criado", async () => {
        const cliente = await factory.create("Cliente")

        const resposta = await request(app)
            .put(`/cliente/${cliente.id}`)
            .send({
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
            })

        expect(resposta.status).toBe(200)
    })

    it("deve deletar um cliente já criado", async () => {
        const cliente = await factory.create("Cliente")

        const resposta = await request(app)
            .delete(`/cliente/${cliente.id}`)

        expect(resposta.status).toBe(200)
    })

    it("deve buscar todos os clientes", async()=> {
        const resposta = await request(app)
            .get("/clientes")

        expect(resposta.status).toBe(200)
    })

    it("deve buscar os dados de um cliente", async()=> {
        const cliente = await factory.create("Cliente")

        const resposta = await request(app)
            .get(`/cliente/${cliente.id}`)

        expect(resposta.status).toBe(200)
    })
})
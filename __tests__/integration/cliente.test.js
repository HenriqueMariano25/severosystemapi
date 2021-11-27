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
                nome: "Mesa",
                email: "teste@teste.com",
                cpf_cnpj: '123456789',
                cnh: '123456789',
                telefone: "22992299229",
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
                nome: faker.name.findName(),
                email: faker.internet.email(),
                cpf_cnpj: faker.datatype.number(),
                cnh: faker.datatype.number(),
                telefone: faker.phone.phoneNumberFormat(),
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
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

    it("deve cadastrar um novo plano", async () => {

        const resposta = await request(app)
            .post("/plano")
            .send({
                descricao: faker.company.bs(),
                valor: faker.finance.amount()
            })

        expect(resposta.status).toBe(200)
    })

    it("não deve cadastrar com dados obrigatorios faltando", async () => {
        const resposta = await request(app)
            .post("/plano")
            .send({})

        expect(resposta.status).toBe(400)
    })

    it("deve editar um plano já criado", async () => {
        const plano = await factory.create("Plano")

        const resposta = await request(app)
            .put(`/plano/${plano.id}`)
            .send({
                descricao: faker.company.bs(),
                valor: faker.finance.amount()
            })

        expect(resposta.status).toBe(200)
    })

    it("deve deletar um plano já criado", async () => {
        const plano = await factory.create("Plano")

        const resposta = await request(app)
            .delete(`/plano/${plano.id}`)

        expect(resposta.status).toBe(200)
    })

    it("deve buscar todos os planos", async()=> {
        await factory.create("Plano")
        await factory.create("Plano")

        const resposta = await request(app)
            .get("/planos")

        expect(resposta.status).toBe(200)
    })

    it("deve buscar os dados de um plano", async()=> {
        const plano = await factory.create("Plano")

        const resposta = await request(app)
            .get(`/plano/${plano.id}`)

        expect(resposta.status).toBe(200)
    })
})
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

    it("deve cadastrar um novo servico", async () => {
        const tipoServico = await factory.create('TipoServico')

        const resposta = await request(app)
            .post("/servico")
            .send({
                tipo_servico_id: tipoServico.id,
                valor: faker.finance.amount()
            })

        expect(resposta.status).toBe(200)
    })

    it("não deve cadastrar com dados obrigatorios faltando", async () => {
        const resposta = await request(app)
            .post("/servico")
            .send({})

        expect(resposta.status).toBe(400)
    })

    it("deve editar um servico já criado", async () => {
        const servico = await factory.create("Servico")

        const resposta = await request(app)
            .put(`/servico/${servico.id}`)
            .send({
                valor: faker.finance.amount()
            })

        expect(resposta.status).toBe(200)
    })

    it("deve deletar um servico já criado", async () => {
        const servico = await factory.create("Servico")

        const resposta = await request(app)
            .delete(`/servico/${servico.id}`)

        expect(resposta.status).toBe(200)
    })

    it("deve buscar todos os servico", async()=> {
        await factory.create("Servico")
        await factory.create("Servico")

        const resposta = await request(app)
            .get("/servicos")

        expect(resposta.status).toBe(200)
    })

    it("deve buscar os dados de um servico", async()=> {
        const servico = await factory.create("Servico")

        const resposta = await request(app)
            .get(`/servico/${servico.id}`)

        expect(resposta.status).toBe(200)
    })
})
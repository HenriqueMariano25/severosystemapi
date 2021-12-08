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

    it("deve cadastrar uma nova peça", async () => {

        const resposta = await request(app)
            .post("/peca_veiculo")
            .send({
                descricao: 'Frente'
            })

        expect(resposta.status).toBe(200)
    })

    it("não deve cadastrar com dados obrigatorios faltando", async () => {
        const resposta = await request(app)
            .post("/peca_veiculo")
            .send({})

        expect(resposta.status).toBe(400)
    })

    it("deve editar uma peça já criado", async () => {
        const pecaVeiculo = await factory.create("PecaVeiculo")

        const resposta = await request(app)
            .put(`/peca_veiculo/${pecaVeiculo.id}`)
            .send({
                descricao: 'Chassi'
            })

        expect(resposta.status).toBe(200)
    })

    it("deve deletar uma peça já criado", async () => {
        const pecaVeiculo = await factory.create("PecaVeiculo")

        const resposta = await request(app)
            .delete(`/peca_veiculo/${pecaVeiculo.id}`)

        expect(resposta.status).toBe(200)
    })

    it("deve buscar todos as questoes", async()=> {
        await factory.create("PecaVeiculo")
        await factory.create("PecaVeiculo")

        const resposta = await request(app)
            .get("/pecas_veiculo")

        expect(resposta.status).toBe(200)
    })

    it("deve buscar os dados de uma peça", async()=> {
        const pecaVeiculo = await factory.create("PecaVeiculo")

        const resposta = await request(app)
            .get(`/peca_veiculo/${pecaVeiculo.id}`)

        expect(resposta.status).toBe(200)
    })
})
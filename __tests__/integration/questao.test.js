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

    it("deve cadastrar uma nova questao", async () => {
        const gravidade = await factory.create('Gravidade')
        const tipoVeiculo = await factory.create('TipoVeiculo')

        const resposta = await request(app)
            .post("/questao")
            .send({
                titulo: faker.vehicle.vrm(),
                componente: 'Vidro',
                situacao_observada: 'Vidro quebrado',
                gravidade_id: gravidade.id,
                tipo_veiculo_id: tipoVeiculo.id,
            })

        expect(resposta.status).toBe(200)
    })

    it("não deve cadastrar com dados obrigatorios faltando", async () => {
        const resposta = await request(app)
            .post("/questao")
            .send({})

        expect(resposta.status).toBe(400)
    })

    it("deve editar uma questao já criado", async () => {
        const questao = await factory.create("Questao")

        const resposta = await request(app)
            .put(`/questao/${questao.id}`)
            .send({
                titulo: faker.vehicle.vrm(),
                componente: 'Vidro',
                situacao_observada: 'Vidro quebrado',
            })

        expect(resposta.status).toBe(200)
    })

    it("deve deletar uma questao já criado", async () => {
        const questao = await factory.create("Questao")

        const resposta = await request(app)
            .delete(`/questao/${questao.id}`)

        expect(resposta.status).toBe(200)
    })

    it("deve buscar todos as questoes", async()=> {
        await factory.create("Questao")
        await factory.create("Questao")

        const resposta = await request(app)
            .get("/questoes")

        expect(resposta.status).toBe(200)
    })

    it("deve buscar os dados de uma questao", async()=> {
        const questao = await factory.create("Questao")

        const resposta = await request(app)
            .get(`/questao/${questao.id}`)

        expect(resposta.status).toBe(200)
    })
})
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

    it("deve cadastrar um novo perito", async () => {

        const resposta = await request(app)
            .post("/perito")
            .send({
                nome: faker.name.findName(),
            })

        expect(resposta.status).toBe(200)
    })

    it("não deve cadastrar com dados obrigatorios faltando", async () => {
        const resposta = await request(app)
            .post("/perito")
            .send({})

        expect(resposta.status).toBe(400)
    })

    it("deve editar um perito já criado", async () => {
        const perito = await factory.create("Perito")

        const resposta = await request(app)
            .put(`/perito/${perito.id}`)
            .send({
                nome: faker.name.findName(),
            })

        expect(resposta.status).toBe(200)
    })

    it("deve deletar um perito já criado", async () => {
        const perito = await factory.create("Perito")

        const resposta = await request(app)
            .delete(`/perito/${perito.id}`)

        expect(resposta.status).toBe(200)
    })

    it("deve buscar todos os peritos", async()=> {
        const resposta = await request(app)
            .get("/peritos")

        expect(resposta.status).toBe(200)
    })

    it("deve buscar os dados de um perito", async()=> {
        const perito = await factory.create("Perito")

        const resposta = await request(app)
            .get(`/perito/${perito.id}`)

        expect(resposta.status).toBe(200)
    })
})
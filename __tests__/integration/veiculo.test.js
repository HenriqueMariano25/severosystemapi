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

    it("deve cadastrar um novo veiculo", async () => {

        const resposta = await request(app)
            .post("/veiculo")
            .send({
                placa: faker.vehicle.vrm(),
                hodometro: faker.vehicle.vin(),
                ano: faker.datatype.number(),
                marca_modelo: faker.vehicle.vehicle(),
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
            })

        expect(resposta.status).toBe(200)
    })

    it("não deve cadastrar com dados obrigatorios faltando", async () => {
        const resposta = await request(app)
            .post("/veiculo")
            .send({})

        expect(resposta.status).toBe(400)
    })

    it("deve editar um veiculo já criado", async () => {
        const veiculo = await factory.create("Veiculo")

        const resposta = await request(app)
            .put(`/veiculo/${veiculo.id}`)
            .send({
                placa: faker.vehicle.vrm(),
                ano: faker.datatype.number(),
                marca_modelo: faker.vehicle.vehicle(),
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
            })

        expect(resposta.status).toBe(200)
    })

    it("deve deletar um veiculo já criado", async () => {
        const veiculo = await factory.create("Veiculo")

        const resposta = await request(app)
            .delete(`/veiculo/${veiculo.id}`)

        expect(resposta.status).toBe(200)
    })

    it("deve buscar todos os veiculos", async()=> {
        const resposta = await request(app)
            .get("/veiculos")

        expect(resposta.status).toBe(200)
    })

    it("deve buscar os dados de um veiculo", async()=> {
        const veiculo = await factory.create("Veiculo")

        const resposta = await request(app)
            .get(`/veiculo/${veiculo.id}`)

        expect(resposta.status).toBe(200)
    })
})
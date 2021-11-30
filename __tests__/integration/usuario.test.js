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

    it("deve criar usuario com dados válidos", async () => {
        let statuUsuario = await factory.create('StatuUsuario')

        const resposta = await request(app)
            .post("/usuario")
            .send({
                nome: faker.name.findName(),
                senha: faker.internet.password(),
                usuario: faker.internet.domainName(),
                cargo: 'Gerente',
                data_admissao: '10/10/2010',
                statu_usuario_id: statuUsuario.id
            })

        expect(resposta.status).toBe(200)
    })

    it("não deve criar usuario com dados inválidos", async () => {
        const resposta = await request(app)
            .post("/usuario")
            .send({
                nome: faker.name.findName(),
                senha: faker.internet.password(),
                usuario: "",
            })

        expect(resposta.status).toBe(400)
    })

    it("não deve criar usuario com usuário duplicado", async () => {
        await factory.create("Usuario", { usuario: "usuario.novo"})

        const resposta = await request(app)
            .post("/usuario")
            .send({
                nome: faker.name.findName(),
                senha: faker.internet.password(),
                usuario: "usuario.novo",
            })

        expect(resposta.status).toBe(400)
    })

    it("deve editar um usuario já criado", async () => {
        const usuario = await factory.create("Usuario")
        let statuUsuario = await factory.create('StatuUsuario')

        const resposta = await request(app)
            .put(`/usuario/${usuario.id}`)
            .send({
                nome: faker.name.findName(),
                usuario: faker.internet.domainName(),
                cargo: 'Gerente',
                data_admissao: '10/10/2010',
                statu_usuario_id: statuUsuario.id
            })
            .set("Authorization", `Bearer ${usuario.gerarToken()}`)

        expect(resposta.status).toBe(200)
    })

    it("deve deletar um usuario já criado", async () => {
        const usuario = await factory.create("Usuario")

        const resposta = await request(app)
            .delete(`/usuario/${usuario.id}`)
            .set("Authorization", `Bearer ${usuario.gerarToken()}`)

        expect(resposta.status).toBe(200)
    })

    it("deve buscar dados do usuário", async () => {
        const usuario = await factory.create("Usuario")

        const resposta = await request(app)
            .get(`/usuario/${usuario.id}`)
            .set("Authorization", `Bearer ${usuario.gerarToken()}`)

        expect(resposta.status).toBe(200)
    })

})

describe("Autenticacao", () => {
    beforeEach(async () =>{
        await truncate()
    })

    it("deve fazer o login", async () => {
        const usuario = await factory.create("Usuario", {senha: "123456"})

        const resposta = await request(app)
            .get("/usuario/login/")
            .query({ usuario: usuario.usuario, senha: "123456"})


        expect(resposta.status).toBe(200)
    })

    it("não deve fazer o login com senha incorreta", async () => {
        const usuario = await factory.create("Usuario", {senha: "12345"})

        const resposta = await request(app)
            .get("/usuario/login/")
            .query({ usuario: usuario.usuario, senha: "123456"})


        expect(resposta.status).toBe(401)
    })
})
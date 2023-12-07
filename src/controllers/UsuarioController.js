const { Usuario, StatuUsuario, TipoUsuario, ClienteUsuario, Cliente, CaixaDia } = require("../models")
const { Op } = require("sequelize")
const Sequelize = require("sequelize")
const jwt = require("jsonwebtoken")

class UsuarioController {
  async cadastrar(req, res) {
    const {
      nome,
      senha,
      usuario: novoUsuario,
      cargo,
      data_admissao,
      statu_usuario_id,
      tipo_usuario_id,
      perito,
      perito_auxiliar,
      cliente,
    } = req.body

    if (!nome || !senha || !novoUsuario || !cargo || !data_admissao || !tipo_usuario_id)
      return res.status(400).json({ message: "Dados faltando para realizar o cadastro!" })

    const usuarioCriado = await Usuario.findOne({ where: { usuario: novoUsuario } })

    if (usuarioCriado)
      return res.status(400).json({ message: "Usuário ou email já utilizado" })

    const usuario = await Usuario.create({
      nome,
      senha,
      usuario: novoUsuario,
      cargo,
      data_admissao,
      statu_usuario_id,
      tipo_usuario_id,
      perito,
      perito_auxiliar,
    })

    if (tipo_usuario_id === 5) {
      await ClienteUsuario.create({ cliente_id: cliente.id, usuario_id: usuario.id })
    }

    return res.status(200).json({ usuario })
  }

  async editar(req, res) {
    const {
      nome,
      usuario: novoUsuario,
      cargo,
      data_admissao,
      statu_usuario_id,
      tipo_usuario_id,
      perito,
      perito_auxiliar,
        senha,
      cliente,
    } = req.body

    const { id } = req.params

    const usuario = await Usuario.findOne({ where: { id } })

    if (!usuario) return res.status(400).json({ message: "Usuário não encontrado" })

    await usuario.update({
      nome,
      usuario: novoUsuario,
      cargo,
      data_admissao,
      statu_usuario_id,
      tipo_usuario_id,
      perito,
      perito_auxiliar,
      senha
    })

    const [ clienteEncontrado, created ] = await ClienteUsuario.findOrCreate({
      where: { usuario_id: usuario.id },
      defaults:{
        cliente_id: cliente.id, usuario_id: usuario.id
      }
    })

    if(!created){
      await ClienteUsuario.update({ cliente_id: cliente.id}, { where: { id: clienteEncontrado.id }})
    }


    return res.status(200).json({ usuario })
  }

  async deletar(req, res) {
    const { id } = req.params

    const usuario = await Usuario.findOne({ where: { id } })

    if (!usuario) return res.status(400).json({ message: "Usuário não encontrado" })

    await usuario.destroy()

    return res.status(200).json({ usuario })
  }

  async buscar(req, res) {
    const { id } = req.params

    const usuario = await Usuario.findOne({ where: { id },
      attributes: { exclude: ['createdAt', 'updatedAd', 'deletedAt']},
      include: [
        { model: Cliente, attributes: ['id', 'nome_razao_social'] }
      ]
    })

    if (!usuario) return res.status(400).json({ message: "Usuário não encontrado" })

    return res.status(200).json({ usuario })
  }

  async buscarTodos(req, res) {
    let usuarios = await Usuario.findAll({
      attributes:['id', 'nome','cargo', 'usuario'],
      include: [
        { model: TipoUsuario, attributes: ['id', 'descricao']}
      ]
    })

    return res.status(200).json({ usuarios: usuarios })
  }

  async buscarStatuUsuario(req, res) {
    let statusUsuario = await StatuUsuario.findAll()

    return res.status(200).json({ statusUsuario: statusUsuario })
  }

  async buscarTipoUsuario(req, res) {
    let tiposUsuario = await TipoUsuario.findAll({ order: ["descricao"] })

    return res.status(200).json({ tiposUsuario: tiposUsuario })
  }

  async buscarPeritos(req, res) {
    let peritos = await Usuario.findAll({ order: ["nome"], where: { perito: true } })

    let peritosAuxiliar = await Usuario.findAll({
      order: ["nome"],
      where: { perito_auxiliar: true },
    })

    let digitadores = await Usuario.findAll({
      order: ["nome"],
      where: Sequelize.where(
        Sequelize.fn("lower", Sequelize.col("cargo")),
        Sequelize.fn("lower", "digitador")
      ),
    })

    return res.status(200).json({
      peritos: peritos,
      peritosAuxiliar: peritosAuxiliar,
      digitadores: digitadores,
    })
  }

  async login(req, res) {
    const { usuario: usuarioCriado, senha } = req.query

    const usuario = await Usuario.findOne({
      where: { usuario: usuarioCriado },
    })

    let clienteVinculado
    if (usuario) {
      clienteVinculado = await ClienteUsuario.findOne({
        where: { usuario_id: usuario.id },
      })
    }

    if (!usuario)
      return res
        .status(401)
        .json({ message: "Usuário não encontrado", type: "invalid_data" })

    if (!(await usuario.verificarSenha(senha))) {
      return res.status(401).json({ message: "Senha incorreta", type: "invalid_data" })
    }

    const token = usuario.gerarToken()

    return res.status(200).json({
      usuario: usuario,
      Authorization: token,
      clienteVinculado: clienteVinculado,
    })
  }

  async alterarSenha(req, res) {
    let { senhaAtual, novaSenha, usuarioId } = req.body

    const usuario = await Usuario.findOne({
      where: { id: usuarioId },
    })

    if (!(await usuario.verificarSenha(senhaAtual))) {
      return res.status(401).json({ message: "Senha incorreta", type: "invalid_data" })
    }

    await usuario.update({ senha: novaSenha })

    return res.status(200).json({ usuario })
  }


  async loginNovoPadrao(req, res) {
    const {usuario: usuarioCriado, senha} = req.body

    const usuario = await Usuario.findOne({
      where: {usuario: usuarioCriado},
    })

    if (!usuario)
      return res
          .status(401)
          .json({message: "Usuário não encontrado", type: "invalid_data"})

    if (!(await usuario.verificarSenha(senha))) {
      return res.status(401).json({message: "Senha incorreta", type: "invalid_data"})
    }

    const token = usuario.gerarToken()

    return res.status(200).json({
      token: token,
    })
  }

  async buscarLogin(req, res) {
    const token = req.body.token || req.query.token || req.headers["authorization"].split(" ")[1]


    if (!token) {
      return res.status(403).send("A token is required for authentication")
    }
    try {
      const decoded = jwt.verify(token, process.env.APP_SECRET)

      req.user = decoded
      let usuario = await Usuario.findOne({
        where: {id: req.user.id},
        attributes: {exclude: ["senha_hash", "createdAt", "updatedAt", "deletedAt"]},
      }).then((data) => {
        return data.get({plain: true})
      })

      let caixaAberto = await CaixaDia.findAll({ where: { usuario_id: usuario.id, status_caixa: 'Aberto'}, order: ['id']})
      usuario['caixa'] = caixaAberto.length > 0 ? caixaAberto[0] : null



      return res.status(200).json(usuario)
    } catch (err) {
      return res.status(401).send("Invalid Token")
    }
  }
}

module.exports = new UsuarioController()

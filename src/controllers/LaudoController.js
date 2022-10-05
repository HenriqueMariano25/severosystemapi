const {
  Cliente,
  Veiculo,
  Laudo,
  LaudoQuestao,
  ImagemLaudo,
  StatusLaudo,
  Questao,
  TipoVeiculo,
  Usuario,
  Gravidade,
  TipoServico,
  CaixaLancamento
} = require("../models")
const dayjs = require("dayjs")
const path = require("path")
const sharp = require("sharp")
const aws = require("aws-sdk")
const fs = require("fs")
const { Op, Sequelize } = require("sequelize")

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_DEFAULT_REGION } = process.env

const sharpify = async (originalFile) => {
  try {
    const image = sharp(originalFile.buffer)
    const meta = await image.metadata()
    const { format } = meta
    const config = {
      jpeg: { quality: 80 },
      webp: { quality: 80 },
      png: { quality: 80 },
    }
    return await image[format](config[format])
    // .resize({width: 1000, withoutEnlargement: true})
  } catch (err) {
    throw new Error(err)
  }
}

const uploadToAWS = (props) => {
  return new Promise((resolve, reject) => {
    const s3 = new aws.S3({
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      region: AWS_DEFAULT_REGION,
    })
    s3.upload(props, (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })
}

class LaudoController {
  async cadastrar(req, res) {
    let { tipo_servico_id } = req.body

    let {
      placa,
      ano,
      hodometro,
      uf,
      cidade,
      marca_modelo,
      chassi_bin,
      chassi_atual,
      motor_bin,
      motor_atual,
      cor_bin,
      cor_atual,
      combustivel,
      renavam,
      cambio_bin,
      cambio_atual,
      crlv,
      tipo_lacre,
      lacre,
    } = req.body.veiculo

    let { id: veiculo_id } = await Veiculo.create({
      placa,
      ano,
      hodometro,
      uf,
      cidade,
      marca_modelo,
      chassi_bin,
      chassi_atual,
      motor_bin,
      motor_atual,
      cor_bin,
      cor_atual,
      combustivel,
      renavam,
      cambio_bin,
      cambio_atual,
      crlv,
      tipo_lacre,
      lacre,
      tipo_veiculo_id: req.body.veiculo.tipo_veiculo.id,
    })

    let {
      nome_razao_social: prop_nome,
      cpf_cnpj: prop_cpf_cnpj,
      cnh: prop_cnh,
      telefone: prop_telefone,
      email: prop_email,
    } = req.body.proprietario

    let { id: cliente_id } = req.body.cliente

    try {
      let laudoCriado = await Laudo.create({
        cliente_id,
        prop_nome,
        prop_cpf_cnpj,
        prop_cnh,
        prop_telefone,
        prop_email,
        veiculo_id,
        status_laudo_id: 1,
        tipo_servico_id,
      })

      let laudo = await Laudo.findOne({
        where: { id: laudoCriado.id },
        include: [
          { model: Cliente },
          { model: Questao, include: { model: Gravidade, attributes: ["cor", "icone"] } },
          { model: Usuario, as: "perito" },
          {
            model: Usuario,
            as: "perito_auxiliar",
          },
          {
            model: Usuario,
            as: "digitador",
            attributes: ["nome", "id"],
          },
          {
            model: ImagemLaudo,
            attributes: ["peca_veiculo", "url", "id"],
          },
          {
            model: Veiculo,
            include: { model: TipoVeiculo, attributes: ["descricao"] },
          },
          {
            model: StatusLaudo,
            attributes: ["id", "descricao"],
          },
          {
            model: TipoServico,
            attributes: ["descricao"],
          },
        ],
      })

      return res.status(200).json({ veiculo_id, laudo })
    } catch (e) {
      console.log(e)
      return res.status(400).json({ mensagem: "Erro ao cadastrar laudo" })
    }
  }

  async salvarFotos(req, res) {
    let dados = JSON.parse(req.body.data)

    let { laudo_id } = dados
    let imgs = dados.imgs
    let resumo = dados.resumo

    if (resumo.perito_auxiliar) {
      let perito_auxiliar_id = resumo.perito_auxiliar
      await Laudo.update(
        { perito_auxiliar_id },
        {
          where: {
            id: laudo_id,
          },
        }
      )
    }

    const files = req.files

    let imgsRetornadas = []

    for (let key in files) {
      let peca_veiculo = dados.imgs[key].nome
      let nomeFormatado = `${dayjs().format("DDMMYYYYHHmmssSSS")}-${files[key].originalname
        }`
      let url = ""
      let nome = nomeFormatado

      //   const originalFile = files[key]

      //     const newFile = await sharpify(originalFile)

      //     let data = await uploadToAWS({
      //       Body: newFile,
      //       ACL: "public-read",
      //       Bucket: process.env.BUCKET_NAME,
      //       ContentType: originalFile.mimetype,
      //       Key: `${nomeFormatado}`,
      //     })
      //     url = data["Location"]
      //     nome = data["Key"]

      if (process.env.STORAGE_TYPE === "production") {
        await sharp(files[key].buffer).toFile(path.resolve("../images", nomeFormatado))
      } else if (process.env.STORAGE_TYPE === "local") {
        await sharp(files[key].buffer).toFile(path.resolve("tmp/uploads/", nomeFormatado))
      }

      // if (!url) {
      //   url = `${req.protocol}://${req.get("host")}/files/${nome}`
      // }
      url = `${req.protocol}://35.209.211.222/api/files/${nome}`
      try {
        let img = await ImagemLaudo.create({
          url,
          nome: nome,
          laudo_id,
          peca_veiculo,
          peca_veiculo_id: 1,
        })
        imgsRetornadas.push({ img, index: imgs[key].index })
      } catch (e) {
        console.log(e)
      }
    }

    return res.json({ imgs: imgsRetornadas })
  }

  async deletarFoto(req, res) {
    let { id } = req.params
    if (id) {
      let img = await ImagemLaudo.findOne({ where: { id } })

      // const s3 = new aws.S3({
      //     accessKeyId: AWS_ACCESS_KEY_ID,
      //     secretAccessKey: AWS_SECRET_ACCESS_KEY,
      //     region: AWS_DEFAULT_REGION
      // })
      // s3.deleteObject({
      //     Bucket: process.env.BUCKET_NAME,
      //     Key: img.nome
      // })

      if (process.env.STORAGE_TYPE === "production") {
        fs.unlink(
          path.resolve(__dirname, "..", "..", "..", "images", img.nome),
          function (err) {
            if (err) throw err
          }
        )
      } else {
        fs.unlink(
          path.resolve(__dirname, "..", "..", "tmp", "uploads", img.nome),
          function (err) {
            if (err) throw err
          }
        )
      }

      await ImagemLaudo.destroy({ where: { id } })

      return res.status(200).json({ img: img })
    } else {
      return res.status(400).json({ mensagem: "Erro ao remover imagem" })
    }
  }

  async editarPecaImagem(req, res) {
    let { id } = req.params
    let { peca_id } = req.body
    let img = await ImagemLaudo.update(
      { peca_veiculo_id: peca_id },
      { where: { id }, returning: true }
    )
    return res.status(200).json({ img: img[1][0] })
  }

  async salvarQuestoes(req, res) {
    let { questoes, resumo } = req.body
    let { id: laudo_id } = req.params

    if (resumo.digitador) {
      let digitador_id = resumo.digitador
      await Laudo.update(
        { digitador_id },
        {
          where: {
            id: laudo_id,
          },
        }
      )
    }

    let id_questoes = []
    for (let key in questoes) {
      if (questoes[key]["LaudoQuestao"] === undefined) {
        let { id } = await LaudoQuestao.create({ laudo_id, questao_id: questoes[key].id })
        id_questoes.push(id)
      } else {
        id_questoes.push(questoes[key]["LaudoQuestao"]["id"])
      }
    }

    await LaudoQuestao.destroy({
      where: { [Op.and]: [{ id: { [Op.not]: id_questoes } }, { laudo_id: laudo_id }] },
    })

    return res.json({ menssagem: "Questões salvar com sucesso" })
  }

  async editar(req, res) {
    let { cliente, proprietario, veiculo, resumo } = req.body
    let { id: laudo_id } = req.params

    try {
      let {
        placa,
        ano,
        hodometro,
        uf,
        cidade,
        marca_modelo,
        chassi_bin,
        chassi_atual,
        motor_bin,
        motor_atual,
        cor_bin,
        cor_atual,
        combustivel,
        renavam,
        cambio_bin,
        cambio_atual,
        crlv,
        tipo_lacre,
        lacre,
      } = veiculo

      let { id: veiculo_id } = await Veiculo.update(
        {
          placa,
          ano,
          hodometro,
          uf,
          cidade,
          marca_modelo,
          chassi_bin,
          chassi_atual,
          motor_bin,
          motor_atual,
          cor_bin,
          cor_atual,
          combustivel,
          renavam,
          cambio_bin,
          cambio_atual,
          crlv,
          tipo_lacre,
          lacre,
          tipo_veiculo_id: veiculo.tipo_veiculo.id,
        },
        { where: { id: veiculo.id } }
      )
      let {
        nome_razao_social: prop_nome,
        cpf_cnpj: prop_cpf_cnpj,
        cnh: prop_cnh,
        telefone: prop_telefone,
        email: prop_email,
      } = proprietario

      let {
        situacao,
        observacao,
        perito: perito_id,
        perito_auxiliar: perito_auxiliar_id,
        digitador: digitador_id,
      } = resumo

      let { id: cliente_id } = cliente

      let laudo
      await Laudo.update(
        {
          cliente_id,
          prop_nome,
          prop_cpf_cnpj,
          prop_cnh,
          prop_telefone,
          prop_email,
          veiculo_id,
          situacao,
          observacao,
          perito_id,
          perito_auxiliar_id,
          digitador_id,
        },
        {
          returning: true,
          where: {
            id: laudo_id,
          },
        }
      ).then((result) => {
        laudo = result[1]
      })
      return await res.status(200).json({ laudo: laudo })
    } catch (e) {
      console.log(e)
      return res.status(400).json({ mensagem: "Erro ao editar laudo" })
    }
  }

  async finalizar(req, res) {
    let { id } = req.params

    let laudo = await Laudo.update(
      {
        status_laudo_id: 3,
      },
      { where: { id: id } }
    )

    return res.status(200).json({ laudo })
  }

  // async buscarTodos(req, res) {
  //   let laudos = await Laudo.findAll({
  //     where: {
  //       tipo_servico_id: { [Op.not]: [3] },
  //     },
  //     include: [
  //       {
  //         model: Veiculo,
  //         include: [{ model: TipoVeiculo, attributes: ["descricao"] }],
  //         attributes: { exclude: ["createdAt", "updatedAt"] },
  //       },
  //       {
  //         model: Cliente,
  //         attributes: { exclude: ["createdAt", "updatedAt"] },
  //       },
  //       {
  //         model: StatusLaudo,
  //         attributes: ["id", "descricao"],
  //       },
  //       {
  //         model: Usuario,
  //         as: "perito",
  //         attributes: ["nome"],
  //       },
  //       {
  //         model: Usuario,
  //         as: "perito_auxiliar",
  //         attributes: ["nome"],
  //       },
  //       {
  //         model: Usuario,
  //         as: "digitador",
  //         attributes: ["nome"],
  //       },
  //     ],
  //     order: [["id", "DESC"]],
  //   })
  //
  //   return res.status(200).json({ laudos: laudos })
  // }

  async buscarTodosCliente(req, res) {
    let { cliente_id, page, size } = req.query

    let laudos = await Laudo.findAndCountAll({
      where: {
        cliente_id: cliente_id,
      },
      limit: size,
      offset: page * size,
      include: [
        {
          model: Veiculo,
          include: [{ model: TipoVeiculo, attributes: ["descricao"] }],
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: Cliente,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: StatusLaudo,
          attributes: ["id", "descricao"],
        },
        {
          model: Usuario,
          as: "perito",
          attributes: ["nome"],
        },
        {
          model: Usuario,
          as: "perito_auxiliar",
          attributes: ["nome"],
        },
        {
          model: Usuario,
          as: "digitador",
          attributes: ["nome"],
        },
      ],
      order: [["id", "DESC"]],
    })

    return res.status(200).json({ laudos: laudos })
  }

  async buscarEspecificoCliente(req, res) {
    let { cliente_id, busca } = req.query

    try {
      const laudos = await Laudo.findAndCountAll({
        where: {
          cliente_id: cliente_id,
          [Op.or]: [
            { '$Veiculo.placa$': { [Op.like]: '%' + busca + '%' } },
            { '$Veiculo.marca_modelo$': { [Op.like]: '%' + busca + '%' } },
            { '$Veiculo.chassi_bin$': { [Op.like]: '%' + busca + '%' } },
            { '$Veiculo.chassi_atual$': { [Op.like]: '%' + busca + '%' } },
            { '$Cliente.nome_razao_social$': { [Op.like]: '%' + busca + '%' } },
            { '$perito.nome$': { [Op.like]: '%' + busca + '%' } },
            { '$perito_auxiliar.nome$': { [Op.like]: '%' + busca + '%' } },
            { '$digitador.nome$': { [Op.like]: '%' + busca + '%' } },
          ]
        },
        include: [
          {
            model: Veiculo,
            include: [{ model: TipoVeiculo, attributes: ["descricao"] }],
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: Cliente,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: StatusLaudo,
            attributes: ["id", "descricao"],
          },
          {
            model: Usuario,
            as: "perito",
            attributes: ["nome"],
          },
          {
            model: Usuario,
            as: "perito_auxiliar",
            attributes: ["nome"],
          },
          {
            model: Usuario,
            as: "digitador",
            attributes: ["nome"],
          },
        ],
        order: [["id"]],
      })

      return res.status(200).json({ laudos: laudos })
    } catch (error) {
      console.log(error)

      return res.status(500).json({ mensagem: error })
    }
  }

  async buscar(req, res) {
    let { id } = req.params
    let laudo = await Laudo.findOne({
      where: { id },
      include: [
        { model: Cliente },
        { model: Questao, include: { model: Gravidade, attributes: ["cor", "icone"] } },
        { model: Usuario, as: "perito" },
        {
          model: Usuario,
          as: "perito_auxiliar",
        },
        {
          model: Usuario,
          as: "digitador",
          attributes: ["nome", "id"],
        },
        {
          model: ImagemLaudo,
          attributes: ["peca_veiculo", "url", "id"],
        },
        {
          model: Veiculo,
          include: { model: TipoVeiculo, attributes: ["descricao"] },
        },
      ],
    })

    let codigoLaudo = ("000000000" + id).slice(-9)
    let lancamento = await CaixaLancamento.findOne({ where:{ descricao: {[Op.substring]:codigoLaudo}  }})

    return res.status(200).json({ laudo: laudo, lancamento: lancamento })
  }

  async deletar(req, res) {
    try {
      let { id } = req.params

      let laudo = await Laudo.findOne({ where: { id: id } })

      laudo.destroy()

      return res.status(200).json({ laudo: "laudo" })
    } catch (e) {
      console.log(e)
      return res.status(400).json({ mensagem: "Erro ao deletar Laudo!" })
    }
  }

  async buscarTodos(req, res) {
    const { page, size } = req.query

    const laudos = await Laudo.findAndCountAll({
      where: {
        tipo_servico_id: { [Op.not]: [3] },
      },
      limit: size,
      offset: page * size,
      include: [
        {
          model: Veiculo,
          include: [{ model: TipoVeiculo, attributes: ["descricao"] }],
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: Cliente,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: StatusLaudo,
          attributes: ["id", "descricao"],
        },
        {
          model: Usuario,
          as: "perito",
          attributes: ["nome"],
        },
        {
          model: Usuario,
          as: "perito_auxiliar",
          attributes: ["nome"],
        },
        {
          model: Usuario,
          as: "digitador",
          attributes: ["nome"],
        },
        {
          model: TipoServico,
          attributes: ["descricao"],
        },
      ],
      order: [["id", "DESC"]],
    })

    return res.status(200).json({ laudos: laudos })
  }

  async buscarEspecifico(req, res) {
    let { busca } = req.query

    try {
      const laudos = await Laudo.findAndCountAll({
        where: {
          tipo_servico_id: { [Op.not]: [3] },
          [Op.or]: [
            { '$Veiculo.placa$': { [Op.like]: '%' + busca + '%' } },
            { '$Veiculo.marca_modelo$': { [Op.like]: '%' + busca + '%' } },
            { '$Veiculo.chassi_bin$': { [Op.like]: '%' + busca + '%' } },
            { '$Veiculo.chassi_atual$': { [Op.like]: '%' + busca + '%' } },
            { '$Cliente.nome_razao_social$': { [Op.like]: '%' + busca + '%' } },
            { '$perito.nome$': { [Op.like]: '%' + busca + '%' } },
            { '$perito_auxiliar.nome$': { [Op.like]: '%' + busca + '%' } },
            { '$digitador.nome$': { [Op.like]: '%' + busca + '%' } },
          ]
        },
        include: [
          {
            model: Veiculo,
            include: [{ model: TipoVeiculo, attributes: ["descricao"] }],
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: Cliente,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: StatusLaudo,
            attributes: ["id", "descricao"],
          },
          {
            model: Usuario,
            as: "perito",
            attributes: ["nome"],
          },
          {
            model: Usuario,
            as: "perito_auxiliar",
            attributes: ["nome"],
          },
          {
            model: Usuario,
            as: "digitador",
            attributes: ["nome"],
          },
        ],
        order: [["id", "DESC"]],
      })

      return res.status(200).json({ laudos: laudos })
    } catch (error) {
      console.log(error)

      return res.status(500).json({ mensagem: error })
    }
  }
}

module.exports = new LaudoController()

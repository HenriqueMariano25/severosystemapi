let {
  ConfiguracaoLeilao,
  Usuario,
  Cliente,
  Veiculo,
  Laudo,
  TipoVeiculo,
  StatusLaudo, TipoServico, Questao, Gravidade, ImagemLaudo,
} = require("../models")

class LeilaoController {
  async cadastrarEditarConfiguracao(req, res) {
    let { cliente, perito } = req.body

    try {
      let configuracaoEncontrada = await ConfiguracaoLeilao.findOne()
      let configuracao

      if (!configuracaoEncontrada) {
        let configuracaoCriada = await ConfiguracaoLeilao.create({
          cliente_leilao_id: cliente.id,
          perito_id: perito.id,
        })

        configuracao = await ConfiguracaoLeilao.findOne({
          where: { id: configuracaoCriada.id },
          include: [
            { model: Usuario, attributes: ["nome", "id"] },
            { model: Cliente, attributes: ["nome_razao_social", "id"] },
          ],
          attributes: ["cliente_leilao_id", "id", "perito_id"],
        })
      } else {
        await ConfiguracaoLeilao.update(
          {
            cliente_leilao_id: cliente.id,
            perito_id: perito.id,
          },
          { where: { id: configuracaoEncontrada.id } }
        )
        configuracao = await ConfiguracaoLeilao.findOne({
          where: { id: configuracaoEncontrada.id },
          include: [
            { model: Usuario, attributes: ["nome", "id"] },
            { model: Cliente, attributes: ["nome_razao_social", "id"] },
          ],
          attributes: ["cliente_leilao_id", "id", "perito_id"],
        })
      }

      return res.status(200).json({ configuracao: configuracao })
    } catch (error) {
      console.log(error)

      return res.status(500).json({ menssagem: error })
    }
  }

  async buscarConfiguracoes(req, res) {
    try {
      let configuracao = await ConfiguracaoLeilao.findOne({
        include: [
          { model: Usuario, attributes: ["nome", "id"] },
          { model: Cliente, attributes: ["nome_razao_social", "cpf_cnpj", "id"] },
        ],
        attributes: ["cliente_leilao_id", "id", "perito_id"],
      })

      if (!configuracao) {
        return res.status(204).json({ mensagem: "Configuração não cadastrada" })
      } else {
        return res.status(200).json({ configuracao: configuracao })
      }
    } catch (error) {
      console.log(error)
      return res.status(500).send({ error })
    }
  }

  async buscarLaudoLeilao(req, res) {
    try {
      let laudos = await Laudo.findAll({
        where: { tipo_servico_id: 3 },
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
    } catch (error) {
      console.log(error)

      return res.status(500).json({ messagem: error })
    }
  }

  async cadastrarLaudoLeilao(req, res) {
    let {
      placa,
      ano,
      cidade,
      marca_modelo,
      chassi_bin,
      chassi_atual,
      motor_bin,
      motor_atual,
      grv,
      cor_bin,
      cor_atual,
      combustivel,
      cambio_bin,
      cambio_atual,
    } = req.body.veiculo
    try {

      let veiculo_id

        let veiculoCriado = await Veiculo.create({
          placa,
          ano,
          cidade,
          grv,
          marca_modelo,
          chassi_bin,
          chassi_atual,
          motor_bin,
          motor_atual,
          cor_bin,
          cor_atual,
          combustivel,
          cambio_bin,
          cambio_atual,
          tipo_veiculo_id: 4,
        })
        veiculo_id = veiculoCriado.id

      let { id: cliente_id } = req.body.cliente

      let laudoCriado = await Laudo.create({
        cliente_id,
        veiculo_id,
        tipo_servico_id: 3,
        status_laudo_id: 1,
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

      return res.status(200).json({ laudo:laudo, veiculo_id })
    } catch (e) {
      console.log(e)
      return res.status(500).json({ mensagem: "Erro ao cadastrar laudo" })
    }
  }

  async editarLaudoLeilao(req, res) {
    let { cliente, veiculo, resumo } = req.body
    let { id: laudo_id } = req.params

    console.log("entrei aqui")

    try {
      let {
        placa,
        ano,
        cidade,
        grv,
        marca_modelo,
        chassi_bin,
        chassi_atual,
        motor_bin,
        motor_atual,
        cor_bin,
        cor_atual,
        combustivel,
        cambio_bin,
        cambio_atual,
      } = veiculo

      let { id: veiculo_id } = await Veiculo.update(
        {
          placa,
          ano,
          cidade,
          grv,
          marca_modelo,
          chassi_bin,
          chassi_atual,
          motor_bin,
          motor_atual,
          cor_bin,
          cor_atual,
          combustivel,
          cambio_bin,
          cambio_atual,
        },
        { where: { id: veiculo.id } }
      )

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
}

module.exports = new LeilaoController()

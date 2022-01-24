const {Veiculo, TipoVeiculo} = require("../models");

class VeiculoController {
    async cadastrar(req, res) {
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
        } = req.body

        if (!placa ||
            !ano ||
            !hodometro ||
            !uf ||
            !cidade ||
            !marca_modelo ||
            !chassi_bin ||
            !chassi_atual ||
            !motor_bin ||
            !motor_atual ||
            !cor_bin ||
            !cor_atual ||
            !combustivel ||
            !renavam)
            return res.status(400).json({message: "Dados obrigatorios faltando"})

        let veiculo = await Veiculo.create({
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
            renavam
        })

        return res.status(200).json({veiculo: veiculo})
    }

    async editar(req, res) {
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
            renavam
        } = req.body
        let {id} = req.params

        let veiculo = await Veiculo.findOne({where: {id}})

        await veiculo.update({
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
            renavam
        })

        return res.status(200).json({veiculo: veiculo})
    }

    async deletar(req, res) {
        let {id} = req.params

        let veiculo = await Veiculo.findOne({where: {id}})

        await veiculo.destroy()

        return res.status(200).json({veiculo: veiculo})
    }

    async buscarTodos(req, res) {
        let veiculos = await Veiculo.findAll()

        return res.status(200).json({veiculos: veiculos})
    }

    async buscarTipoVeiculo(req, res) {
        let tipoVeiculo = await TipoVeiculo.findAll({order: ['descricao']})

        return res.status(200).json({tipoVeiculo: tipoVeiculo})
    }

    async buscar(req, res) {
        let {id} = req.params

        let veiculo = await Veiculo.findOne({where: {id}})

        return res.status(200).json({veiculo: veiculo})
    }
}

module.exports = new VeiculoController()
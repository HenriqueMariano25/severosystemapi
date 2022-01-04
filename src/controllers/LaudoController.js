const {
    Cliente,
    Veiculo,
    Laudo,
    LaudoQuestao,
    ImagemLaudo,
    StatusLaudo,
    Questao,
    TipoVeiculo,
    PecaVeiculo,
    Usuario,
    Gravidade
} = require("../models")
const dayjs = require("dayjs");
const path = require("path");
const sharp = require("sharp");
const aws = require('aws-sdk')
const fs = require("fs");
const {Op} = require("sequelize");

const {AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_DEFAULT_REGION} = process.env

const sharpify = async originalFile => {
    try {
        const image = sharp(originalFile.buffer)
        const meta = await image.metadata()
        const {format} = meta
        const config = {
            jpeg: {quality: 80},
            webp: {quality: 80},
            png: {quality: 80}
        }
        return await image[format](config[format])
            .resize({width: 1000, withoutEnlargement: true})
    } catch (err) {
        throw new Error(err)
    }
}

const uploadToAWS = props => {
    return new Promise((resolve, reject) => {
        const s3 = new aws.S3({
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
            region: AWS_DEFAULT_REGION
        })
        s3.upload(props, (err, data) => {
            if (err) reject(err)
            resolve(data)
        })
    })
}

class LaudoController {
    async cadastrar(req, res) {

        let {
            placa,
            ano,
            hodometro,
            uf,
            cidade,
            marca_modelo,
            chassi_bin,
            motor_bin,
            cor_bin,
            combustivel,
            renavam,
            crlv,
            tipo_lacre,
            cambio_bin,
            lacre,
            quilometragem
        } = req.body.veiculo

        let {id: veiculo_id} = await Veiculo.create({
            placa,
            ano,
            hodometro,
            uf,
            cidade,
            marca_modelo,
            chassi_bin,
            motor_bin,
            cor_bin,
            combustivel,
            renavam,
            crlv,
            tipo_lacre,
            cambio_bin,
            lacre,
            quilometragem,
            tipo_veiculo_id: req.body.veiculo.tipo_veiculo.id
        })

        let {
            nome_razao_social: prop_nome,
            cpf_cnpj: prop_cpf_cnpj,
            cnh: prop_cnh,
            telefone: prop_telefone,
            email: prop_email
        } = req.body.proprietario

        let {id: cliente_id} = req.body.cliente

        let {id: laudo_id} = await Laudo.create({
            cliente_id,
            prop_nome,
            prop_cpf_cnpj,
            prop_cnh,
            prop_telefone,
            prop_email,
            veiculo_id,
            status_laudo_id: 1
        })


        return res.status(200).json({laudo_id})
    }

    async editar(req, res) {
        let dados = JSON.parse(req.body.data)
        let {laudo_id} = dados

        let questoes = dados.questoes
        let id_questoes = []
        for (let key in questoes) {
            if (questoes[key]['LaudoQuestao'] === undefined) {
                let {id} = await LaudoQuestao.create({laudo_id, questao_id: questoes[key].id})
                id_questoes.push(id)
            } else {
                id_questoes.push(questoes[key]['LaudoQuestao']['id'])
            }
        }

        await LaudoQuestao.destroy({where: {[Op.and]: [{id: {[Op.not]: id_questoes}}, {laudo_id: laudo_id}]}})

        let imgs = dados.imgs

        let id_imgs = []
        for (let img of imgs) {
            if (img.id !== undefined)
                id_imgs.push(img.id)
        }

        let imgsParaDeletar = await ImagemLaudo.findAll({where: {[Op.and]: [{id: {[Op.not]: id_imgs}}, {laudo_id: laudo_id}]} })

        for(let img of imgsParaDeletar){
            if (process.env.STORAGE_TYPE === "s3") {
                s3.deleteObject({
                    Bucket: process.env.BUCKET_NAME,
                    Key: img.nome
                })
            } else {
                fs.unlink((path.resolve(__dirname, '..', '..', 'tmp', 'uploads', img.nome)),
                    function (err) {
                        if (err) throw err;
                    })
            }
            ImagemLaudo.destroy({where: {id: img.id}})

        }
        const files = req.files

        for (let key in files) {
            let peca_veiculo_id = req.body.peca_veiculo_id[key]
            let nomeFormatado = `${dayjs().format('DDMMYYYYHHmmssSSS')}-${files[key].originalname}`
            let url = ''
            let nome = nomeFormatado

            if (process.env.STORAGE_TYPE === 's3') {
                const originalFile = files[key]

                const newFile = await sharpify(originalFile)

                let data = await uploadToAWS({
                    Body: newFile,
                    ACL: 'public-read',
                    Bucket: process.env.BUCKET_NAME,
                    ContentType: originalFile.mimetype,
                    Key: `${nomeFormatado}`
                })
                url = data['Location']
                nome = data['Key']

            } else if (process.env.STORAGE_TYPE === 'local') {
                await sharp(files[key].buffer).resize(600, 600).toFile(path.resolve('tmp/uploads/', nomeFormatado))
            }

            if (!url) {
                url = `${req.protocol}://${req.get('host')}/files/${nome}`
            }

            await ImagemLaudo.create({url, nome: nome, laudo_id, peca_veiculo_id})
        }

         let {
             placa,
             ano,
             hodometro,
             uf,
             cidade,
             marca_modelo,
             chassi_bin,
             motor_bin,
             cor_bin,
             combustivel,
             renavam,
             crlv,
             tipo_lacre,
             cambio_bin,
             lacre,
             quilometragem
         } = dados.veiculo

         let {id: veiculo_id} = await Veiculo.update({
                 placa,
                 ano,
                 hodometro,
                 uf,
                 cidade,
                 marca_modelo,
                 chassi_bin,
                 motor_bin,
                 cor_bin,
                 combustivel,
                 renavam,
                 crlv,
                 tipo_lacre,
                 cambio_bin,
                 lacre,
                 quilometragem,
                 tipo_veiculo_id: dados.veiculo.tipo_veiculo.id
             },
             {where: {id: laudo_id}})

         let {
             nome_razao_social: prop_nome,
             cpf_cnpj: prop_cpf_cnpj,
             cnh: prop_cnh,
             telefone: prop_telefone,
             email: prop_email
         } = dados.proprietario

         let {situacao, observacao, perito: perito_id, perito_auxiliar: perito_auxiliar_id} = dados.resumo

         let {id: cliente_id} = dados.cliente

         let laudo

        try{
            await Laudo.update({
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
                    perito_auxiliar_id
                },
                {
                    returning: true,
                    where: {
                        id: laudo_id
                    }
                }).then(result => {
                laudo = result[1]
            })
        }catch (e) {
            console.log(e)
            return res.status(400).json({ 'message': 'Erro ao editar laudo'})
        }
         return res.status(200).json({laudo: laudo})
    }


    async finalizar(req, res) {
        let { id } = req.params

        let laudo = await Laudo.update({
                status_laudo_id: 3,
            }, {where: {id: id}})

        return res.status(200).json({laudo})

    }

    async buscarTodos(req, res) {
        let laudos = await Laudo.findAll({
            include: [{
                model: Veiculo,
                include: [{model: TipoVeiculo, attributes: ['descricao']}]
            },
                {model: Cliente},
                {model: StatusLaudo}],
            order: [
                ['id', 'DESC']]
        })

        return res.status(200).json({laudos: laudos})
    }

    async buscar(req, res) {
        let {id} = req.params
        let laudo = await Laudo.findOne({
            where: {id},
            include: [
                {model: Cliente},
                {model: Questao, include: {model: Gravidade, attributes: ['cor', 'icone']}},
                {model: Usuario, as: 'perito'},
                {
                    model: Usuario,
                    as: 'perito_auxiliar'
                },
                {model: ImagemLaudo, include: {model: PecaVeiculo, attributes: ['descricao']}}, {
                    model: Veiculo,
                    include: {model: TipoVeiculo, attributes: ['descricao']}
                }]

        })
        return res.status(200).json({laudo: laudo})


    }
}

module.exports = new LaudoController()
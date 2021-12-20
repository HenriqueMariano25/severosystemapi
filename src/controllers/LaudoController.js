const {Cliente, Veiculo, Laudo, LaudoQuestao, ImagemLaudo} = require("../models")
const dayjs = require("dayjs");
const path = require("path");
const sharp = require("sharp");
const aws = require('aws-sdk')
const fs = require("fs");

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
        let dados = JSON.parse(req.body.data)

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
            lacre
        } = dados.veiculo

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
            lacre
        })

        let {
            nome_razao_social: prop_nome,
            cpf_cnpj: prop_cpf_cnpj,
            cnh: prop_cnh,
            telefone: prop_telefone,
            email: prop_email
        } = dados.proprietario

        let {id:cliente_id} = dados.cliente

        let {id:laudo_id} = await Laudo.create({
            cliente_id,
            prop_nome,
            prop_cpf_cnpj,
            prop_cnh,
            prop_telefone,
            prop_email,
            veiculo_id,
            status_laudo_id: 1
        })


        let questoes = dados.questoes

        for(let key in questoes){
            await LaudoQuestao.create({laudo_id, questao_id: questoes[key].id})
        }

        const files = req.files

        for(let key in files){

            let peca_veiculo_id = req.body.peca_veiculo_id[key]
            let nomeFormatado = `${dayjs().format('DDMMYYYYHHmmssSSS')}-${files[key].originalname}`
            let url = ''
            let nome = nomeFormatado

            console.log(nomeFormatado)
            if (process.env.STORAGE_TYPE === 's3') {
                const originalFile = files[key]

                const newFile = await sharpify(originalFile)

                let data = await uploadToAWS({
                    Body: newFile,
                    ACL: 'public-read',
                    Bucket: 'acervovirtual',
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

            let imgCriada = await ImagemLaudo.create({url, nome: nome, laudo_id, peca_veiculo_id})
            console.log(imgCriada)
        }

        return res.status(200).json({laudo_id})
    }

    async buscarTodos(req,res){
        let laudos = await Laudo.findAll({ include: [{ model: Veiculo}, {model: Cliente}]})

        return res.status(200).json({laudos: laudos})
    }
}

module.exports = new LaudoController()
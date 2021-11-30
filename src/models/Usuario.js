const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

module.exports = (sequelize, DataTypes) => {
    const Usuario = sequelize.define("Usuario", {
            nome: DataTypes.STRING,
            senha: DataTypes.VIRTUAL,
            senha_hash: DataTypes.STRING,
            usuario: DataTypes.STRING,
        },
        {
            freezeTableName: true,
            hooks: {
                beforeSave: async usuario => {
                    if (usuario.senha) {
                        usuario.senha_hash = await bcrypt.hash(usuario.senha, 8)
                    }
                }
            }
        }
    )

    Usuario.prototype.verificarSenha = function (senha) {
        return bcrypt.compare(senha, this.senha_hash)
    }

    Usuario.prototype.gerarToken = function () {
        return jwt.sign({id: this.id}, process.env.APP_SECRET)
    }
    return Usuario
}
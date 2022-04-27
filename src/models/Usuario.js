const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define(
    "Usuario",
    {
      nome: DataTypes.STRING,
      senha: DataTypes.VIRTUAL,
      senha_hash: DataTypes.STRING,
      usuario: DataTypes.STRING,
      cargo: DataTypes.STRING,
      data_admissao: DataTypes.STRING,
      perito: DataTypes.BOOLEAN,
      perito_auxiliar: DataTypes.BOOLEAN,
    },
    {
      freezeTableName: true,
      hooks: {
        beforeSave: async (usuario) => {
          if (usuario.senha) {
            usuario.senha_hash = await bcrypt.hash(usuario.senha, 8)
          }
        },
      },
    }
  )

  Usuario.associate = (models) => {
    Usuario.belongsTo(models.StatuUsuario, {
      foreignKey: "statu_usuario_id",
    })
    Usuario.belongsTo(models.TipoUsuario, {
      foreignKey: "tipo_usuario_id",
    })
    Usuario.belongsToMany(models.Cliente, {
      through: models.ClienteUsuario,
      foreignKey: "usuario_id",
    })
  }

  Usuario.prototype.verificarSenha = function (senha) {
    return bcrypt.compare(senha, this.senha_hash)
  }

  Usuario.prototype.gerarToken = function () {
    return jwt.sign({ id: this.id }, process.env.APP_SECRET)
  }
  return Usuario
}

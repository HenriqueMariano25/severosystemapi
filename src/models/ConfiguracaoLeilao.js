module.exports = (sequelize, DataTypes) => {
  const ConfiguracaoLeilao = sequelize.define(
    "ConfiguracaoLeilao",
    {},
    {
      freezeTableName: true,
    }
  )

  ConfiguracaoLeilao.associate = (models) => {
    ConfiguracaoLeilao.belongsTo(models.Cliente, {
      foreignKey: "cliente_leilao_id",
    })
    ConfiguracaoLeilao.belongsTo(models.Usuario, {
      foreignKey: "perito_id",
    })
  }
  return ConfiguracaoLeilao
}

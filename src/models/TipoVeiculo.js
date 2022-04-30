module.exports = (sequelize, DataTypes) => {
  const TipoVeiculo = sequelize.define(
    "TipoVeiculo",
    {
      descricao: DataTypes.STRING,
      icone: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  )

  return TipoVeiculo
}

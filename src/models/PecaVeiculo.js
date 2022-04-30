module.exports = (sequelize, DataTypes) => {
  const PecaVeiculo = sequelize.define(
    "PecaVeiculo",
    {
      descricao: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  )

  return PecaVeiculo
}

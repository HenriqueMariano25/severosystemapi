module.exports = (sequelize, DataTypes) => {
  const TipoServico = sequelize.define(
    "TipoServico",
    {
      descricao: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  )

  return TipoServico
}

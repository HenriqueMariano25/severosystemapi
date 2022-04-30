module.exports = (sequelize, DataTypes) => {
  const TipoUsuario = sequelize.define(
    "TipoUsuario",
    {
      descricao: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  )

  return TipoUsuario
}

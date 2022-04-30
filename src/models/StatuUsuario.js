module.exports = (sequelize, DataTypes) => {
  const StatuUsuario = sequelize.define(
    "StatuUsuario",
    {
      descricao: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  )

  return StatuUsuario
}

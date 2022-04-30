module.exports = (sequelize, DataTypes) => {
  const ClienteUsuario = sequelize.define(
    "ClienteUsuario",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  )

  return ClienteUsuario
}

module.exports = (sequelize, DataTypes) => {
  const Servico = sequelize.define(
    "Servico",
    {
      valor: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  )

  Servico.associate = (models) => {
    Servico.belongsTo(models.TipoServico, {
      foreignKey: "tipo_servico_id",
    })
  }

  return Servico
}

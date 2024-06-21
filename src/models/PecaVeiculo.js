module.exports = (sequelize, DataTypes) => {
  const PecaVeiculo = sequelize.define(
    "PecaVeiculo",
    {
      descricao: DataTypes.STRING,
      tela_inicial: DataTypes.BOOLEAN
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  )

  PecaVeiculo.associate = (models) => {
    PecaVeiculo.belongsTo(models.TipoVeiculo, {
      foreignKey: "tipo_veiculo_id",
      as: "TipoVeiculo"
    })
  }

  return PecaVeiculo
}

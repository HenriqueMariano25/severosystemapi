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

  TipoVeiculo.associate = (models) => {
    TipoVeiculo.hasMany(models.PecaVeiculo, {
      foreignKey: "tipo_veiculo_id",
      as: "PecaVeiculo"
    })
  }

  return TipoVeiculo
}

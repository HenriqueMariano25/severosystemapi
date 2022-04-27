module.exports = (sequelize, DataTypes) => {
  const Veiculo = sequelize.define(
    "Veiculo",
    {
      placa: DataTypes.STRING,
      ano: DataTypes.STRING,
      hodometro: DataTypes.STRING,
      uf: DataTypes.STRING,
      cidade: DataTypes.STRING,
      marca_modelo: DataTypes.STRING,
      chassi_bin: DataTypes.STRING,
      chassi_atual: DataTypes.STRING,
      motor_bin: DataTypes.STRING,
      motor_atual: DataTypes.STRING,
      cor_bin: DataTypes.STRING,
      cor_atual: DataTypes.STRING,
      combustivel: DataTypes.STRING,
      renavam: DataTypes.STRING,
      cambio_bin: DataTypes.STRING,
      cambio_atual: DataTypes.STRING,
      crlv: DataTypes.STRING,
      tipo_lacre: DataTypes.STRING,
      lacre: DataTypes.STRING,
      grv: DataTypes.STRING,
    },
    {
      freezeTableName: true,
    }
  )

  Veiculo.associate = (models) => {
    Veiculo.belongsTo(models.TipoVeiculo, {
      foreignKey: "tipo_veiculo_id",
    })
  }

  return Veiculo
}

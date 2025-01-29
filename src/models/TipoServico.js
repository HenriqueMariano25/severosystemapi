module.exports = (sequelize, DataTypes) => {
  const TipoServico = sequelize.define(
    "TipoServico",
    {
      descricao: DataTypes.STRING,
      valor: DataTypes.FLOAT,
      valor_variavel: DataTypes.BOOLEAN,
      entrada_saida: DataTypes.STRING,
      aparecer_laudo: DataTypes.BOOLEAN,
      obrigatorio_cliente: DataTypes.BOOLEAN,
      obrigatorio_detalhe: DataTypes.BOOLEAN,
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  )

  return TipoServico
}

module.exports = (sequelize, DataTypes) => {
  const Laudo = sequelize.define(
    "Laudo",
    {
      prop_nome: DataTypes.STRING,
      prop_cpf_cnpj: DataTypes.STRING,
      prop_cnh: DataTypes.STRING,
      prop_telefone: DataTypes.STRING,
      prop_email: DataTypes.STRING,
      situacao: DataTypes.STRING,
      observacao: DataTypes.STRING,
      processado: DataTypes.BOOLEAN
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  )

  Laudo.associate = (models) => {
    Laudo.belongsTo(models.Cliente, {
      foreignKey: "cliente_id",
    })
    Laudo.belongsTo(models.Usuario, {
      foreignKey: "perito_id",
      as: "perito",
    })
    Laudo.belongsTo(models.Usuario, {
      foreignKey: "perito_auxiliar_id",
      as: "perito_auxiliar",
    })
    Laudo.belongsTo(models.Usuario, {
      foreignKey: "digitador_id",
      as: "digitador",
    })
    Laudo.belongsTo(models.Veiculo, {
      foreignKey: "veiculo_id",
    })
    Laudo.belongsTo(models.StatusLaudo, {
      foreignKey: "status_laudo_id",
    })
    Laudo.belongsToMany(models.Questao, {
      through: models.LaudoQuestao,
      foreignKey: "laudo_id",
    })
    Laudo.hasMany(models.ImagemLaudo, {
      foreignKey: "laudo_id",
    })
    Laudo.belongsTo(models.TipoServico, {
      foreignKey: "tipo_servico_id",
    })
    Laudo.hasMany(models.RascunhoLaudo, {
      foreignKey: "laudo_id",
    })
    Laudo.belongsTo(models.Usuario, {
      foreignKey: "processado_por_id",
      as: "ProcessadoPor"
    })
  }

  return Laudo
}

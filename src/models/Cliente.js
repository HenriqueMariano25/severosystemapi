module.exports = (sequelize, DataTypes) => {
  const Cliente = sequelize.define(
    "Cliente",
    {
      nome_razao_social: DataTypes.STRING,
      email: DataTypes.STRING,
      cpf_cnpj: DataTypes.STRING,
      cnh: DataTypes.STRING,
      rua: DataTypes.STRING,
      bairro: DataTypes.STRING,
      cidade: DataTypes.STRING,
      uf: DataTypes.STRING,
      numero: DataTypes.STRING,
      cep: DataTypes.STRING,
      complemento: DataTypes.STRING,
      telefone: DataTypes.STRING,
      tipo_cliente: DataTypes.STRING,
      valor_desconto: DataTypes.STRING ,
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  )

  Cliente.associate = (models) => {
    Cliente.belongsToMany(models.Usuario, {
      through: models.ClienteUsuario,
      foreignKey: "cliente_id",
    })
  }

  return Cliente
}

module.exports = (sequelize, DataTypes) => {
    const Cliente = sequelize.define("Cliente", {
            nome: DataTypes.STRING,
            email: DataTypes.STRING,
            cpf_cnpj: DataTypes.STRING,
            cnh: DataTypes.STRING,
            telefone: DataTypes.STRING,
        },
        {
            freezeTableName: true,
        }
    )

    return Cliente
}
module.exports = (sequelize, DataTypes) => {
    const Gravidade = sequelize.define("Gravidade", {
            descricao: DataTypes.STRING,
            icone: DataTypes.STRING,
            cor: DataTypes.STRING,
        },
        {
            freezeTableName: true,
        }
    )

    return Gravidade
}
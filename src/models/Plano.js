module.exports = (sequelize, DataTypes) => {
    const Plano = sequelize.define("Plano", {
            descricao: DataTypes.STRING,
            valor: DataTypes.STRING,
        },
        {
            freezeTableName: true,
        }
    )

    return Plano
}
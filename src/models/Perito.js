module.exports = (sequelize, DataTypes) => {
    const Perito = sequelize.define("Perito", {
            nome: DataTypes.STRING,
        },
        {
            freezeTableName: true,
        }
    )

    return Perito
}
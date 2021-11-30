module.exports = (sequelize, DataTypes) => {
    const StatuUsuario = sequelize.define("StatuUsuario", {
            descricao: DataTypes.STRING,
        },
        {
            freezeTableName: true,
        }
    )

    return StatuUsuario
}
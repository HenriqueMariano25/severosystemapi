module.exports = (sequelize, DataTypes) => {
    const TipoUsuario = sequelize.define("TipoUsuario", {
            descricao: DataTypes.STRING,
        },
        {
            freezeTableName: true,
        }
    )

    return TipoUsuario
}
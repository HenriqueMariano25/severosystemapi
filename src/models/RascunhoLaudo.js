module.exports = (sequelize, DataTypes) => {
    const RascunhoLaudo = sequelize.define(
        "RascunhoLaudo",
        {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            },
            url: DataTypes.STRING,
            nome: DataTypes.STRING,
        },
        {
            freezeTableName: true,
            paranoid: true,
        }
    )
    RascunhoLaudo.associate = (models) => {
        RascunhoLaudo.belongsTo(models.Laudo, {
            foreignKey: "laudo_id",
        })
    }

    return RascunhoLaudo
}

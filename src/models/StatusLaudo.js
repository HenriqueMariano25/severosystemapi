module.exports = (sequelize, DataTypes) => {
    const StatusLaudo = sequelize.define("StatusLaudo", {
            descricao: DataTypes.STRING,
        },
        {
            freezeTableName: true,
        }
    )

    return StatusLaudo
}
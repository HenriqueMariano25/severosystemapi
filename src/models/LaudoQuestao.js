module.exports = (sequelize, DataTypes) => {
    const LaudoQuestao = sequelize.define("LaudoQuestao", {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            }
        },
        {
            freezeTableName: true,
        }
    )

    return LaudoQuestao
}
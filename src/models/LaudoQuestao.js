module.exports = (sequelize, DataTypes) => {
  const LaudoQuestao = sequelize.define(
    "LaudoQuestao",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  )

  return LaudoQuestao
}

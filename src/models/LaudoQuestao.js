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

	LaudoQuestao.associate = (models) => {
		LaudoQuestao.belongsTo(models.Questao, {
			foreignKey: "questao_id",
		})
	}

  return LaudoQuestao
}

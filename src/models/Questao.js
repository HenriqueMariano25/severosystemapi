module.exports = (sequelize, DataTypes) => {
    const Questao = sequelize.define("Questao", {
            titulo: DataTypes.STRING,
            situacao_observada: DataTypes.STRING,
            componente: DataTypes.STRING,
        },
        {
            freezeTableName: true,
        }
    )

    Questao.associate = models => {
        Questao.belongsTo(models.TipoVeiculo, {
            foreignKey: 'tipo_veiculo_id',
        })
        Questao.belongsTo(models.Gravidade, {
            foreignKey: 'gravidade_id',
        })
        Questao.belongsToMany(models.Laudo,{
            through: models.LaudoQuestao,
            foreignKey: 'questao_id',
        })
    }

    return Questao
}
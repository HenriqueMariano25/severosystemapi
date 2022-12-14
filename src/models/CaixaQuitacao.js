module.exports = (sequelize, DataTypes) => {
    const CaixaQuitacao = sequelize.define(
        'CaixaQuitacao',
        {
            data: DataTypes.STRING,
        },
        {
            freezeTableName: true,
            paranoid: true
        }
    )
    CaixaQuitacao.associate = (models)=>{
        CaixaQuitacao.belongsTo(models.Usuario,{
            foreignKey:'usuario_id'
        })

        CaixaQuitacao.belongsTo(models.CaixaLancamento, {
            foreignKey:'lancamento_id'
        })
    }
    return CaixaQuitacao
}
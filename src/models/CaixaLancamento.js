module.exports = (sequelize, DataTypes) => {
    const CaixaLancamento = sequelize.define(
        'CaixaLancamento',
        {
            descricao: DataTypes.STRING,
            valor: DataTypes.DECIMAL(10, 2),

        },
        {
            freezeTableName: true,
            paranoid: true
        }
    )
    CaixaLancamento.associate = (models)=>{
        CaixaLancamento.belongsTo(models.CaixaDia,{
            foreignKey:'caixadia_id',as:'caixa'
        })

        CaixaLancamento.belongsTo(models.CaixaCategoria,{
            foreignKey:'categoria_id',as:'categoria'
        })

        CaixaLancamento.hasMany(models.CaixaFormaLanc, {
            foreignKey:'lancamento_id',as:'pagamento'
        })
    }
    return CaixaLancamento
}
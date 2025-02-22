module.exports = (sequelize, DataTypes) => {
    const CaixaLancamento = sequelize.define(
        'CaixaLancamento',
        {
            descricao: DataTypes.STRING,
            valor: DataTypes.FLOAT,
            valor_servico: DataTypes.FLOAT,
            valor_desconto: DataTypes.FLOAT,
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

        CaixaLancamento.hasMany(models.CaixaQuitacao, {
            foreignKey: 'lancamento_id',
            as: "CaixaQuitacao"
        })

        CaixaLancamento.belongsTo(models.Laudo, {
            foreignKey: 'laudo_id', as: 'laudo'
        })
        CaixaLancamento.belongsTo(models.Cliente, {
            foreignKey: 'cliente_id', as: 'cliente'
        })
        CaixaLancamento.belongsTo(models.TipoServico, {
            foreignKey: 'tipo_servico_id', as: 'tipoServico'
        })
    }
    return CaixaLancamento
}
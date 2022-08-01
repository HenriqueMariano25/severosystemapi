module.exports = (sequelize, DataTypes) => {
    const CaixaFormaLanc = sequelize.define("CaixaFormaLanc",
        {
            valor: DataTypes.DECIMAL(10, 2),
        },
        {
            freezeTableName: true,
            paranoid: true
        }

    )

    CaixaFormaLanc.associate = (models)=>{
        CaixaFormaLanc.belongsTo(models.CaixaFormaTipo,{
            foreignKey: 'forma_id', as:'tipo'
        })
        CaixaFormaLanc.belongsTo(models.CaixaLancamento,{
            foreignKey: 'lancamento_id', as:'lancamento'
        })
    }
    
    
    return CaixaFormaLanc
}
module.exports = (sequelize,DataTypes)=>{
    const CaixaCategoria = sequelize.define(
        'CaixaCategoria',
        {
            descricao: DataTypes.STRING,
            tipo: DataTypes.STRING
        },
        {freezeTableName:true, paranoid: true,}
    )

    CaixaCategoria.associate = (models)=>{
        CaixaCategoria.hasMany(models.CaixaLancamento,{
            foreignKey:'categoria_id', as:'categoria'
        })
    }
    return CaixaCategoria
}
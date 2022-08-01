module.exports = (sequelize,DataTypes)=>{
    const CaixaLaudoTipos = sequelize.define(
        'CaixaLaudoTipos',
        {
            descricao: DataTypes.STRING
        },
        {freezeTableName:true}
    )

    return CaixaLaudoTipos
}
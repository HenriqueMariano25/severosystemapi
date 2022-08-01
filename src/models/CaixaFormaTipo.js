module.exports = (sequelize, DataTypes) =>{
    const CaixaFormaTipo = sequelize.define(
        'CaixaFormaTipo',
        {
         descricao:DataTypes.STRING   
        },
        {
            freezeTableName: true,  
            timestamps: false}
    )
    return CaixaFormaTipo
}
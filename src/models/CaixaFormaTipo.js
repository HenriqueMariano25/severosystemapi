module.exports = (sequelize, DataTypes) =>{
    const CaixaFormaTipo = sequelize.define(
        'CaixaFormaTipo',
        {
            descricao:DataTypes.STRING
        },
        {
            freezeTableName: true,
            paranoid: true
        }
    )
    return CaixaFormaTipo
}
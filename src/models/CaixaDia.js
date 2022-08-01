module.exports = (sequelize, DataTypes) => {
    const CaixaDia = sequelize.define("CaixaDia",
        {
            data_abertura: DataTypes.DATEONLY,
            data_fechamento: DataTypes.DATEONLY,
            valor_total: DataTypes.DECIMAL(10, 2),
            valor_abertura: DataTypes.DECIMAL(10, 2),
            valor_fechamento: DataTypes.DECIMAL(10, 2),
            status_caixa: DataTypes.STRING,
        },
        {
            freezeTableName: true,
            paranoid: true
        }

    )
    CaixaDia.associate = (models) => {
        CaixaDia.hasMany(models.CaixaLancamento, {
            foreignKey: 'caixadia_id',
            as:'lancamentos'
        })
      
    }

    return CaixaDia
}
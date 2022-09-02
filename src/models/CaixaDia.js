module.exports = (sequelize, DataTypes) => {
    const CaixaDia = sequelize.define("CaixaDia",
        {
            data_abertura: DataTypes.STRING,
            data_fechamento: DataTypes.STRING,
            valor_total: DataTypes.STRING,
            valor_abertura: DataTypes.STRING,
            valor_fechamento: DataTypes.STRING,
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

        CaixaDia.belongsTo(models.Usuario, {
            foreignKey: "usuario_id",
        })

    }

    return CaixaDia
}
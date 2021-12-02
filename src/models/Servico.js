module.exports = (sequelize, DataTypes) => {
    const Servico = sequelize.define("Servico", {
            valor: DataTypes.STRING,
        },
        {
            freezeTableName: true,
        }
    )

    Servico.associate = models => {
        Servico.belongsTo(models.TipoServico, {
            foreignKey: 'tipo_servico_id',
        })
    }

    return Servico
}
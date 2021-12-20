module.exports = (sequelize, DataTypes) => {
    const ImagemLaudo = sequelize.define("ImagemLaudo", {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            },
            url: DataTypes.STRING,
            nome: DataTypes.STRING,
        },
        {
            freezeTableName: true,
        }
    )
    ImagemLaudo.associate = models => {
        ImagemLaudo.belongsTo(models.Laudo, {
            foreignKey: 'laudo_id',
        })
        ImagemLaudo.belongsTo(models.PecaVeiculo, {
            foreignKey: 'peca_veiculo_id',
        })
    }


    return ImagemLaudo
}
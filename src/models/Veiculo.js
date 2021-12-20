module.exports = (sequelize, DataTypes) => {
    const Veiculo = sequelize.define("Veiculo", {
            placa: DataTypes.STRING,
            ano: DataTypes.STRING,
            hodometro: DataTypes.STRING,
            uf: DataTypes.STRING,
            cidade: DataTypes.STRING,
            marca_modelo: DataTypes.STRING,
            chassi_bin: DataTypes.STRING,
            chassi_atual: DataTypes.STRING,
            motor_bin: DataTypes.STRING,
            motor_atual: DataTypes.STRING,
            cor_bin: DataTypes.STRING,
            cor_atual: DataTypes.STRING,
            combustivel: DataTypes.STRING,
            renavam: DataTypes.STRING,
            crlv: DataTypes.STRING,
            tipo_lacre: DataTypes.STRING,
            cambio_bin: DataTypes.STRING,
            lacre: DataTypes.STRING,
        },
        {
            freezeTableName: true,
        }
    )

    return Veiculo
}
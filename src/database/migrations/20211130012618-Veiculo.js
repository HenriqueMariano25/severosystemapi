'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("Veiculo",{
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      placa:{
        type: Sequelize.STRING,
        allowNull: true
      },
      ano:{
        type: Sequelize.STRING,
        allowNull: true
      },
      hodometro:{
        type: Sequelize.STRING,
        allowNull: true
      },
      uf:{
        type: Sequelize.STRING,
        allowNull: true
      },
      cidade:{
        type: Sequelize.STRING,
        allowNull: true
      },
      marca_modelo:{
        type: Sequelize.STRING,
        allowNull: true
      },
      chassi_bin:{
        type: Sequelize.STRING,
        allowNull: true
      },
      chassi_atual:{
        type: Sequelize.STRING,
        allowNull: true
      },
      motor_bin:{
        type: Sequelize.STRING,
        allowNull: true
      },
      motor_atual:{
        type: Sequelize.STRING,
        allowNull: true
      },
      cor_bin:{
        type: Sequelize.STRING,
        allowNull: true
      },
      cor_atual:{
        type: Sequelize.STRING,
        allowNull: true
      },
      combustivel:{
        type: Sequelize.STRING,
        allowNull: true
      },
      renavam:{
        type: Sequelize.STRING,
        allowNull: true
      },
      crlv:{
        type: Sequelize.STRING,
        allowNull: true
      },
      tipo_lacre:{
        type: Sequelize.STRING,
        allowNull: true
      },
      lacre:{
        type: Sequelize.STRING,
        allowNull: true
      },
      cambio_bin:{
        type: Sequelize.STRING,
        allowNull: true
      },
      created_at:{
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at:{
        type: Sequelize.DATE,
        allowNull: false
      },
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Veiculo")
  }
};

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
        allowNull: false
      },
      ano:{
        type: Sequelize.STRING,
        allowNull: false
      },
      hodometro:{
        type: Sequelize.STRING,
        allowNull: false
      },
      uf:{
        type: Sequelize.STRING,
        allowNull: false
      },
      cidade:{
        type: Sequelize.STRING,
        allowNull: false
      },
      marca_modelo:{
        type: Sequelize.STRING,
        allowNull: false
      },
      chassi_bin:{
        type: Sequelize.STRING,
        allowNull: false
      },
      chassi_atual:{
        type: Sequelize.STRING,
        allowNull: false
      },
      motor_bin:{
        type: Sequelize.STRING,
        allowNull: false
      },
      motor_atual:{
        type: Sequelize.STRING,
        allowNull: false
      },
      cor_bin:{
        type: Sequelize.STRING,
        allowNull: false
      },
      cor_atual:{
        type: Sequelize.STRING,
        allowNull: false
      },
      combustivel:{
        type: Sequelize.STRING,
        allowNull: false
      },
      renavam:{
        type: Sequelize.STRING,
        allowNull: false
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

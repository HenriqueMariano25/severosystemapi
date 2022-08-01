'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("CaixaLaudoTipo", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      descricao: {
        type: Sequelize.STRING,
        allowNull:false
      }, 
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("CaixaLaudosTipo")
  },
};


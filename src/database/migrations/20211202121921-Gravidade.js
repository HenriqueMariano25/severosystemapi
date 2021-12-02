'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("Gravidade", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      descricao:{
        type: Sequelize.STRING,
        allowNull:false,
      },
      icone:{
        type: Sequelize.STRING,
        allowNull:true,
      },
      cor:{
        type: Sequelize.STRING,
        allowNull:true,
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
    return queryInterface.dropTable('Gravidade')
  }
};

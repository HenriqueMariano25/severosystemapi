'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("CaixaCategoria", {
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
      tipo:{
        type:Sequelize.STRING
      },      
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
     
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("CaixaCategoria")
  },
};

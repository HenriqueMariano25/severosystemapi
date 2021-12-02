'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("Servico", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      valor: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tipo_servico_id:{
        type: Sequelize.INTEGER,
        references: {model: "TipoServico", key: "id"},
        onDelete: "CASCADE",
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Servico")
  }
};
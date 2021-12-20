'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('LaudoQuestao', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      laudo_id:{
        type: Sequelize.INTEGER,
        references: { model: "Laudo", key: "id"},
        onDelete: "CASCADE",
        allowNull: false
      },
      questao_id:{
        type: Sequelize.INTEGER,
        references: { model: "Questao", key: "id"},
        onDelete: "CASCADE",
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
    return queryInterface.dropTable("LaudoQuestao")
  }
};

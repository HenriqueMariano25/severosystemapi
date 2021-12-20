'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('ImagemLaudo', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      laudo_id: {
        type: Sequelize.INTEGER,
        references: {model: "Laudo", key: "id"},
        onDelete: "CASCADE",
        allowNull: false
      },
      peca_veiculo_id: {
        type: Sequelize.INTEGER,
        references: {model: "PecaVeiculo", key: "id"},
        onDelete: "CASCADE",
        allowNull: false
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nome: {
        type: Sequelize.STRING,
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
    return queryInterface.dropTable("ImagemLaudo")
  }
};

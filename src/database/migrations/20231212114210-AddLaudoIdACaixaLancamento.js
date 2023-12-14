'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("CaixaLancamento", "laudo_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Laudo",
          key: "id",
        },
        onUpdate: "SET NULL",
        onDelete: "SET NULL",
      }),
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn("CaixaLancamento", "laudo_id"),
    ])
  }
};

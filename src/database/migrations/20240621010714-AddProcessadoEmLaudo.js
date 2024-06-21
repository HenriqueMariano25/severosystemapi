'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("Laudo", "processado", {
        type: Sequelize.BOOLEAN,
      }),
      queryInterface.addColumn("Laudo", "processado_por_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Usuario",
          key: "id",
        },
        onUpdate: "SET NULL",
        onDelete: "SET NULL",
      })
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn("Laudo", "processado"),
      queryInterface.removeColumn("Laudo", "processado_por_id"),
    ])
  }
};

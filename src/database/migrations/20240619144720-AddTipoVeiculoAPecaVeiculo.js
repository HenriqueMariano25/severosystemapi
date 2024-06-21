'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("PecaVeiculo", "tipo_veiculo_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "TipoVeiculo",
          key: "id",
        },
        onUpdate: "SET NULL",
        onDelete: "SET NULL",
      }),
      queryInterface.addColumn("PecaVeiculo", "tela_inicial", {
        type: Sequelize.BOOLEAN,
      })
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn("PecaVeiculo", "tipo_veiculo_id"),
      queryInterface.removeColumn("PecaVeiculo", "tela_inicial"),
    ])
  }
};

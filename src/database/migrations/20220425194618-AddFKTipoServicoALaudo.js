"use strict"

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Laudo", "tipo_servico_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "TipoServico",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      }),
      queryInterface.addColumn("Veiculo", "grv", {
        type: Sequelize.STRING,
      }),
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Laudo", "tipo_servico_id"),
      queryInterface.removeColumn("Veiculo", "grv"),
    ])
  },
}

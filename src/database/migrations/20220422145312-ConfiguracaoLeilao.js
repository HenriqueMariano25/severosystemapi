"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("ConfiguracaoLeilao", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      perito_id: {
        type: Sequelize.INTEGER,
        references: { model: "Usuario", key: "id" },
        onDelete: "CASCADE",
        allowNull: false,
      },
      cliente_leilao_id: {
        type: Sequelize.INTEGER,
        references: { model: "Cliente", key: "id" },
        onDelete: "CASCADE",
        allowNull: false,
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
    return queryInterface.dropTable("ConfiguracaoLeilao")
  },
}

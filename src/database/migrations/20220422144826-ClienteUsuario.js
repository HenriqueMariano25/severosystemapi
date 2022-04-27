"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("ClienteUsuario", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        references: { model: "Usuario", key: "id" },
        onDelete: "CASCADE",
        allowNull: false,
      },
      cliente_id: {
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
    return queryInterface.dropTable("ClienteUsuario")
  },
}

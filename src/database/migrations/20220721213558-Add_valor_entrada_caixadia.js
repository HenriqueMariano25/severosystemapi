'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("CaixaDia", "valor_abertura", {
        type: Sequelize.DECIMAL(10, 2),
      })
    ])
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn("CaixaDia", "valor_abertura")
    ])
  }
};

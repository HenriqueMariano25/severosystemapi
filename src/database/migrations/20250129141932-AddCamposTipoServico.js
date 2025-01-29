'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("TipoServico", "valor", {
        type: Sequelize.FLOAT,
      }),
      queryInterface.addColumn("TipoServico", "valor_variavel", {
        type: Sequelize.BOOLEAN,
      }),
      queryInterface.addColumn("TipoServico", "aparecer_laudo", {
        type: Sequelize.BOOLEAN,
      }),
      queryInterface.addColumn("TipoServico", "entrada_saida", {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn("TipoServico", "obrigatorio_cliente", {
        type: Sequelize.BOOLEAN,
      }),
      queryInterface.addColumn("TipoServico", "obrigatorio_detalhe", {
        type: Sequelize.BOOLEAN,
      }),
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn("TipoServico", "valor"),
      queryInterface.removeColumn("TipoServico", "valor_variavel"),
      queryInterface.removeColumn("TipoServico", "aparecer_laudo"),
      queryInterface.removeColumn("TipoServico", "entrada_saida"),
      queryInterface.removeColumn("TipoServico", "obrigatorio_cliente"),
      queryInterface.removeColumn("TipoServico", "obrigatorio_detalhe"),
    ])
  }
};

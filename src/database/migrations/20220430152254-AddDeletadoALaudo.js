"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("Laudo", "deleted_at", {
        type: Sequelize.DATE,
      }),
      queryInterface.addColumn("Cliente", "deleted_at", {
        type: Sequelize.DATE,
      }),
      queryInterface.addColumn("Veiculo", "deleted_at", {
        type: Sequelize.DATE,
      }),
      queryInterface.addColumn("Usuario", "deleted_at", {
        type: Sequelize.DATE,
      }),
      queryInterface.addColumn("Questao", "deleted_at", {
        type: Sequelize.DATE,
      }),
      queryInterface.addColumn("ClienteUsuario", "deleted_at", {
        type: Sequelize.DATE,
      }),
      queryInterface.addColumn("ConfiguracaoLeilao", "deleted_at", {
        type: Sequelize.DATE,
      }),
      queryInterface.addColumn("Gravidade", "deleted_at", {
        type: Sequelize.DATE,
      }),
      queryInterface.addColumn("ImagemLaudo", "deleted_at", {
        type: Sequelize.DATE,
      }),
      queryInterface.addColumn("LaudoQuestao", "deleted_at", {
        type: Sequelize.DATE,
      }),
      queryInterface.addColumn("PecaVeiculo", "deleted_at", {
        type: Sequelize.DATE,
      }),
      queryInterface.addColumn("Servico", "deleted_at", {
        type: Sequelize.DATE,
      }),
      queryInterface.addColumn("StatusLaudo", "deleted_at", {
        type: Sequelize.DATE,
      }),
      queryInterface.addColumn("StatuUsuario", "deleted_at", {
        type: Sequelize.DATE,
      }),
      queryInterface.addColumn("TipoServico", "deleted_at", {
        type: Sequelize.DATE,
      }),
      queryInterface.addColumn("TipoUsuario", "deleted_at", {
        type: Sequelize.DATE,
      }),
      queryInterface.addColumn("TipoVeiculo", "deleted_at", {
        type: Sequelize.DATE,
      }),
    ])
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn("Laudo", "deleted_at"),
      queryInterface.removeColumn("Cliente", "deleted_at"),
      queryInterface.removeColumn("Veiculo", "deleted_at"),
      queryInterface.removeColumn("Usuario", "deleted_at"),
      queryInterface.removeColumn("Questao", "deleted_at"),
      queryInterface.removeColumn("ClienteUsuario", "deleted_at"),
      queryInterface.removeColumn("ConfiguracaoLeilao", "deleted_at"),
      queryInterface.removeColumn("Gravidade", "deleted_at"),
      queryInterface.removeColumn("ImagemLaudo", "deleted_at"),
      queryInterface.removeColumn("LaudoQuestao", "deleted_at"),
      queryInterface.removeColumn("PecaVeiculo", "deleted_at"),
      queryInterface.removeColumn("Servico", "deleted_at"),
      queryInterface.removeColumn("StatusLaudo", "deleted_at"),
      queryInterface.removeColumn("StatuUsuario", "deleted_at"),
      queryInterface.removeColumn("TipoServico", "deleted_at"),
      queryInterface.removeColumn("TipoUsuario", "deleted_at"),
      queryInterface.removeColumn("TipoVeiculo", "deleted_at"),
    ])
  },
}

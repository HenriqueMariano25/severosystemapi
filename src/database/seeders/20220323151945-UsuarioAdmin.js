'use strict';
const { TipoUsuario, StatuUsuario, Usuario } = require("../../models")

module.exports = {
  async up (queryInterface, Sequelize) {
    let statusUsuarioId = await StatuUsuario.findOne({ where: { descricao: 'ativo' } })
    let tipoUsuarioId = await TipoUsuario.findOne({ where: { descricao: 'Administrador' } })

    let usuario = await Usuario.create({
      nome: "admin",
      email: "admin@admin.com",
      usuario: "admin.01",
      senha: "123",
      cargo: "Administrador",
      data_admissao: "2022-01-01",
      perito: true,
      perito_auxiliar: false,
      tipo_usuario_id: tipoUsuarioId.id,
      status_usuario_id: statusUsuarioId.id
    })

    return usuario
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Usuario', null, {});
  }
};

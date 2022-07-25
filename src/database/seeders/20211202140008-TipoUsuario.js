'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("TipoUsuario", [
      {
        descricao: "Administrador",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        descricao: "Perito",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        descricao: "Digitador",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        descricao: "Perito auxiliar",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        descricao: "Cliente",
        created_at: new Date(),
        updated_at: new Date()
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('TipoUsuario', null, {});
  }
};

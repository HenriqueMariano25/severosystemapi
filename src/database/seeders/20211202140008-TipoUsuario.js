'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("TipoUsuario", [
      {
        descricao: "administrador",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        descricao: "operador",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        descricao: "digitador",
        created_at: new Date(),
        updated_at: new Date()
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('TipoUsuario', null, {});
  }
};

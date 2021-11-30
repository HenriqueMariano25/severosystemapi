'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("StatuUsuario", [
      {
        descricao: "ativo",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        descricao: "inativo",
        created_at: new Date(),
        updated_at: new Date()
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('StatuUsuario', null, {});
  }
};

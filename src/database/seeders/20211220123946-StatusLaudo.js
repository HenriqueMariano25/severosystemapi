'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("StatusLaudo", [
          {
            descricao: 'Aberto',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            descricao: 'Andamento',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            descricao: 'Fechado',
            created_at: new Date(),
            updated_at: new Date()
          },
        ]
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('StatusLaudo', null, {});
  }
};

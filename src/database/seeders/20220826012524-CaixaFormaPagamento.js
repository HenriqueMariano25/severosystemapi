'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert("CaixaFormaTipo", [
          {
            descricao: 'Cartão de débito',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            descricao: 'Cartão de crédito',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            descricao: 'Dinheiro',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            descricao: 'PIX',
            created_at: new Date(),
            updated_at: new Date()
          },
        ]
    )
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('CaixaFormaTipo', null, {});
  }
};
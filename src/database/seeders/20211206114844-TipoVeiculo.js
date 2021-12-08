'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("TipoVeiculo", [
      {
        descricao: "Carro",
        icone: "mdi-car-side",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        descricao: "Moto",
        icone: "mdi-motorbike",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        descricao: "Caminhão",
        icone: "mdi-truck",
        created_at: new Date(),
        updated_at: new Date()
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('TipoVeiculo', null, {});
  }
};

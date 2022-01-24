'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Veiculo', 'cambio_atual',
          {
            type: Sequelize.STRING,
          }),
      queryInterface.removeColumn('Veiculo', 'quilometragem'),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Veiculo', 'cambio_atual'),
      queryInterface.addColumn('Veiculo', 'quilometragem',
          {
            type: Sequelize.STRING,
          }),
    ])
  }
};

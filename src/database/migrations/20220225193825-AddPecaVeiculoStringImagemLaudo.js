'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('ImagemLaudo', 'peca_veiculo',
          {
            type: Sequelize.STRING,
          }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('ImagemLaudo', 'peca_veiculo'),
    ])
  }
};

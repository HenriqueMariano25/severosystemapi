'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      return Promise.all([
          queryInterface.addColumn('Veiculo', 'tipo_veiculo_id',
              {
                  type: Sequelize.INTEGER,
                  references: {
                      model: 'TipoVeiculo',
                      key: 'id',
                  },
                  onUpdate: 'CASCADE',
                  onDelete: 'CASCADE',
              }),
          queryInterface.addColumn('Veiculo', 'quilometragem',
              {
                  type: Sequelize.STRING,
              })
      ]);
  },

  down: async (queryInterface, Sequelize) => {
      return Promise.all([
          queryInterface.removeColumn('Veiculo', 'tipo_veiculo_id'),
          queryInterface.removeColumn('Veiculo', 'quilometragem')
      ]);
  }
};

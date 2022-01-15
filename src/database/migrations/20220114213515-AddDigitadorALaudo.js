'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Laudo', 'digitador_id',
          {
            type: Sequelize.INTEGER,
            references: {
              model: 'Usuario',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Laudo', 'digitador_id'),
    ]);
  }
};

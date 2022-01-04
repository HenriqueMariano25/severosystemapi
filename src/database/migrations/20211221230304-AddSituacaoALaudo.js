'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Laudo', 'perito_id',
          {
            type: Sequelize.INTEGER,
            references: {
              model: 'Usuario',
              key: 'id',
            },
            onDelete: 'CASCADE',
          }),
      queryInterface.addColumn('Laudo', 'perito_auxiliar_id',
          {
            type: Sequelize.INTEGER,
            references: {
              model: 'Usuario',
              key: 'id',
            },
            onDelete: 'CASCADE',
          }),
      queryInterface.addColumn('Laudo', 'situacao',
          {
            type: Sequelize.STRING,
          }),
        queryInterface.addColumn('Laudo', 'observacao',
            {
                type: Sequelize.STRING,
            })
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Laudo', 'perito_id'),
      queryInterface.removeColumn('Laudo', 'perito_auxiliar_id'),
      queryInterface.removeColumn('Laudo', 'situacao'),
      queryInterface.removeColumn('Laudo', 'observacao')
    ]);
  }
};

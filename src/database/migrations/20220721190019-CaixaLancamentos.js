'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("CaixaLancamento", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      descricao: {
        type: Sequelize.STRING,
        allowNull: false
      },
      valor: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      categoria_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'CaixaCategoria',
          key: 'id'
        }
      },
      caixadia_id:{
        type: Sequelize.INTEGER,
        references:{
          model:'CaixaDia',
          key:'id'
        }
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
      }

    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("CaixaLancamento")
  },
};

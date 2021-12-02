'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("Questao", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      titulo:{
        type: Sequelize.STRING,
        allowNull:false,
      },
      tipo_veiculo_id:{
        type: Sequelize.INTEGER,
        references: { model: "TipoVeiculo", key: "id"},
        onDelete: "CASCADE",
        allowNull:true,
      },
      componente:{
        type: Sequelize.STRING,
        allowNull: false
      },
      gravidade_id:{
        type: Sequelize.INTEGER,
        references: { model: "Gravidade", key: "id"},
        onDelete: "CASCADE",
        allowNull: false
      },
      situacao_observada:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at:{
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at:{
        type: Sequelize.DATE,
        allowNull: false
      },
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Questao')
  }
};

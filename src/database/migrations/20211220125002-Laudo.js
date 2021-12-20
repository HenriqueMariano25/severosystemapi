'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("Laudo",{
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      prop_nome:{
        type: Sequelize.STRING,
        allowNull:false,
      },
      prop_cpf_cnpj:{
        type: Sequelize.STRING,
        allowNull:false,
      },
      prop_cnh:{
        type: Sequelize.STRING,
        allowNull:false,
      },
      prop_telefone:{
        type: Sequelize.STRING,
        allowNull:false,
      },
      prop_email:{
        type: Sequelize.STRING,
        allowNull:false,
      },
      cliente_id:{
        type: Sequelize.INTEGER,
        references: { model: "Cliente", key: "id"},
        onDelete: "CASCADE",
        allowNull:true,
      },
      status_laudo_id:{
        type: Sequelize.INTEGER,
        references: { model: "StatusLaudo", key: "id"},
        onDelete: "CASCADE",
        allowNull:true,
      },
      veiculo_id:{
        type: Sequelize.INTEGER,
        references: { model: "Veiculo", key: "id"},
        onDelete: "CASCADE",
        allowNull:true,
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
    return queryInterface.dropTable("Laudo")
  }
};

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
        allowNull:true,
      },
      prop_cpf_cnpj:{
        type: Sequelize.STRING,
        allowNull:true,
      },
      prop_cnh:{
        type: Sequelize.STRING,
        allowNull:true,
      },
      prop_telefone:{
        type: Sequelize.STRING,
        allowNull:true,
      },
      prop_email:{
        type: Sequelize.STRING,
        allowNull:true,
      },
      cliente_id:{
        type: Sequelize.INTEGER,
        references: { model: "Cliente", key: "id"},
        onDelete: "CASCADE",
        allowNull:true,
      },
      perito_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Usuario',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      perito_auxiliar_id:{
        type: Sequelize.INTEGER,
        references: {
          model: 'Usuario',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      situacao:{
        type: Sequelize.STRING,
      },
      observacao:{
        type: Sequelize.STRING,
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

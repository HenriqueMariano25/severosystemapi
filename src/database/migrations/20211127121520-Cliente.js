'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("Cliente",{
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      nome_razao_social:{
        type: Sequelize.STRING,
        allowNull:false,
      },
      email:{
        type: Sequelize.STRING,
        allowNull:false,
      },
      cpf_cnpj:{
        type: Sequelize.STRING,
        allowNull:false,
      },
      cnh:{
        type: Sequelize.STRING,
        allowNull:false,
      },
      rua:{
        type: Sequelize.STRING,
        allowNull:false,
      },
      bairro:{
        type: Sequelize.STRING,
        allowNull:false,
      },
      cidade:{
        type: Sequelize.STRING,
        allowNull:false,
      },
      uf:{
        type: Sequelize.STRING,
        allowNull:false,
      },
      cep:{
        type: Sequelize.STRING,
        allowNull:false,
      },
      numero:{
        type: Sequelize.STRING,
        allowNull:false,
      },
      complemento:{
        type: Sequelize.STRING,
        allowNull:false,
      },
      telefone:{
        type: Sequelize.STRING,
        allowNull:false,
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
    return queryInterface.dropTable("Cliente")
  }
};

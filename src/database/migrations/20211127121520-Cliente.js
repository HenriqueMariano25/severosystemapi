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
      },
      cpf_cnpj:{
        type: Sequelize.STRING,
      },
      cnh:{
        type: Sequelize.STRING,
      },
      rua:{
        type: Sequelize.STRING,
      },
      bairro:{
        type: Sequelize.STRING,
      },
      cidade:{
        type: Sequelize.STRING,
      },
      uf:{
        type: Sequelize.STRING,
      },
      cep:{
        type: Sequelize.STRING,
      },
      numero:{
        type: Sequelize.STRING,
      },
      complemento:{
        type: Sequelize.STRING,
      },
      telefone:{
        type: Sequelize.STRING,
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

'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.createTable("CaixaLaudoTipo", {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            descricao: {
                type: Sequelize.STRING,
                allowNull:false
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            deleted_at:{
                type: Sequelize.DATE,
            }
        })
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.dropTable("CaixaLaudosTipo")
    },
};

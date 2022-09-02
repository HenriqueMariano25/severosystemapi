'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.createTable("CaixaDia", {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            data_abertura: {
                type: Sequelize.DATEONLY
            },
            data_fechamento: {
                type: Sequelize.DATEONLY
            },
            valor_total: {
                type: Sequelize.DECIMAL(10, 2)
            },
            valor_fechamento: {
                type: Sequelize.DECIMAL(10, 2)
            },
            status_caixa: {
                type: Sequelize.STRING
            },
            usuario_id: {
                type: Sequelize.INTEGER,
                references:{
                    model:'Usuario',
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
            deleted_at:{
                type: Sequelize.DATE,
            }



        })
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.dropTable("CaixaDia")
    },
};
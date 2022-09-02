'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.createTable("CaixaFormaLanc", {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            valor: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull:false
            },
            lancamento_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'CaixaLancamento',
                    key: 'id'
                }
            },
            forma_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'CaixaFormaTipo',
                    key: 'id'
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
        return queryInterface.dropTable("CaixaFormaLanc")
    },
};
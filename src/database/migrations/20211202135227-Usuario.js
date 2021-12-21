'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.createTable("Usuario", {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            nome: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            usuario: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            statu_usuario_id: {
                type: Sequelize.INTEGER,
                references: {model: "StatuUsuario", key: "id"},
                onDelete: "CASCADE",
                allowNull: true
            },
            cargo: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            perito: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
            },
            perito_auxiliar: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            data_admissao: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            senha_hash: {
                type: Sequelize.STRING,
                allowNull: false
            },
            tipo_usuario_id: {
                type: Sequelize.INTEGER,
                references: {model: "TipoUsuario", key: "id"},
                onDelete: "CASCADE",
                allowNull: false
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
        })
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.dropTable("Usuario")
    }
};
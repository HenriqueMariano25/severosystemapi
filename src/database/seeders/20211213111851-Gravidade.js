'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert("Gravidade", [
                {
                    descricao: 'ok',
                    icone: 'mdi-check',
                    cor: 'success',
                    created_at: new Date(),
                    updated_at: new Date()
                },
                {
                    descricao: 'atenção',
                    icone: 'mdi-exclamation',
                    cor: 'yellow darken-1',
                    created_at: new Date(),
                    updated_at: new Date()
                },
                {
                    descricao: 'problema',
                    icone: 'mdi-close',
                    cor: 'red darken-4',
                    created_at: new Date(),
                    updated_at: new Date()
                },
            ]
        )
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Gravidade', null, {});
    }
};

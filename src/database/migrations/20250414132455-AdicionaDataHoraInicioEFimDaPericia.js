"use strict"

/** @type {import("sequelize-cli").Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.addColumn("Laudo", "data_abertura_processamento", {
				type: Sequelize.STRING
			}),
			queryInterface.addColumn("Laudo", "data_fechamento_processamento", {
				type: Sequelize.STRING
			}),
		])
	},

	async down(queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.removeColumn("Laudo", "data_abertura_processamento"),
			queryInterface.removeColumn("Laudo", "data_fechamento_processamento"),
		])
	},
}

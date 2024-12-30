"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.addColumn("Cliente", "tipo_cliente", {
				type: Sequelize.STRING,
			}),
			queryInterface.addColumn("Cliente", "valor_desconto", {
				type: Sequelize.STRING,
			}),
		])
	},

	async down(queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.removeColumn("Cliente", "tipo_cliente"),
			queryInterface.removeColumn("Cliente", "valor_desconto"),
		])
	},
}

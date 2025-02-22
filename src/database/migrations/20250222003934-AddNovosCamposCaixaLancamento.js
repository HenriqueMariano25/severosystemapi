"use strict"

/** @type {import("sequelize-cli").Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.addColumn("CaixaLancamento", "valor_desconto", {
				type: Sequelize.FLOAT,
			}),
			queryInterface.addColumn("CaixaLancamento", "valor_servico", {
				type: Sequelize.FLOAT,
			}),
			queryInterface.addColumn("CaixaLancamento", "cliente_id", {
				type: Sequelize.INTEGER,
				allowNull: true,
				references: {
					model: "Cliente",
					key: "id",
				},
				onUpdate: "SET NULL",
				onDelete: "SET NULL",
			}),
			queryInterface.addColumn("CaixaLancamento", "tipo_servico_id", {
				type: Sequelize.INTEGER,
				allowNull: true,
				references: {
					model: "TipoServico",
					key: "id",
				},
				onUpdate: "SET NULL",
				onDelete: "SET NULL",
			}),
			queryInterface.changeColumn("CaixaLancamento", "descricao", {
				type: Sequelize.STRING,
				allowNull: true,
			}),
		])
	},

	async down(queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.removeColumn("CaixaLancamento", "valor_desconto"),
			queryInterface.removeColumn("CaixaLancamento", "valor_servico"),
			queryInterface.removeColumn("CaixaLancamento", "cliente_id"),
			queryInterface.removeColumn("CaixaLancamento", "tipo_servico_id"),
			queryInterface.changeColumn("CaixaLancamento", "descricao", {
				type: Sequelize.STRING,
				allowNull: false,
			}),
		])
	},
}

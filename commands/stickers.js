const { Collection, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');

const db = new QuickDB();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stickers')
		.setDescription('Provides stats on sticker usage.')
		.addSubcommand(subcommand => subcommand
			.setName('top')
			.setDescription('Sort from top to bottom.'))
		.addSubcommand(subcommand => subcommand
			.setName('bottom')
			.setDescription('Sort from bottom to top.')),
	async execute(interaction) {
		const serverTable = db.table(`stickers_${interaction.guildId}`);
        const allData = await serverTable.all();

		const filteredData = allData.filter(entry => entry.value.guild === interaction.guild.id);
		const sortedData = filteredData.sort((a, b) => b.value.uses - a.value.uses);

		const topEntries = sortedData.slice(0, 5);

		let list = '';
		for (const entry of topEntries) {
			try {
				sticker = await interaction.client.fetchSticker(entry.id);
			} catch(error) {
				console.error(`Sticker ${entry.id} no longer exists!`);
				continue;
			}

			list += `[${sticker.name}](${sticker.url}) - **${entry.value.uses}** uses\n`;
		};

        const embed = new EmbedBuilder()
			.setTitle('Top 5 Stickers')
			.setDescription(list)

		await interaction.reply({ embeds: [embed] });
	},
};
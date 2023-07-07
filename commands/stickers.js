const { Collection, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');

const db = new QuickDB();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stickers')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		const serverTable = db.table(`stickers_${interaction.guildId}`);
        const allData = await serverTable.all();

		const filteredData = allData.filter(entry => entry.value.guild === interaction.guild.id);
		const sortedData = filteredData.sort((a, b) => b.value.uses - a.value.uses);

		const topEntries = sortedData.slice(0, 5);

		let list = '';
		for (const entry of topEntries) {
			const sticker = await interaction.client.fetchSticker(entry.id);
			list += `[${sticker.name}](${sticker.url}) - **${entry.value.uses}** uses\n`;
		};

        const embed = new EmbedBuilder()
            .setColor(0x55ACEE)
            .setTitle('Top 5 Stickers')
            .setDescription(list)

		await interaction.reply({ embeds: [embed] });
	},
};
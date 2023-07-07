const { Collection, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');

const db = new QuickDB();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stickers')
		.setDescription('Provides stats on sticker usage.')
		.setDMPermission(false)
		.addSubcommand(subcommand => subcommand
			.setName('list')
			.setDescription('List the sticker usage for this server.')
			.addStringOption(option => option
				.setName('sort')
				.setDescription('Sort order')
				.setRequired(true)
				.addChoices(
					{ name: 'Most Used', value: 'top' },
					{ name: 'Least Used', value: 'bottom' },
				))
			.addBooleanOption(option => option
				.setName('external')
				.setDescription('Include stickers from other servers in the listing.')))
		.addSubcommand(subcommand => subcommand
			.setName('stats')
			.setDescription('Show some statistics for this server.')),
	async execute(interaction) {
		await interaction.deferReply();

		const serverTable = db.table(`stickers_${interaction.guildId}`);
        const allData = await serverTable.all();
		const filteredData = allData.filter(entry => entry.value.guild === interaction.guild.id);

		let sortedData = filteredData.sort((a, b) => b.value.uses - a.value.uses);
		if (interaction.options.getBoolean('external')) {
			sortedData = allData.sort((a, b) => b.value.uses - a.value.uses);
		};

		const entries = (interaction.options.getString('sort') === 'top') ? sortedData.slice(0, 10) : sortedData.slice(-10);

		if (entries.length === 0) {
			return await interaction.editReply({ content: `No stickers have been logged yet!` });
		};

		let list = '';
		for (const entry of entries) {
			try {
				sticker = await interaction.client.fetchSticker(entry.id);
			} catch(error) {
				// Sticker likely no longer exists
				if (entry.value.name) {
					list += `~~${entry.value.name} - **${entry.value.uses}** uses~~\n`
				}
				continue;
			}

			list += `[${sticker.name}](${sticker.url}) - **${entry.value.uses}** uses\n`;
		};

        const listEmbed = new EmbedBuilder()
			.setTitle(`Sticker listing for ${interaction.guild.name}`)
			.setDescription(list)

		await interaction.editReply({ embeds: [listEmbed] });
	},
};
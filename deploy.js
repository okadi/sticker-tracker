const { REST, Routes } = require('discord.js');
const { client, guild, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	if ('data' in command && 'execute' in command) {
		commands.push(command.data.toJSON());
	}
	else {
		console.log(`[WARNING] The command at ${filePath} is missing a required property. Required properites: data, category, execute.`);
	}
}

const rest = new REST().setToken(token);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application commands.`);

		await rest.put(
			Routes.applicationGuildCommands(client, guild),
			{ body: commands },
		);
	}
	catch (error) {
		console.error(error);
	}
})();
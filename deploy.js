require('dotenv').config();

const { REST, Routes } = require('discord.js');

const commands = require('./commands');

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {

    try {

        console.log(`[SYSTEM] Refreshing ${commands.length} slash commands...`);

        await rest.put(

            Routes.applicationCommands(process.env.CLIENT_ID),

            { body: commands },

        );

        console.log('[SYSTEM] Successfully reloaded slash commands.');

    } catch (error) {

        console.error(error);

    }

})();


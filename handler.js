const { EmbedBuilder } = require('discord.js');

module.exports = async (interaction) => {

    const { commandName, guild, client } = interaction;

    try {

        if (commandName === 'ping') return interaction.reply(`🛰️ **Latency:** ${client.ws.ping}ms`);

        if (commandName === 'serverinfo') return interaction.reply(`📊 **Server:** ${guild.name}\n🆔 **ID:** ${guild.id}`);

        if (commandName === 'about') {

            const embed = new EmbedBuilder()

                .setColor("#2f3136")

                .setTitle("🔱 Aegis System Framework")

                .setDescription("Advanced management framework.")

                .addFields({ name: "Version", value: "1.1.0", inline: true });

            return interaction.reply({ embeds: [embed] });

        }

    } catch (e) {

        if (!interaction.replied) interaction.reply({ content: "⚠️ Error occurred.", ephemeral: true });

    }

};


const { SlashCommandBuilder } = require('discord.js');

module.exports = [

    new SlashCommandBuilder().setName('ping').setDescription('Check system latency'),

    new SlashCommandBuilder().setName('serverinfo').setDescription('View network statistics'),

    new SlashCommandBuilder().setName('about').setDescription('System information'),

    new SlashCommandBuilder().setName('invite').setDescription('Generate access link'),

    new SlashCommandBuilder().setName('help').setDescription('View public commands')

].map(c => c.toJSON());


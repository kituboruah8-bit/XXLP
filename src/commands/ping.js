import { SlashCommandBuilder } from 'discord.js';
import { logger } from '../utils/logger.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check bot latency'),

  async execute(interaction) {
    const latency = interaction.client.ws.ping;
    logger.info(`Ping command executed - latency: ${latency}ms`);
    await interaction.reply({
      content: `🏓 Pong! Latency: ${latency}ms`,
      ephemeral: true,
    });
  },
};

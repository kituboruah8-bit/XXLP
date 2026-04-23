import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import path from 'path';
import fs from 'fs';
import { logger } from '../utils/logger.js';
import { getFileSize, formatFileSize } from '../utils/fileHandler.js';
import { config } from '../config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('files')
    .setDescription('List all available files for delivery'),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const files = fs.readdirSync(config.filesDir)
        .filter(f => fs.statSync(path.join(config.filesDir, f)).isFile())
        .map(f => ({
          name: f,
          size: getFileSize(path.join(config.filesDir, f)),
        }))
        .sort((a, b) => b.size - a.size);

      if (files.length === 0) {
        return await interaction.editReply({
          content: '📁 No files available for delivery',
        });
      }

      const embed = new EmbedBuilder()
        .setTitle('📦 Available Files for Delivery')
        .setColor('#2ecc71')
        .setDescription(files.slice(0, 25).map(f => `\`${f.name}\` - ${formatFileSize(f.size)}`).join('\n'))
        .setFooter({ text: `Total: ${files.length} files` })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
      logger.info(`Listed ${files.length} files`);
    } catch (error) {
      logger.error(`Error listing files: ${error.message}`);
      await interaction.editReply({
        content: '❌ Error listing files',
      });
    }
  },
};

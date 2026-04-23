import { SlashCommandBuilder, AttachmentBuilder } from 'discord.js';
import path from 'path';
import fs from 'fs';
import { logger } from '../utils/logger.js';
import { isValidFile, formatFileSize, getFileSize } from '../utils/fileHandler.js';
import { config } from '../config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('send')
    .setDescription('Send a file to a client')
    .addUserOption(option =>
      option
        .setName('client')
        .setDescription('The client to send the file to')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('filename')
        .setDescription('Name of the file in the files directory')
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addStringOption(option =>
      option
        .setName('message')
        .setDescription('Message to send with the file')
        .setRequired(false)
    ),

  async autocomplete(interaction) {
    const files = fs.readdirSync(config.filesDir).filter(f => fs.statSync(path.join(config.filesDir, f)).isFile());
    const focusedValue = interaction.options.getFocused();
    const filtered = files.filter(f => f.toLowerCase().startsWith(focusedValue.toLowerCase())).slice(0, 25);
    await interaction.respond(filtered.map(f => ({ name: f, value: f })));
  },

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const client = interaction.options.getUser('client');
      const filename = interaction.options.getString('filename');
      const message = interaction.options.getString('message') || 'Here is your file';

      // Validate file path to prevent directory traversal
      const filePath = path.join(config.filesDir, filename);
      const resolvedPath = path.resolve(filePath);
      const resolvedDir = path.resolve(config.filesDir);

      if (!resolvedPath.startsWith(resolvedDir)) {
        return await interaction.editReply({
          content: '❌ Invalid file path',
        });
      }

      // Check if file exists and is valid
      const validation = isValidFile(filePath, config.maxFileSize);
      if (!validation.valid) {
        return await interaction.editReply({
          content: `❌ ${validation.error}`,
        });
      }

      const fileSize = getFileSize(filePath);
      const attachment = new AttachmentBuilder(filePath, { name: filename });

      // Send file to client via DM
      try {
        await client.send({
          content: `📦 **File Delivery**\n\n${message}\n\n**File:** ${filename}\n**Size:** ${formatFileSize(fileSize)}`,
          files: [attachment],
        });

        logger.info(`Sent file ${filename} to ${client.tag}`);
        await interaction.editReply({
          content: `✅ File sent to ${client.tag}`,
        });
      } catch (error) {
        logger.error(`Failed to send file to ${client.tag}: ${error.message}`);
        await interaction.editReply({
          content: `❌ Failed to send file. User may have closed DMs or is offline.`,
        });
      }
    } catch (error) {
      logger.error(`Error in send command: ${error.message}`);
      await interaction.editReply({
        content: '❌ An error occurred while processing your request',
      });
    }
  },
};

import { logger } from '../utils/logger.js';

export default {
  name: 'interactionCreate',
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        logger.error(`No command matching ${interaction.commandName} was found.`);
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        logger.error(`Error executing command ${interaction.commandName}: ${error.message}`);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: '❌ There was an error while executing this command!',
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: '❌ There was an error while executing this command!',
            ephemeral: true,
          });
        }
      }
    }
  },
};

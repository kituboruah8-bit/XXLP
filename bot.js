import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import { config } from './src/config.js';
import { logger } from './src/utils/logger.js';
import { loadCommands, loadEvents } from './src/utils/loaders.js';
import { ensureDirectoryExists } from './src/utils/fileHandler.js';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

// Ensure required directories exist
ensureDirectoryExists(config.uploadDir);
ensureDirectoryExists(config.filesDir);

logger.info(`🚀 Starting Discord Bot`);
logger.info(`📍 Environment: ${config.nodeEnv}`);

// Initialize Discord Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

// Load commands and events
await loadCommands(client);
await loadEvents(client);

// Register slash commands
async function registerCommands() {
  try {
    const rest = new REST({ version: '10' }).setToken(config.token);
    const commandsPath = './src/commands';
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    const commands = [];
    for (const file of commandFiles) {
      const filePath = path.resolve(commandsPath, file);
      const fileUrl = pathToFileURL(filePath).href;
      const command = await import(fileUrl);
      if (command.default && command.default.data) {
        commands.push(command.default.data.toJSON());
      }
    }

    logger.info(`🔄 Registering ${commands.length} slash commands...`);

    if (config.guildId) {
      // Register to specific guild (faster for testing)
      await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), {
        body: commands,
      });
      logger.info(`✅ Registered commands to guild`);
    } else {
      // Register globally (takes up to 1 hour)
      await rest.put(Routes.applicationCommands(config.clientId), {
        body: commands,
      });
      logger.info(`✅ Registered commands globally`);
    }
  } catch (error) {
    logger.error(`Failed to register commands: ${error.message}`);
  }
}

// Event handlers
client.on('warn', info => logger.warn(info));
client.on('error', error => logger.error(`Discord Client Error: ${error.message}`));

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at ${promise}: ${reason}`);
});

process.on('uncaughtException', error => {
  logger.error(`Uncaught Exception: ${error.message}`);
});

// Login to Discord
async function start() {
  try {
    logger.info('🔐 Logging into Discord...');
    await client.login(config.token);
    await registerCommands();
  } catch (error) {
    logger.error(`Failed to start bot: ${error.message}`);
    process.exit(1);
  }
}

start();

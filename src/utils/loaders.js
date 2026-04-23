import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { logger } from './logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function loadCommands(client) {
  const commandsPath = path.join(__dirname, '../commands');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.resolve(commandsPath, file);
    const fileUrl = pathToFileURL(filePath).href;
    const command = await import(fileUrl);

    if (command.default && command.default.data && command.default.execute) {
      client.commands = client.commands || new Map();
      client.commands.set(command.default.data.name, command.default);
      logger.info(`Loaded command: ${command.default.data.name}`);
    } else {
      logger.warn(`Skipping ${file} - missing data or execute function`);
    }
  }

  return client.commands || new Map();
}

export async function loadEvents(client) {
  const eventsPath = path.join(__dirname, '../events');
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

  for (const file of eventFiles) {
    const filePath = path.resolve(eventsPath, file);
    const fileUrl = pathToFileURL(filePath).href;
    const event = await import(fileUrl);

    if (event.default && event.default.name && event.default.execute) {
      if (event.default.once) {
        client.once(event.default.name, (...args) => event.default.execute(...args));
      } else {
        client.on(event.default.name, (...args) => event.default.execute(...args));
      }
      logger.info(`Loaded event: ${event.default.name}`);
    } else {
      logger.warn(`Skipping ${file} - missing name or execute function`);
    }
  }
}

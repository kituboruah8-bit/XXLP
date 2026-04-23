import { logger } from '../utils/logger.js';

export default {
  name: 'ready',
  once: true,
  execute(client) {
    logger.info(`✅ Bot logged in as ${client.user.tag}`);
    logger.info(`🤖 Bot is ready to serve ${client.users.cache.size} users`);
    client.user.setActivity('file deliveries', { type: 'WATCHING' });
  },
};

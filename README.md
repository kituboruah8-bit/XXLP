# Discord File Delivery Bot

A production-ready Discord bot for delivering files and RAR files to your clients with easy deployment to Railway.

## Features

- 📦 Send files directly to Discord users
- 📁 Manage multiple files for distribution
- 🔒 Secure file handling with validation
- 🚀 Ready for Railway deployment
- 📊 Built-in logging and error handling
- ⚡ Slash commands for easy interaction
- 🛡️ Environment-based configuration

## Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager
- Discord Bot Token
- Discord Server/Guild ID (for testing)

## Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd discord-file-delivery-bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here
MAX_FILE_SIZE=26214400
UPLOAD_DIR=./uploads
FILES_DIR=./files
NODE_ENV=production
```

### 4. Add Files to Deliver

Place all files you want to deliver in the `./files` directory:

```
files/
├── document.pdf
├── archive.rar
└── software.zip
```

## Running the Bot

### Development Mode

```bash
npm run dev
```

This uses Node's `--watch` flag to auto-reload on file changes.

### Production Mode

```bash
npm start
```

## Commands

### `/ping`
Check bot latency and connectivity.

### `/files`
List all available files for delivery with their sizes.

### `/send`
Send a file to a specific user.
- **client**: Target Discord user
- **filename**: File to send (autocomplete available)
- **message**: Optional message with the file

## Project Structure

```
discord-file-delivery-bot/
├── bot.js                 # Main bot entry point
├── package.json           # Project dependencies
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
├── railway.json           # Railway deployment config
├── Procfile               # Process file for Railway
├── src/
│   ├── config.js          # Configuration loader
│   ├── commands/          # Slash commands
│   │   ├── ping.js
│   │   ├── files.js
│   │   └── send.js
│   ├── events/            # Event handlers
│   │   ├── ready.js
│   │   └── interactionCreate.js
│   └── utils/             # Utility functions
│       ├── fileHandler.js
│       ├── logger.js
│       └── loaders.js
├── files/                 # Files for delivery
├── uploads/               # Temporary upload directory
└── README.md
```

## Deployment to Railway

### 1. Create Railway Account

Visit [railway.app](https://railway.app) and sign up.

### 2. Connect GitHub Repository

1. Go to Railway Dashboard
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Authorize and select this repository

### 3. Configure Environment Variables

In Railway dashboard:
1. Go to your project variables
2. Add all variables from `.env.example`:
   - `DISCORD_TOKEN`
   - `CLIENT_ID`
   - `GUILD_ID`
   - `NODE_ENV=production`

### 4. Deploy

1. Connect the repository
2. Railway automatically deploys on push to main branch
3. View logs in the Railway dashboard

## Deployment to GitHub

### 1. Create GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/discord-file-delivery-bot.git
git push -u origin main
```

### 2. Push to GitHub

```bash
git push origin main
```

The repository is now linked to Railway for automatic deployments.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DISCORD_TOKEN` | Your Discord bot token | Required |
| `CLIENT_ID` | Your Discord app client ID | Required |
| `GUILD_ID` | Your test server guild ID | Optional |
| `MAX_FILE_SIZE` | Maximum file size in bytes | 26214400 (25MB) |
| `UPLOAD_DIR` | Directory for uploads | ./uploads |
| `FILES_DIR` | Directory for files to distribute | ./files |
| `NODE_ENV` | Environment (development/production) | production |

## Creating Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Go to "Bot" section and click "Add Bot"
4. Copy the token and add to `.env` as `DISCORD_TOKEN`
5. Go to "OAuth2" > "URL Generator"
6. Select scopes: `bot`
7. Select permissions: `Send Messages`, `Read Messages`, `Use Slash Commands`, `Manage Messages`
8. Copy the generated URL and use it to invite the bot to your server

## Error Handling

The bot includes comprehensive error handling:
- File validation before sending
- User DM fallback with error messages
- Automatic reconnection on disconnect
- Detailed logging for debugging

## Logging

All events are logged with timestamps:
- `[INFO]` - Informational messages
- `[ERROR]` - Error messages
- `[WARN]` - Warning messages
- `[DEBUG]` - Debug messages (development only)

View logs:
- **Local**: Console output
- **Railway**: Logs tab in dashboard

## Troubleshooting

### Bot doesn't respond to commands
- Verify `DISCORD_TOKEN` and `CLIENT_ID` are correct
- Check bot has "Use Slash Commands" permission
- Ensure bot is in the server
- Wait 1 hour for global command registration

### File won't send
- Check file exists in `./files` directory
- Verify file size is under 25MB limit
- Ensure user has DMs enabled
- Check bot has "Send Messages" permission in DMs

### Railway deployment fails
- Verify all environment variables are set
- Check Railway logs for errors
- Ensure Node.js version requirement is met
- Verify no secrets are in committed code

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review Railway and Discord documentation
3. Check bot logs for error messages

## License

MIT License - feel free to use for personal or commercial projects

## Security Notes

- Never commit `.env` file to GitHub
- Use `.env.example` for template only
- Rotate bot token regularly
- Keep Discord.js updated
- Review user permissions before deployment

---

Made with ❤️ for Discord developers

const blessed = require('blessed');
const chalk = require('chalk');
const { spawn } = require('child_process');
const os = require('os');
const moment = require('moment');
const figlet = require('figlet');

const screen = blessed.screen({
  smartCSR: true,
  title: 'CC Admin Console'
});

const box = blessed.box({
  top: 0,
  left: 0,
  width: '80%',
  height: '100%',
  content: '',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'black',
    border: {
      fg: '#00FFFF' 
    },
  }
});

const consoleBox = blessed.box({
  top: 0,
  right: 0,
  width: '20%',
  height: '100%',
  content: '{underline}Console{/underline}',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'cyan',
    bg: 'black', 
    border: {
      fg: '#00FFFF' 
    },
  }
});

screen.append(box);
screen.append(consoleBox);

let bot = null;
let botStartTime = null;
let lastButtonUsed = null;
let botStatus = 'Offline';
let botUsername = 'Clarity Control#7889'; 


function startBot() {
  if (bot) {
    writeToConsole(chalk.blue('Bot is already running. Please stop the bot first.'));
    return;
  }

  bot = spawn('node', ['index.js'], {
    stdio: ['pipe', 'pipe', 'pipe', 'pipe', 'pipe', 'pipe', process.stderr]
  });

  botStartTime = moment();
  botStatus = 'Online';

  updateStats(); 
  lastButtonUsed = 'S';

  bot.on('error', (err) => {
    writeToConsole(chalk.cyan(`Error starting bot: ${err.message}`));
  });

  bot.stdout.on('data', (data) => {
    writeToConsole(data.toString());
  });

  bot.stderr.on('data', (data) => {
    writeToConsole(chalk.cyan(data.toString()));
  });
}

function stopBot() {
  if (!bot) {
    writeToConsole(chalk.cyan('Bot is not running. Please start the bot first.'));
    return;
  }

  writeToConsole(chalk.cyan('Stopping bot...'));

  bot.kill();
  bot = null;
  botStatus = 'Offline';
  lastButtonUsed = 'X';

  setTimeout(() => {
    updateStats(); 
  }, 1000);
}

function restartBot() {
  stopBot();
  setTimeout(() => {
    startBot();
    writeToConsole(chalk.cyan('Bot restarted.'));
  }, 1000); 
  lastButtonUsed = 'R';
}

function refreshConsole() {
  lastButtonUsed = 'L';
  consoleBox.setContent('{underline}Console{/underline}');
  writeToConsole('Console refreshed.');
  screen.render();
}

let title = '';
figlet.text('HENREH', {
  font: 'Standard',
  horizontalLayout: 'default',
  verticalLayout: 'default',
  width: 80,
  whitespaceBreak: true
}, function(err, data) {
  if (err) {
    console.log('Something went wrong...');
    console.dir(err);
    return;
  }
  title = chalk.cyan(data); 
});

function updateStats() {
  const serverUptime = moment.duration(os.uptime() * 1000).humanize();
  const totalMemory = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + ' GB';
  const cpuCores = os.cpus().length.toString();
  const osInfo = `${os.type()} (${os.release()})`;

  const botUptime = botStartTime ? moment.duration(moment().diff(botStartTime)).humanize() : 'Not available';
  const botMemoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024 / 1024).toFixed(2) + ' GB';

  box.setContent(`${title}\n\n` +
    `${chalk.cyan('Clarity Control Status:')} ${botStatus === 'Online' ? chalk.cyan(botStatus) : chalk.cyan(botStatus)}\n\n` +
    `${chalk.cyan('Creator:')} ${chalk.cyan('HENREH')}\n` +
    `${chalk.cyan('Bot Username:')} ${chalk.cyan(botUsername)}\n\n` +
    `${chalk.cyan('Server Uptime:')} ${chalk.cyan(serverUptime)}\n` +
    `${chalk.cyan('Total Memory:')} ${chalk.cyan(totalMemory)}\n` +
    `${chalk.cyan('Bot Uptime:')} ${chalk.cyan(botUptime)}\n` +
    `${chalk.cyan('Bot Memory Usage:')} ${chalk.cyan(botMemoryUsage)}\n` +
    `${chalk.cyan('CPU Cores:')} ${chalk.cyan(cpuCores)}\n` +
    `${chalk.cyan('OS Info:')} ${chalk.cyan(osInfo)}\n\n` +
    `${chalk.cyan('Commands:')}\n` +
    `${chalk.cyan('S')} - ${chalk.cyan('Start Bot')}\n` +
    `${chalk.cyan('X')} - ${chalk.cyan('Stop Bot')}\n` +
    `${chalk.cyan('R')} - ${chalk.cyan('Restart Bot')}\n` +
    `${chalk.cyan('L')} - ${chalk.cyan('Refresh Console')}\n` +
    `${chalk.cyan('Last Button Used:')} ${chalk.cyan(lastButtonUsed || 'None')}\n\n` +
    `${chalk.cyan('Press')} ${chalk.cyan('Ctrl+C')} ${chalk.cyan('to stop the bot and exit.')}`
  );
  screen.render();
}

function writeToConsole(message) {
  const content = consoleBox.getContent();
  const newContent = `${content}\n${chalk.cyan(message)}`;
  consoleBox.setContent(newContent);
  screen.render();
}

updateStats();
setInterval(updateStats, 60000);

process.on('SIGINT', () => {
  stopBot();
  setTimeout(() => {
    process.exit(0);
  }, 1000);
});

screen.key(['S', 's'], () => {
  startBot();
});

screen.key(['X', 'x'], () => {
  stopBot();
});

screen.key(['R', 'r'], () => {
  restartBot();
});

screen.key(['L', 'l'], () => {
  refreshConsole();
});

screen.render();

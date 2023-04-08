const { Snake } = require('discord-gamecord');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('snake')
    .setDescription('Im a snakeee'),
    async execute (interaction) {

        const Game = new Snake({
            message: interaction,
            isSlashGame: false,
            embed: {
              title: 'Snake Game',
              overTitle: 'Game Over',
              color: '#5865F2'
            },
            emojis: {
              board: '⬛',
              food: '🍎',
              up: '⬆️', 
              down: '⬇️',
              left: '⬅️',
              right: '➡️',
            },
            snake: { head: '🟢', body: '🟩', tail: '🟢', over: '💀' },
            foods: ['🍎', '🍇', '🍊', '🫐', '🥕', '🥝', '🌽'],
            stopButton: 'Stop',
            timeoutTime: 60000,
            playerOnlyMessage: 'Only {player} can use these buttons.'
          });
          
          Game.startGame();
          Game.on('gameOver', result => {
            console.log(result);  // =>  { result... }
          });
    }
}

    //HSSSSSSSSSSS//
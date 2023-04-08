const { Minesweeper } = require('discord-gamecord');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('minesweeper')
    .setDescription('Its minesweeper, for coheesion.'),
    async execute (interaction) {
        const Game = new Minesweeper({
            message: interaction,
            isSlashGame: false,
            embed: {
              title: 'Minesweeper',
              color: '#5865F2',
              description: 'Click on the buttons to reveal the blocks except mines.'
            },
            emojis: { flag: '🚩', mine: '💣' },
            mines: 5,
            timeoutTime: 60000,
            winMessage: 'You won the Game! Go outside.',
            loseMessage: 'You lost the Game! Sounds like a skill issue to me.',
            playerOnlyMessage: 'Only {player} can use these buttons.'
          });
          
          Game.startGame();
          Game.on('gameOver', result => {
            console.log(result);  // =>  { result... }
          });
    }
}

//For cohen//


const { SlashCommandBuilder } = require(`discord.js`);

const { TicTacToe } = require('discord-gamecord');
module.exports = {
    data: new SlashCommandBuilder()
    .setName(`tic-tac-toe`)
    .setDescription(`Tic tac toe for you children!`)
    .addUserOption(option => option.setName('opponent').setDescription(`The person to loose.`).setRequired(true)),
    async execute (interaction) {
        
        const Game = new TicTacToe({
            message: interaction,
            isSlashGame: true,
            opponent: interaction.options.getUser('opponent'),
            embed: {
              title: 'Tic Tac Toe',
              color: '#FF0000',
              statusTitle: 'Status',
              overTitle: 'Game Over'
            },
            emojis: {
              xButton: '❌',
              oButton: '🔵',
              blankButton: '➖'
            },
            mentionUser: true,
            timeoutTime: 60000,
            xButtonStyle: 'DANGER',
            oButtonStyle: 'PRIMARY',
            turnMessage: '{emoji} | Its turn of player **{player}**.',
            winMessage: '{emoji} | **{player}** won the TicTacToe Game. Mega W',
            tieMessage: 'The Game tied! You both lost',
            timeoutMessage: 'The Game went unfinished! You both lost!',
            playerOnlyMessage: 'Only {player} and {opponent} can use these buttons.'
          });
          
          Game.startGame();
          Game.on('gameOver', result => {
            console.log(result);  // =>  { result... }
          });
    }
}
    


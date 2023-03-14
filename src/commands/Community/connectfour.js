const { SlashCommandBuilder } = require(`discord.js`);

const { Connect4 } = require('discord-gamecord');
module.exports = {
    data: new SlashCommandBuilder()
    .setName(`connect4`)
    .setDescription(`Connect four for you children!`)
    .addUserOption(option => option.setName('opponent').setDescription(`The person to loose.`).setRequired(true)),
    async execute (interaction) {

        const Game = new Connect4({
            message: interaction,
            isSlashGame: true,
            opponent: interaction.options.getUser('opponent'),
            embed: {
              title: 'Connect4 Game',
              statusTitle: 'Status',
              color: '#FF0000'
            },
            emojis: {
              board: '⚪',
              player1: '🔴',
              player2: '🟡'
            },
            mentionUser: true,
            timeoutTime: 60000,
            buttonStyle: 'PRIMARY',
            turnMessage: '{emoji} | Its turn of player **{player}**.',
            winMessage: '{emoji} | **{player}** won the Connect4 Game. What a chad!',
            tieMessage: 'The Game tied! That was boring!',
            timeoutMessage: 'The Game went unfinished! You both lost haha imagine!',
            playerOnlyMessage: 'Only {player} and {opponent} can use these buttons.'
          });
          
          Game.startGame();
          Game.on('gameOver', result => {
            console.log(result);  // =>  { result... }
          });
    }
}
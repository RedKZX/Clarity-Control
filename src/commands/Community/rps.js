const { SlashCommandBuilder } = require(`discord.js`);

const { RockPaperScissors } = require('discord-gamecord');
module.exports = {
    data: new SlashCommandBuilder()
    .setName(`rock-paper-scissors`)
    .setDescription(`If you dont pick rock you will loose!`)
    .addUserOption(option => option.setName('opponent').setDescription(`The person to loose.`).setRequired(true)),
    async execute (interaction) {

  const Game = new RockPaperScissors({
  message: interaction,
  isSlashGame: true,
  opponent: interaction.options.getUser('opponent'),
  embed: {
    title: 'Rock Paper Scissors',
    color: '#FF0000',
    description: 'Press a button below to make the hardest choice.'
  },
  buttons: {
    rock: 'Rock',
    paper: 'Paper',
    scissors: 'Scissors'
  },
  emojis: {
    rock: '🌑',
    paper: '📰',
    scissors: '✂️'
  },
  mentionUser: true,
  timeoutTime: 60000,
  buttonStyle: 'PRIMARY',
  pickMessage: 'You choose {emoji}.',
  winMessage: '**{player}** won the Game! Ave it!',
  tieMessage: 'The Game tied! No one won the Game, you guys are boring!',
  timeoutMessage: 'The Game went unfinished! You both lost!',
  playerOnlyMessage: 'Only {player} and {opponent} can use these buttons.'
});

Game.startGame();
Game.on('gameOver', result => {
  console.log(result);  // =>  { result... }
});
    }
}

//Rock is the best!
    






    

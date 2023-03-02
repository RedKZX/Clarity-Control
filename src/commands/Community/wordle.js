const { Wordle } = require('discord-gamecord');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('wordle')
    .setDescription('Its wordle, simple as.'),
    async execute (interaction) {

        const Game = new Wordle({
            message: interaction,
            isSlashGame: false,
            embed: {
                title: `Wordle`,
                color: `#FF0000`
            },
            customWord: null,
            timeoutTime: 60000,
            winMessage: 'Nice job, you won! The word was **{word}**',
            loseMessage: 'Hahaha you lost! The word was **{word}**',
            playerOnlyMessage: 'Only {player} can use these buttons.'
        });

        Game.startGame();
        Game.on('gameOver', result => {
            return;
        })
    }
}

//WoRDle//
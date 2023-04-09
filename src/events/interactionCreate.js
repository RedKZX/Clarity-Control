const { Interaction } = require("discord.js");
const fetch = require('node-fetch');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return
        
        try{
            await command.execute(interaction, client);
        } catch (error) {
            console.log(error);

            async (err) => {
                await interaction.reply({
                    content: 'Red has broken something! Do `/issues`.', 
                    ephemeral: true
                }).catch(err);  
            }
        } 
    },
};

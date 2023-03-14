const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('dm')
    .setDescription('Messages a user, only available for the owner of the bot.')
    .addStringOption(option => option.setName('message').setDescription('Specified message will be sent to specified user.').setRequired(true))
    .addUserOption(option => option.setName('user').setDescription('Specified user will be sent the specified message.').setRequired(true)),
    async execute(interaction) {

        const user = interaction.options.getUser('user');
        const message = interaction.options.getString('message');

        if (interaction.user.id === `756849096479866996`) {
            user.send({ content: `${message}` }).catch(err => {
                return;
            })
        
            interaction.reply({ content: `Your message has **successfuly** been sent!`, ephemeral: true})
        } else {
            return interaction.reply({ content: `Only **the owner** of Mini Red can do this.`, ephemeral: false})
        } 
    }
}
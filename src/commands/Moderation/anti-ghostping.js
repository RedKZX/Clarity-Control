const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const ghostSchema = require('../../Schemas.js/ghostpingSchema');
const numSchema = require('../../Schemas.js/ghostNum');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('anit-ghostping')
    .setDescription('Sets up the anit ghost ping system')
    .addSubcommand(command => command.setName('setup').setDescription('Setup the Anti Ghost Ping System'))
    .addSubcommand(command => command.setName('disable').setDescription('Disable the Anit Ghost Ping System'))
    .addSubcommand(command => command.setName('number-reset').setDescription('Reset a Users Ghost Ping count').addUserOption(option => option.setName('user').setDescription('The user you want to reset the number of ghost pings of').setRequired(true))),
    async execute (interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'Red doesnt let you do this!'})

        const { options } = interaction;
        const sub = options.getSubcommand();

        const Data = await ghostSchema.findOne({Guild: interaction.guild.id});

        switch (sub) {
            case 'setup':
                
            if (Data) return await interaction.reply({ content: 'You already have the AGP system setup'});
            else {
                await ghostSchema.create({
                    Guild: interaction.guild.id
                })

                const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription('The AGP system has been setup and Red has done something')

                await interaction.reply({ embeds: [embed] });
            }

            break;

            case 'disable':

            if (!Data) return await interaction.reply({ content: 'You dont have the AGP system setup, do it!'});
            else {
                await ghostSchema.deleteMany({ Guild: interaction.guild.id});

                const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(`The AGP system has been disabled! Why?`)

                await interaction.reply({ embeds: [embed] });
            }

            break;

            case 'number-reset':

            const member = options.getUser('user');
            const data = await numSchema.findOne({ Guild: interaction.guild.id, USer: member.id});

            if (!data) return await interaction.reply({ content: 'This member has been good and hasnt ghostpinged yet!'});
            else {
                await data.deleteOne({ User: member.id});

                await interaction.reply({ content: `${member}'s ghost ping number is back at 0`});
            }                             
        }
    }
}
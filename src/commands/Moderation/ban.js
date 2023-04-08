const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription(`Take a guess at what this does`)
    .addUserOption(option => option.setName('user').setDescription(`The person to get hammered.`).setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription(`One word: Why?`).setRequired(true)),
    async execute(interaction, client) {
 
        const users = interaction.options.getUser('user');
        const ID = users.id;
        const banUser = client.users.cache.get(ID)
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply({ content: "Red doesnt let you ban people", ephemeral: true});
        if (interaction.member.id === ID) return await interaction.reply({ content: "Why would you ban yourself? XD", ephemeral: true});
 
        let reason = interaction.options.getString('reason');
        if (!reason) reason = "No reason given";
 
        const dmEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(`:white_check_mark:  You have been banned from **${interaction.guild.name}** | ${reason}`)
 
        const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(`:white_check_mark:  ${banUser.tag} has been banned | ${reason}`)
 
        await interaction.guild.bans.create(banUser.id, {reason}).catch(err => {
            return interaction.reply({ content: "I cannot ban this member!", ephemeral: true})
        })
 
        await banUser.send({ embeds: [dmEmbed] }).catch(err => {
            return;
        })
 
        await interaction.reply({ embeds: [embed] });
    } 
}
//Hammer time//

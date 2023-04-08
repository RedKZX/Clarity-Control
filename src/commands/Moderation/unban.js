const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription(`Take a guess at what this does.`)
    .addUserOption(option => option.setName('user').setDescription(`The user you want to ban`).setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription(`One word: Why?`).setRequired(true)),
    async execute(interaction, client) {
 
        const userID = interaction.options.getUser('user');
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply({ content: "Look in the mirror and ask youself why you cant do this.", ephemeral: true});
        if (interaction.member.id === userID) return await interaction.reply({ content: "You wouldnt be here if you was banned.", ephemeral: true});
 
        let reason = interaction.options.getString('reason');
        if (!reason) reason = "No reason given";
 
        const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(`:white_check_mark: <@${userID}> has been unbanned | ${reason}`)
 
        await interaction.guild.bans.fetch()
        .then(async bans => {
 
            if (bans.size == 0) return await interaction.reply({ content: "There is no one banned from this guild", ephemeral: true})
            let bannedID = bans.find(ban => ban.user.id == userID);
            if (!bannedID ) return await interaction.reply({ content: "The ID stated is not banned from this server", ephemeral: true})
 
            await interaction.guild.bans.remove(userID, reason).catch(err => {
                return interaction.reply({ content: "I cannot unban this user"})
            })
        })
 
        await interaction.reply({ embeds: [embed] });
    } 
}

//Who would ever use this?//
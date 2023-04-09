const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName("slap")
    .setDescription("Bitch slap baby")
    .addUserOption(option => option
        .setName("user")
        .setDescription("the user you want to bitch slap")
        .setRequired(true)
    ),
 
    async execute (interaction) {
        const links = [
            "https://media.tenor.com/Ws6Dm1ZW_vMAAAAC/girl-slap.gif",
            "https://media.tenor.com/CvBTA0GyrogAAAAC/anime-slap.gif",
            "https://gifdb.com/images/high/mad-anime-female-character-slap-0zljynqqf0gopfhg.gif",
            "https://i.pinimg.com/originals/68/d3/cd/68d3cd90baa448b24aebd79f40efad6c.gif",
            "https://gifdb.com/images/high/anime-fight-cute-slap-hacpf3xrbfj6vafv.gif",
            "https://media.tenor.com/AhfmR2RZrl0AAAAd/asuna-slap.gif",
            "https://media.tenor.com/UDo0WPttiRsAAAAM/bunny-girl-slap.gif",
            "https://media.tenor.com/FJsjk_9b_XgAAAAM/anime-hit.gif"
        ];
 
        const choice = Math.floor(Math.random() * links.length);
 
        const user = interaction.options.getUser("user");
 
        const link = `${links[choice]}`;
 
        const embed = new EmbedBuilder()
        .setImage(`${link}`)
        .setColor("Red")
        .addFields({
            name: "You bitch slapped",
            value: `<@${user.id}>`,
            inline: true
        })
        .setTimestamp()
 
        return await interaction.reply({ embeds: [embed]})
    }
}

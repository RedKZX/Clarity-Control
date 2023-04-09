const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName("kiss")
    .setDescription("kiss a member")
    .addUserOption(option => option
        .setName("user")
        .setDescription("the user you want to give a big ol smooch")
        .setRequired(true)
    ),
 
    async execute (interaction) {
        const links = [
            "https://media3.giphy.com/media/bGm9FuBCGg4SY/giphy.gif",
            "https://thumbs.gfycat.com/AgedWhisperedBarnacle-size_restricted.gif",
            "https://i.gifer.com/YQzo.gif",
            "https://i.pinimg.com/originals/2f/23/c5/2f23c53755a5c3494a7f54bbcf04d1cc.gif",
            "https://aniyuki.com/wp-content/uploads/2021/07/aniyuki-anime-gif-kiss-14.gif",
            "https://aniyuki.com/wp-content/uploads/2021/07/aniyuki-anime-gif-kiss-13.gif",
            "https://64.media.tumblr.com/e32206d2d51424eeb3c017c1ef0e80ad/fbe2f7e1b2143d0b-6a/s500x750/0280bd77e01a03bac8994f7a3c1aafa267abad0a.gif",
        ];
 
        const choice = Math.floor(Math.random() * links.length);
 
        const user = interaction.options.getUser("user");
 
        const link = `${links[choice]}`;
 
        const embed = new EmbedBuilder()
        .setImage(`${link}`)
        .setColor("Red")
        .addFields({
            name: "You kissed",
            value: `<@${user.id}>`,
            inline: true
        })
        .setTimestamp()
 
        return await interaction.reply({ embeds: [embed]})
    }
}

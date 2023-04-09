const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName("hug")
    .setDescription("give someone a hug")
    .addUserOption(option => option
        .setName("user")
        .setDescription("the user you want to hug")
        .setRequired(true)
    ),
 
    async execute (interaction) {
        const links = [
            "https://media.tenor.com/kCZjTqCKiggAAAAC/hug.gif",
            "https://i.gifer.com/2QEa.gif",
            "https://gifdb.com/images/high/anime-hug-date-a-live-z8yqrk7wlwo3v8ql.gif",
            "https://media.tenor.com/1T1B8HcWalQAAAAC/anime-hug.gif",
            "https://i.pinimg.com/originals/b6/2f/04/b62f047f8ed11b832cb6c0d8ec30687b.gif",
            "https://media.tenor.com/iyztKN68avcAAAAM/aharen-san-aharen-san-anime.gif",
            "https://aniyuki.com/wp-content/uploads/2022/06/anime-hugs-aniyuki-55.gif",
        ];
 
        const choice = Math.floor(Math.random() * links.length);
 
        const user = interaction.options.getUser("user");
 
        const link = `${links[choice]}`;
 
        const embed = new EmbedBuilder()
        .setImage(`${link}`)
        .setColor("Red")
        .addFields({
            name: "You hugged",
            value: `<@${user.id}>`,
            inline: true
        })
        .setTimestamp()
 
        return await interaction.reply({ embeds: [embed]})
    }
}

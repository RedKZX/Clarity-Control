const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const canvacord = require('canvacord');
 
module.exports = {
   data: new SlashCommandBuilder()
    .setName('spotify')
    .setDescription('see a users current spotify status')
    .addUserOption(option => option.setName('user').setDescription('see a users current spotify status').setRequired(true)),
    async execute(interaction) {
 
        let user = interaction.options.getMember('user');
 
        if (user.bot) return interaction.reply({ content: 'a bot does not have a spotify status are you dumb?', ephemeral: false});
 
        let status;
        if(user.presence.activities.length === 1) status = user.presence.activities[0];
        else if (user.presence.activities.length > 1) status = user.presence.activities[1];
 
        if (user.presence.activities.length === 0 || status.name !== "Spotify" && status.type !== "LISTENING") {
            return await interaction.reply({ content: `${user.user.username} is not listening to spotify`, ephemeral: false});
        }
 
        if (status !== null && status.name === "Spotify" && status.assets !== null) {
 
            let image = `https://i.scdn.co/image/${status.assets.largeImage.slice(8)}`,
            name = status.details,
            artist = status.state,
            album = status.assets.largeText;
 
            const card = new canvacord.Spotify()
            .setAuthor(artist)
            .setAlbum(album)
            .setStartTimestamp(status.timestamps.start)
            .setEndTimestamp(status.timestamps.end)
            .setImage(image)
            .setTitle(name)
 
            const Card = await card.build();
            const attachments = new AttachmentBuilder(Card, { name: "spotify.png" });
 
            const embed = new EmbedBuilder()
            .setTitle(`${user.user.username}'s Spotify Status`)
            .setImage('attachment://spotify.png')
            .setColor("Red")
            .setTimestamp()
            .setFooter({ text: 'Spotify Tracker'})
 
            await interaction.reply({ embeds: [embed], files: [attachments] })
        }
    }
}
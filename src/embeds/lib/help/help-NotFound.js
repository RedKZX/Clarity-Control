const Discord = require('discord.js');

module.exports = function () {
    const trackerEmbed = new Discord.EmbedBuilder()
        .setColor('Red')
        .addFields(
            { name: '404 Not Found. We are unable to find your profile.', value: 'Please check your spelling and make sure you are searching by the correct platform.', inline: true },
        )

    return trackerEmbed;
}
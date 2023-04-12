const Discord = require('discord.js');

module.exports = function () {
    const trackerEmbed = new Discord.EmbedBuilder()
        .setColor('Red')
        .addFields(
            {
                name: 'MiniRed', value:
                `ace, thermite, ash ,sledge, fuze, amaru, glaz, 
                zofia, thatcher, capitao, buck, blackbeard, ying, 
                nomad, finka, kali, hibana, montagne, lion, blitz, 
                twitch, nakk, flores, iana, maverick, gridlock, iq, 
                zero, dokkaebi, jackal,lesion, caveira, wamai, doc, 
                ela, bandit, mira, frost, smoke, thunderbird, alibi, 
                valkyrie, kaid, aruni, melusi, rook, mute, jager, 
                castle, tachanka, pulse, kapkan, clash, echo, vigil, 
                maestro, goyo, oryx, mozzie, warden, osa`, inline: true
            },
            { name: 'example:', value: `/r6_operators pc Red-KX\\_-. operator ash`, inline: false },
        )

    return trackerEmbed;
}


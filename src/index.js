const { Client, GatewayIntentBits, AuditLogEvent,AttachmentBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection, MessageType } = require(`discord.js`);
const fs = require('fs');
const { Partials } = require('discord.js');
const client = new Client({ intents: [Object.keys(GatewayIntentBits), GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessageReactions,  GatewayIntentBits.GuildVoiceStates,  GatewayIntentBits.GuildMembers],
partials: [Partials.Channel, Partials.GuildMember, Partials.GuildScheduledEvent, Partials.Message, Partials.Reaction, Partials.ThreadMember, Partials.User],
 }); 
const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require ('discord.js');
const axios = require ('axios');
const { ChannelType } = require('discord.js');
const { createTranscript } = require('discord-html-transcripts');
var colors = require('@colors/colors');
const { DisTube } = require("distube");
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { CaptchaGenerator } = require('captcha-canvas');

require('dotenv').config();

const {loadEvents} = require('./src/Handlers/eventHandler');
const {loadCommands} = require('./src/Handlers/commandHandler');

client.commands = new Collection();
client.errors = new Collection();

client.login(process.env.token).then(() => {
    loadEvents(client);
    loadCommands(client);
});

//Chat responses

client.on("messageCreate", async (message) => {
	if (message.author.bot) return false;
	if (message.content.includes("hawkmoon")) {
		message.reply(`Cohen has 20k kills on that gun. Maybe hes mentally ill.`);
	}
});

client.on("messageCreate", async (message) => {
	if (message.author.bot) return false;
	if (message.content.includes("!credits")) {
		message.reply(`**Clarity Control**
        Bot made by Henreh
        Profile Picture by benji1828
        Special thanks to "Clarity" Discord server for being guinea pigs!`);
	}
});

//Snipe Function

client.snipes = new Map()
client.on('messageDelete', function(message, channel) {
    client.snipes.set(message.channel.id, {
        content: message.content,
        author: message.author,
        image: message.attachments.first() ? message.attachments.first().proxyURL : null
    })
})

//Ready

client.on("ready", () => {
    console.log(" [HENREH] Pretty Logs eh?".red);

})

const figlet = require("figlet")
figlet.text("Clarity", function (err, data){
 console.log(data)
})

//Distube Client

client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnFinish: false,
    emitAddSongWhenCreatingQueue: false,
    plugins: [new SpotifyPlugin()]
  });


// JOIN TO CREATE VOICE CHANNEL CODE //
 
const joinschema = require('./src/Schemas.js/jtc1schema');
const joinchannelschema = require('./src/Schemas.js/jtc2Schema');
 
client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
 
    try {
        if (newState.member.guild === null) return;
    } catch (err) {
        return;
    }
 
    if (newState.member.id === '1058200369555046461') return;
 
    const joindata = await joinschema.findOne({ Guild: newState.member.guild.id });
    const joinchanneldata1 = await joinchannelschema.findOne({ Guild: newState.member.guild.id, User: newState.member.id });
 
    const voicechannel = newState.channel;
 
    if (!joindata) return;
 
    if (!voicechannel) return;
    else {
 
        if (voicechannel.id === joindata.Channel) {
 
            if (joinchanneldata1) {
 
                try {
 
                    const joinfail = new EmbedBuilder()
                    .setColor('Blue')
                    .setTimestamp()
                    .setAuthor({ name: `🔊 Join to Create System`})
                    .setFooter({ text: `🔊 Issue Faced`})
                    .setTitle('> You tried creating a \n> voice channel but..')
                    .addFields({ name: `• Error Occured`, value: `> You already have a voice channel \n> open at the moment.`})
 
                    return await newState.member.send({ embeds: [joinfail] });
 
                } catch (err) {
                    return;
                }
 
            } else {
 
                try {
 
                    const channel = await newState.member.guild.channels.create({
                        type: ChannelType.GuildVoice,
                        name: `${newState.member.user.username}'s-room`,
                        userLimit: joindata.VoiceLimit,
                        parent: joindata.Category
                    })
 
                    try {
                        await newState.member.voice.setChannel(channel.id);
                    } catch (err) {
                        console.log('Error moving member to the new channel!')
                    }   
 
                    setTimeout(() => {
 
                        joinchannelschema.create({
                            Guild: newState.member.guild.id,
                            Channel: channel.id,
                            User: newState.member.id
                        })
 
                    }, 500)
 
                } catch (err) {
 
                    console.log(err)
 
                    try {
 
                        const joinfail = new EmbedBuilder()
                        .setColor('Blue')
                        .setTimestamp()
                        .setAuthor({ name: `🔊 Join to Create System`})
                        .setFooter({ text: `🔊 Issue Faced`})
                        .setTitle('> You tried creating a \n> voice channel but..')
                        .addFields({ name: `• Error Occured`, value: `> I could not create your channel, \n> perhaps I am missing some permissions.`})
 
                        await newState.member.send({ embeds: [joinfail] });
 
                    } catch (err) {
                        return;
                    }
 
                    return;
 
                }
 
                try {
 
                    const joinsuccess = new EmbedBuilder()
                    .setColor('Blue')
                    .setTimestamp()
                    .setAuthor({ name: `🔊 Join to Create System`})
                    .setFooter({ text: `🔊 Channel Created`})
                    .setTitle('> Channel Created')
                    .addFields({ name: `• Channel Created`, value: `> Your voice channel has been \n> created in **${newState.member.guild.name}**!`})
 
                    await newState.member.send({ embeds: [joinsuccess] });
 
                } catch (err) {
                    return;
                }
            }
        }
    }
})
 
client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
 
    try {
        if (oldState.member.guild === null) return;
    } catch (err) {
        return;
    }
 
    if (oldState.member.id === '1058200369555046461') return;
 
    const leavechanneldata = await joinchannelschema.findOne({ Guild: oldState.member.guild.id, User: oldState.member.id });
 
    if (!leavechanneldata) return;
    else {
 
        const voicechannel = await oldState.member.guild.channels.cache.get(leavechanneldata.Channel);
 
		if (newState.channel === voicechannel) return;
 
        try {
            await voicechannel.delete()
        } catch (err) {
            return;
        }
 
        await joinchannelschema.deleteMany({ Guild: oldState.guild.id, User: oldState.member.id })
        try {
 
            const deletechannel = new EmbedBuilder()
            .setColor('Blue')
            .setTimestamp()
            .setAuthor({ name: `🔊 Join to Create System`})
            .setFooter({ text: `🔊 Channel Deleted`})
            .setTitle('> Channel Deleted')
            .addFields({ name: `• Channel Deleted`, value: `> Your voice channel has been \n> deleted in **${newState.member.guild.name}**!`})
 
            await newState.member.send({ embeds: [deletechannel] });
 
        } catch (err) {
            return;
        } 
    }
})

// POLL SYSTEM //
 
const pollschema = require('./src/Schemas.js/votes');
const pollsetup = require('./src/Schemas.js/votesetup');
 
client.on(Events.MessageCreate, async message => {
 
    if (!message.guild) return;
 
    const setupdata = await pollsetup.findOne({ Guild: message.guild.id });
    if (!setupdata) return;
 
    if (message.channel.id !== setupdata.Channel) return;
    if (message.author.bot) return;
 
    const embed = new EmbedBuilder()
    .setColor("Blue")
    .setAuthor({ name: `🤚 Poll System`})
    .setFooter({ text: `🤚 Poll Started`})
    .setTimestamp()
    .setTitle('• Poll Began')
    .setDescription(`> ${message.content}`)
    .addFields({ name: `• Upvotes`, value: `> **No votes**`, inline: true})
    .addFields({ name: `• Downvotes`, value: `> **No votes**`, inline: true})
    .addFields({ name: `• Author`, value: `> ${message.author}`})
 
    try {
        await message.delete();
    } catch (err) {
 
    }
 
    const buttons = new ActionRowBuilder()
    .addComponents(
 
        new ButtonBuilder()
        .setCustomId('up')
        .setLabel(' ')
        .setEmoji('<:tick:1102942811101335593>')
        .setStyle(ButtonStyle.Secondary),
 
        new ButtonBuilder()
        .setCustomId('down')
        .setLabel(' ')
        .setEmoji('<:crossmark:1102943024415260673>')
        .setStyle(ButtonStyle.Secondary),
 
        new ButtonBuilder()
        .setCustomId('votes')
        .setLabel('• Votes')
        .setStyle(ButtonStyle.Secondary)
    )
 
    const msg = await message.channel.send({ embeds: [embed], components: [buttons] });
    msg.createMessageComponentCollector();
 
    await pollschema.create({
        Msg: msg.id,
        Upvote: 0,
        Downvote: 0,
        UpMembers: [],
        DownMembers: [],
        Guild: message.guild.id,
        Owner: message.author.id
    })
})
 
client.on(Events.InteractionCreate, async i => {
 
    if (!i.guild) return;
    if (!i.message) return;
 
    const data = await pollschema.findOne({ Guild: i.guild.id, Msg: i.message.id });
    const msg = await i.channel.messages.fetch(data.Msg)
 
        if (i.customId === 'up') {
 
            if (i.user.id === data.Owner) return await i.reply({ content: `❌ You **cannot** upvote your own **poll**!`, ephemeral: true });
            if (data.UpMembers.includes(i.user.id)) return await i.reply({ content: `❌ You have **already** upvoted this **poll**`, ephemeral: true});
 
            let downvotes = data.Downvote;
            if (data.DownMembers.includes(i.user.id)) {
                downvotes = downvotes - 1;
            }
 
            const newembed = EmbedBuilder.from(msg.embeds[0]).setFields({ name: `• Upvotes`, value: `> **${data.Upvote + 1}** Votes`, inline: true}, { name: `• Downvotes`, value: `> **${downvotes}** Votes`, inline: true}, { name: `• Author`, value: `> <@${data.Owner}>`});
 
            const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('up')
                .setEmoji('<:tick:1102942811101335593>')
                .setLabel(`${data.Upvote + 1}`)
                .setStyle(ButtonStyle.Secondary),
 
                new ButtonBuilder()
                .setCustomId('down')
                .setEmoji('<:crossmark:1102943024415260673>')
                .setLabel(`${downvotes}`)
                .setStyle(ButtonStyle.Secondary),
 
                new ButtonBuilder()
                .setCustomId('votes')
                .setLabel('• Votes')
                .setStyle(ButtonStyle.Secondary)
            )
 
            await i.update({ embeds: [newembed], components: [buttons] })
 
            data.Upvote++
 
            if (data.DownMembers.includes(i.user.id)) {
                data.Downvote = data.Downvote - 1;
            }
 
            data.UpMembers.push(i.user.id)
            data.DownMembers.pull(i.user.id)
            data.save();
 
        }
 
        if (i.customId === 'down') {
 
            if (i.user.id === data.Owner) return await i.reply({ content: `❌ You **cannot** downvote your own **poll**!`, ephemeral: true });
            if (data.DownMembers.includes(i.user.id)) return await i.reply({ content: `❌ You have **already** downvoted this **poll**`, ephemeral: true});
 
            let upvotes = data.Upvote;
            if (data.UpMembers.includes(i.user.id)) {
                upvotes = upvotes - 1;
            }
 
            const newembed = EmbedBuilder.from(msg.embeds[0]).setFields({ name: `• Upvotes`, value: `> **${upvotes}** Votes`, inline: true}, { name: `• Downvotes`, value: `> **${data.Downvote + 1}** Votes`, inline: true}, { name: `• Author`, value: `> <@${data.Owner}>`});
 
            const buttons = new ActionRowBuilder()
            .addComponents(
 
                new ButtonBuilder()
                .setCustomId('up')
                .setEmoji('<:tick:1102942811101335593>')
                .setLabel(`${upvotes}`)
                .setStyle(ButtonStyle.Secondary),
 
                new ButtonBuilder()
                .setCustomId('down')
                .setEmoji('<:crossmark:1102943024415260673>')
                .setLabel(`${data.Downvote + 1}`)
                .setStyle(ButtonStyle.Secondary),
 
                new ButtonBuilder()
                .setCustomId('votes')
                .setLabel('• Votes')
                .setStyle(ButtonStyle.Secondary)
            )
 
            await i.update({ embeds: [newembed], components: [buttons] })
 
            data.Downvote++
 
            if (data.UpMembers.includes(i.user.id)) {
                data.Upvote = data.Upvote - 1;
            }
 
            data.DownMembers.push(i.user.id);
            data.UpMembers.pull(i.user.id);
            data.save();
 
        }
 
        if (i.customId === 'votes') {
 
            let upvoters = [];
            await data.UpMembers.forEach(async member => {
                upvoters.push(`<@${member}>`)
            })
 
            let downvoters = [];
            await data.DownMembers.forEach(async member => {
                downvoters.push(`<@${member}>`)
            })
 
            const embed = new EmbedBuilder()
            .setTitle('> Poll Votes')
            .setColor("Blue")
            .setAuthor({ name: `🤚 Poll System`})
            .setFooter({ text: `🤚 Poll Members`})
            .setTimestamp()
            .addFields({ name: `• Upvoters (${upvoters.length})`, value: `> ${upvoters.join(', ').slice(0, 1020) || 'No upvoters'}`, inline: true})
            .addFields({ name: `• Downvoters (${downvoters.length})`, value: `> ${downvoters.join(', ').slice(0, 1020) || 'No downvoters'}`, inline: true})
 
            await i.reply({ embeds: [embed], ephemeral: true })
        }
})

//Captcha Verify

const capschema = require('./src/Schemas.js/verify');
const verifyusers = require('./src/Schemas.js/verifyusers');

 
client.on(Events.InteractionCreate, async interaction => {
 
    if (interaction.guild === null) return;
 
    const verifydata = await capschema.findOne({ Guild: interaction.guild.id });
    const verifyusersdata = await verifyusers.findOne({ Guild: interaction.guild.id, User: interaction.user.id });
 
    if (interaction.customId === 'verify') {
 
        if (!verifydata) return await interaction.reply({ content: `The **verification system** has been disabled in this server!`, ephemeral: true});
 
        if (verifydata.Verified.includes(interaction.user.id)) return await interaction.reply({ content: 'You have **already** been verified!', ephemeral: true})
        else {
 
            let letter = ['0','1','2','3','4','5','6','7','8','9','a','A','b','B','c','C','d','D','e','E','f','F','g','G','h','H','i','I','j','J','f','F','l','L','m','M','n','N','o','O','p','P','q','Q','r','R','s','S','t','T','u','U','v','V','w','W','x','X','y','Y','z','Z',]
            let result = Math.floor(Math.random() * letter.length);
            let result2 = Math.floor(Math.random() * letter.length);
            let result3 = Math.floor(Math.random() * letter.length);
            let result4 = Math.floor(Math.random() * letter.length);
            let result5 = Math.floor(Math.random() * letter.length);
 
            const cap = letter[result] + letter[result2] + letter[result3] + letter[result4] + letter[result5];
            console.log(cap)
 
            const captcha = new CaptchaGenerator()
            .setDimension(150, 450)
            .setCaptcha({ text: `${cap}`, size: 60, color: "red"})
            .setDecoy({ opacity: 0.5 })
            .setTrace({ color: "red" })
 
            const buffer = captcha.generateSync();
 
            const verifyattachment = new AttachmentBuilder(buffer, { name: `captcha.png`});
 
            const verifyembed = new EmbedBuilder()
            .setColor('Blue')
            .setAuthor({ name: `⚙️ Claritys Toolbox`})
            .setFooter({ text: `✅ Verification Captcha`})
            .setTimestamp()
            .setImage('attachment://captcha.png')
            .setThumbnail('https://cdn.discordapp.com/attachments/834529667968008252/1123792486054252574/Clarity_Logo_BK_Final.png')
            .setTitle('> Verification Step: Captcha')
            .addFields({ name: `• Verify`, value: '> Please use the button bellow to \n> submit your captcha!'})
 
            const verifybutton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel('✅ Enter Captcha')
                .setStyle(ButtonStyle.Success)
                .setCustomId('captchaenter')
            )
 
            const vermodal = new ModalBuilder()
            .setTitle('Verification')
            .setCustomId('vermodal')
 
            const answer = new TextInputBuilder()
            .setCustomId('answer')
            .setRequired(true)
            .setLabel('• Please sumbit your Captcha code')
            .setPlaceholder('Your captcha code')
            .setStyle(TextInputStyle.Short)
 
            const vermodalrow = new ActionRowBuilder().addComponents(answer);
            vermodal.addComponents(vermodalrow);
 
            const vermsg = await interaction.reply({ embeds: [verifyembed], components: [verifybutton], ephemeral: true, files: [verifyattachment] });
 
            const vercollector = vermsg.createMessageComponentCollector();
 
            vercollector.on('collect', async i => {
 
                if (i.customId === 'captchaenter') {
                    i.showModal(vermodal);
                }
 
            })
 
            if (verifyusersdata) {
 
                await verifyusers.deleteMany({
                    Guild: interaction.guild.id,
                    User: interaction.user.id
                })
 
                await verifyusers.create ({
                    Guild: interaction.guild.id,
                    User: interaction.user.id,
                    Key: cap
                })
 
            } else {
 
                await verifyusers.create ({
                    Guild: interaction.guild.id,
                    User: interaction.user.id,
                    Key: cap
                })
 
            }
        } 
    }
})
 
client.on(Events.InteractionCreate, async interaction => {
 
    if (!interaction.isModalSubmit()) return;
 
    if (interaction.customId === 'vermodal') {
 
        const userverdata = await verifyusers.findOne({ Guild: interaction.guild.id, User: interaction.user.id });
        const verificationdata = await capschema.findOne({ Guild: interaction.guild.id });
 
        if (verificationdata.Verified.includes(interaction.user.id)) return await interaction.reply({ content: `You have **already** verified within this server!`, ephemeral: true});
 
        const modalanswer = interaction.fields.getTextInputValue('answer');
        if (modalanswer === userverdata.Key) {
 
            const verrole = await interaction.guild.roles.cache.get(verificationdata.Role);
 
            try {
                await interaction.member.roles.add(verrole);
            } catch (err) {
                return await interaction.reply({ content: `There was an **issue** giving you the **<@&${verificationdata.Role}>** role, try again later!`, ephemeral: true})
            }
 
            await interaction.reply({ content: 'You have been **verified!**', ephemeral: true});
            await capschema.updateOne({ Guild: interaction.guild.id }, { $push: { Verified: interaction.user.id }});
 
        } else {
            await interaction.reply({ content: `**Oops!** It looks like you **didn't** enter the valid **captcha code**!`, ephemeral: true})
        }
    }
})

/// TICKET SYSTEM //
 
const ticketSchema = require("./src/Schemas.js/ticketSchema");
client.on(Events.InteractionCreate, async (interaction) => {
  const { customId, guild, channel } = interaction;
  if (interaction.isButton()) {
    if (customId === "ticket") {
      let data = await ticketSchema.findOne({
        GuildID: interaction.guild.id,
      });
 
      if (!data) return await interaction.reply({ content: "Ticket system is not setup in this server", ephemeral: true })
      const role = guild.roles.cache.get(data.Role)
      const cate = data.Category;
 
 
      await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username}`,
        parent: cate,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: ["ViewChannel"]
          },
          {
            id: role.id,
            allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
          },
          {
            id: interaction.member.id,
            allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
          },
        ],
      }).then(async (channel) => {
        const openembed = new EmbedBuilder()
          .setColor("Blue")
          .setTitle("Ticket Opened")
          .setDescription(`Welcome to your ticket ${interaction.user.username}\n React with 🔒 to close the ticket`)
          .setThumbnail(interaction.guild.iconURL())
          .setTimestamp()
          .setFooter({ text: `${interaction.guild.name}'s Tickets` })
 
          const closeButton = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
            .setCustomId('closeticket')
            .setLabel('Close')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🔒')
          )
          await channel.send({ content: `<@&${role.id}>`, embeds: [openembed], components: [closeButton] })
 
          const openedTicket = new EmbedBuilder()
          .setDescription(`Ticket created in <#${channel.id}>`)
 
          await interaction.reply({ embeds: [openedTicket], ephemeral: true })
      })
    }
 
    if (customId === "closeticket") {
      const closingEmbed = new EmbedBuilder()
      .setDescription('🔒 are you sure you want to close this ticket?')
      .setColor('Blue')
 
      const buttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setCustomId('yesclose')
        .setLabel('Yes')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('✅'),
 
        new ButtonBuilder()
        .setCustomId('nodont')
        .setLabel('No')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('❌')
      )
 
      await interaction.reply({ embeds: [closingEmbed], components: [buttons] })
    }
 
    if (customId === "yesclose") {
      let data = await ticketSchema.findOne({ GuildID: interaction.guild.id });
      const transcript = await createTranscript(channel, {
        limit: -1,
        returnBuffer: false,
        filename: `ticket-${interaction.user.username}.html`,
      });
 
      const transcriptEmbed = new EmbedBuilder()
      .setAuthor({ name: `${interaction.guild.name}'s Transcripts`, iconURL: guild.iconURL() })
      .addFields(
        {name: `Closed by`, value: `${interaction.user.tag}`}
      )
      .setColor('Blue')
      .setTimestamp()
      .setThumbnail(interaction.guild.iconURL())
      .setFooter({ text: `${interaction.guild.name}'s Tickets` })
 
      const processEmbed = new EmbedBuilder()
      .setDescription(` Closing ticket in 10 seconds...`)
      .setColor('Blue')
 
      await interaction.reply({ embeds: [processEmbed] })
 
      await guild.channels.cache.get(data.Logs).send({
        embeds: [transcriptEmbed],
        files: [transcript],
      });
 
      setTimeout(() => {
        interaction.channel.delete()
      }, 10000);
     }
 
     if (customId === "nodont") {
        const noEmbed = new EmbedBuilder()
        .setDescription('🔒 Ticket close cancelled')
        .setColor('Blue')
  
        await interaction.reply({ embeds: [noEmbed], ephemeral: true })
     }
  }
})

//Reaction roles
const reactions = require('./src/Schemas.js/reactionrs');
client.on(Events.MessageReactionAdd, async(reaction, user) => {

    if (!reaction.message.guild.id) return;
    if (user.bot) return;

    let cID = `<:${reaction.emoji.name}:${reaction.emoji.id}>`;
    if (!reaction.emoji.id) cID = reaction.emoji.name;

    const data = await reactions.findOne({ Guild: reaction.message.guild.id, Message: reaction.message.id, Emoji: cID });
    if (!data) return;
    
    const guild = await client.guilds.cache.get(reaction.message.guild.id);
    const member = await guild.members.cache.get(user.id);

    try {
        await member.roles.add(data.Role);
    } catch(err) {
        console.log(err)
    }
})

client.on(Events.MessageReactionRemove, async(reaction, user) => {

    if (!reaction.message.guild.id) return;
    if (user.bot) return;

    let cID = `<:${reaction.emoji.name}:${reaction.emoji.id}>`;
    if (!reaction.emoji.id) cID = reaction.emoji.name;

    const data = await reactions.findOne({ Guild: reaction.message.guild.id, Message: reaction.message.id, Emoji: cID });
    if (!data) return;
    
    const guild = await client.guilds.cache.get(reaction.message.guild.id);
    const member = await guild.members.cache.get(user.id);

    try {
        await member.roles.remove(data.Role);
    } catch(err) {
        console.log(err)
    }
})
//Anti Crash

client.on("error", (err) => {
    const ChannelID = "1112156467974373396";
    const Embed = new EmbedBuilder()
      .setColor("Blue")
      .setTimestamp()
      .setFooter({ text: "Anti Crash system" })
      .setTitle("Error Encountered");
    const Channel = client.channels.cache.get(ChannelID);
    if (!Channel) return;
    Channel.send({
      embeds: [
        Embed.setDescription(
          "**Discord API Error/Catch:\n\n** ```" + err + "```"
        ),
      ],
    });
  });
  
  process.on("unhandledRejection", (reason, p) => {
    const ChannelID = "1112156467974373396";
    console.log("Unhandled promise rejection:", reason, p);
    const Embed = new EmbedBuilder()
      .setColor("Blue")
      .setTimestamp()
      .setFooter({ text: "Anti Crash system" })
      .setTitle("Error Encountered");
    const Channel = client.channels.cache.get(ChannelID);
    if (!Channel) return;
    Channel.send({
      embeds: [
        Embed.setDescription(
          "**Unhandled Rejection/Catch:\n\n** ```" + reason + "```"
        ),
      ],
    });
  });
  
  process.on("uncaughtException", (err, origin) => {
    const ChannelID = "1112156467974373396";
    const Embed = new EmbedBuilder()
      .setColor("Blue")
      .setTimestamp()
      .setFooter({ text: "Anti Crash system" })
      .setTitle("Error Encountered");
    const Channel = client.channels.cache.get(ChannelID);
    if (!Channel) return;
    Channel.send({
      embeds: [
        Embed.setDescription(
          "**Uncought Exception/Catch:\n\n** ```" + err + "```"
        ),
      ],
    });
  });
  
  process.on("uncaughtExceptionMonitor", (err, origin) => {
    const ChannelID = "1112156467974373396";
    const Embed = new EmbedBuilder()
      .setColor("Blue")
      .setTimestamp()
      .setFooter({ text: "Anti Crash system" })
      .setTitle("Error Encountered");
    const Channel = client.channels.cache.get(ChannelID);
    if (!Channel) return;
    Channel.send({
      embeds: [
        Embed.setDescription(
          "**Uncaught Exception Monitor/Catch:\n\n** ```" + err + "```"
        ),
      ],
    });
  });
  
  process.on("warning", (warn) => {
    const ChannelID = "1112156467974373396";
    const Embed = new EmbedBuilder()
      .setColor("Blue")
      .setTimestamp()
      .setFooter({ text: "Anti Crash system" })
      .setTitle("Error Encountered");
    const Channel = client.channels.cache.get(ChannelID);
    if (!Channel) return;
    Channel.send({
      embeds: [
        Embed.setDescription(
          "**Warning/Catch:\n\n** ```" + warn + "```"
        ),
      ],
    });
  });

//CMD Logging

client.on(Events.InteractionCreate, async interaction => {
    if(!interaction) return;
    if(!interaction.isChatInputCommand()) return;
    else {
    const channel = await client.channels.cache.get("1123634169524785193");
    const server = interaction.guild.name
    const user = interaction.user.tag
    const userId = interaction.user.id
  
    const embed = new EmbedBuilder()
    .setColor("Blue")
    .setTitle(`CMD Log`)
    .addFields({ name: `Server Name`, value: `${server}`})
    .addFields({ name: `Chat Command`, value: `${interaction}`})
    .addFields({ name: `User`, value: `${user} / ${userId}`})
    .setTimestamp()
    .setFooter({ text: `Red`})
  
    await channel.send({ embeds: [embed] });
  
    }
 })
  

// Leave Message //
const welcomeschema = require('./src/Schemas.js/welcomeschema'); 
const roleschema = require('./src/Schemas.js/autorole');

client.on(Events.GuildMemberRemove, async (member, err) => {
 
    const leavedata = await welcomeschema.findOne({ Guild: member.guild.id });
 
    if (!leavedata) return;
    else {
 
        const channelID = leavedata.Channel;
        const channelwelcome = member.guild.channels.cache.get(channelID);
 
        const embedleave = new EmbedBuilder()
        .setColor("Blue")
        .setTitle(`${member.user.username} has left`)
        .setDescription( `> ${member} has left the Server`)
        .setFooter({ text: `${member} has gone to find a girlfriend!`})
        .setTimestamp()
        .setAuthor({ name: `👋 Member Left`})
        .setThumbnail('https://cdn.discordapp.com/attachments/834529667968008252/1123792486054252574/Clarity_Logo_BK_Final.png')
 
        const welmsg = await channelwelcome.send({ embeds: [embedleave]}).catch(err);
        welmsg.react('👋');
    }
})
 
// Welcome Message //
 
client.on(Events.GuildMemberAdd, async (member, err) => {
 
    const welcomedata = await welcomeschema.findOne({ Guild: member.guild.id });
 
    if (!welcomedata) return;
    else {
 
        const channelID = welcomedata.Channel;
        const channelwelcome = member.guild.channels.cache.get(channelID)
        const roledata = await roleschema.findOne({ Guild: member.guild.id });
 
        if (roledata) {
            const giverole = await member.guild.roles.cache.get(roledata.Role)
 
            member.roles.add(giverole).catch(err => {
                console.log('Error received trying to give an auto role!');
            })
        }
 
        const embedwelcome = new EmbedBuilder()
         .setColor("Blue")
         .setTitle(`${member.user.username} has arrived\nto the Server!`)
         .setDescription( `> Welcome ${member} to the Sevrer!`)
         .setFooter({ text: `Make sure to complete the tasks in the "Registration" Category to see the rest of the server!`})
         .setTimestamp()
         .setAuthor({ name: `👋 Welcome to ${member.guild.name}`})
         .setThumbnail('https://cdn.discordapp.com/attachments/834529667968008252/1123792486054252574/Clarity_Logo_BK_Final.png')
 
        const embedwelcomedm = new EmbedBuilder()
         .setColor("Blue")
         .setTitle('Welcome Message')
         .setDescription( `> Welcome to ${member.guild.name}!`)
         .setFooter({ text: `Make sure to complete the tasks in the "Registration" Category to see the rest of the server!`})
         .setTimestamp()
         .setAuthor({ name: `👋 Welcome to the Server!`})
         .setThumbnail('https://cdn.discordapp.com/attachments/834529667968008252/1123792486054252574/Clarity_Logo_BK_Final.png')
 
        const levmsg = await channelwelcome.send({ embeds: [embedwelcome]});
        levmsg.react('👋');
        member.send({ embeds: [embedwelcomedm]}).catch(err => console.log(`Welcome DM error: ${err}`))
 
    } 
})
//Invite Logger
//removed temporarly

//logging

const logSchema = require('./src/Schemas.js/log')
 
client.on(Events.ChannelCreate, async channel => {
 
    channel.guild.fetchAuditLogs({
        type: AuditLogEvent.ChannelCreate,
    })
    .then(async audit => {
        const { executor } = audit.entries.first()
 
        const name = channel.name;
        const id = channel.id;
        let type = channel.type;
 
        if (type == 0) type = 'Text'
        if (type == 2) type = 'Voice'
        if (type == 13) type = 'Stage'
        if (type == 15) type = 'Form'
        if (type == 5) type = 'Announcement'
        if (type == 5) type = 'Category'
 
        logSchema.findOne({ Guild: channel.guild.id}, async (err, data) => {
            if (err) throw err;
            if (!data) return;
 
            if (data) {
                let channelID = data.Channel;
                const mChannel = await channel.guild.channels.cache.get(channelID);
 
                const embed = new EmbedBuilder()
                .setColor("Blue")
                .setTitle("Channel Created")
                .addFields({ name: "Channel Name", value: `${name} (<#${id}>)`, inline: false})
                .addFields({ name: "Channel Type", value: `${type}`, inline: false})
                .addFields({ name: "Channel ID", value: `${id}`, inline: false})
                .addFields({ name: "Created By", value: `${executor.tag}`, inline: false})
                .setTimestamp()
                .setFooter({ text: "Henrehs Mod Logging System"})
 
                mChannel.send({ embeds: [embed] })
            }
 
        })
 
    })
})
 
client.on(Events.ChannelDelete, async channel => {
 
    channel.guild.fetchAuditLogs({
        type: AuditLogEvent.ChannelDelete,
    })
    .then(async audit => {
        const { executor } = audit.entries.first()
 
        const name = channel.name;
        const id = channel.id;
        let type = channel.type;
 
        if (type == 0) type = 'Text'
        if (type == 2) type = 'Voice'
        if (type == 13) type = 'Stage'
        if (type == 15) type = 'Form'
        if (type == 5) type = 'Announcement'
        if (type == 5) type = 'Category'
 
        logSchema.findOne({ Guild: channel.guild.id}, async (err, data) => {
            if (err) throw err;
            if (!data) return;
 
            if (data) {
                let channelID = data.Channel;
                const mChannel = await channel.guild.channels.cache.get(channelID);
 
                const embed = new EmbedBuilder()
                .setColor("Blue")
                .setTitle("Channel Deleted")
                .addFields({ name: "Channel Name", value: `${name}`, inline: false})
                .addFields({ name: "Channel Type", value: `${type}`, inline: false})
                .addFields({ name: "Channel ID", value: `${id}`, inline: false})
                .addFields({ name: "Deleted By", value: `${executor.tag}`, inline: false})
                .setTimestamp()
                .setFooter({ text: "Henrehs Mod Logging System"})
 
                mChannel.send({ embeds: [embed] })
            }
 
        })
 
    })
})
 
client.on(Events.GuildBanAdd, async member => {
 
    member.guild.fetchAuditLogs({
        type: AuditLogEvent.GuildBanAdd,
    })
    .then(async audit => {
        const { executor } = audit.entries.first()
 
        const name = member.user.username;
        const id = member.user.id;
 
        logSchema.findOne({ Guild: member.guild.id}, async (err, data) => {
            if (err) throw err;
            if (!data) return;
 
            if (data) {
                let channelID = data.Channel;
                const mChannel = await member.guild.channels.cache.get(channelID);
 
                const embed = new EmbedBuilder()
                .setColor("Blue")
                .setTitle("Member Banned")
                .addFields({ name: "Member Name", value: `${name} (<@${id}>)`, inline: false})
                .addFields({ name: "Member ID", value: `${id}`, inline: false})
                .addFields({ name: "Banned By", value: `${executor.tag}`, inline: false})
                .setTimestamp()
                .setFooter({ text: "Henrehs Mod Logging System"})
 
                mChannel.send({ embeds: [embed] })
            }
        })
 
 
    })
})
 
client.on(Events.GuildBanRemove, async member => {
 
    member.guild.fetchAuditLogs({
        type: AuditLogEvent.GuildBanRemove,
    })
    .then(async audit => {
        const { executor } = audit.entries.first()
 
        const name = member.user.username;
        const id = member.user.id;
 
        logSchema.findOne({ Guild: member.guild.id}, async (err, data) => {
            if (err) throw err;
            if (!data) return;
 
            if (data) { 
                let channelID = data.Channel;
                const mChannel = await member.guild.channels.cache.get(channelID);
 
                const embed = new EmbedBuilder()
                .setColor("Blue")
                .setTitle("Member Unbanned")
                .addFields({ name: "Member Name", value: `${name} (<@${id}>)`, inline: false})
                .addFields({ name: "Member ID", value: `${id}`, inline: false})
                .addFields({ name: "Unbanned By", value: `${executor.tag}`, inline: false})
                .setTimestamp()
                .setFooter({ text: "Henrehs Mod Logging System"})
 
                mChannel.send({ embeds: [embed] })
 
            }
        })
    })
})
 
client.on(Events.MessageDelete, async message => {
 
        const executor = message.author.tag;
 
        const mes = message.content;
 
        if (!mes) return;
 
        logSchema.findOne({ Guild: message.guild.id}, async (err, data) => {
            if (err) throw err;
            if (!data) return;
 
            if (data) {
                let channelID = data.Channel;
                const mChannel = await message.guild.channels.cache.get(channelID);
 
                const embed = new EmbedBuilder()
                .setColor("Blue")
                .setTitle("Message Deleted")
                .addFields({ name: "Message Content", value: `${mes}`, inline: false})
                .addFields({ name: "Message Channel", value: `${message.channel}`, inline: false})
                .addFields({ name: "Message Author", value: `${message.author.tag}`, inline: false})
                .setTimestamp()
                .setFooter({ text: "Henrehs Mod Logging System"})
 
                mChannel.send({ embeds: [embed] })
 
            }
    })
})
 
client.on(Events.MessageUpdate, async (message, newMessage) => {
 
        const executor = message.author.tag;
 
        const mes = message.content;
 
        if (!mes) return;
 
        logSchema.findOne({ Guild: message.guild.id}, async (err, data) => {
            if (err) throw err;
            if (!data) return;
 
            if (data) {
                let channelID = data.Channel;
                const mChannel = await message.guild.channels.cache.get(channelID);
 
            const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle("Message Edited")
            .addFields({ name: "Old Message", value: `${mes}`, inline: false})
            .addFields({ name: "New Message", value: `${newMessage}`, inline: false})
            .addFields({ name: "Message Author", value: `${executor}`, inline: false})
            .setTimestamp()
            .setFooter({ text: "Henrehs Mod Logging System"})
 
            mChannel.send({ embeds: [embed] })
 
            }
 
    })
}) 
 
client.on(Events.VoiceStateUpdate, async member => {
 
    member.guild.fetchAuditLogs({
        type: AuditLogEvent.VoiceStateUpdate,
    })
    .then(async audit => {
 
        const memberID = member.id;
        const channelID = member.channelId;
 
        const mem = member.guild.members.cache.get(`${memberID}`);
        const memberTag = mem.user.tag;
 
        logSchema.findOne({ Guild: member.guild.id}, async (err, data) => {
            if (err) throw err;
            if (!data) return;
 
            if (data) {
            if (channelID == null) {
                let channelID = data.Channel;
                const mChannel = await member.guild.channels.cache.get(channelID);
 
                const embed = new EmbedBuilder()
                .setColor("Blue")
                .setTitle("Member Joined VC")
                .addFields({ name: "Member", value: `${mem}`, inline: false})
                .addFields({ name: "Member Tag & ID", value: `${memberTag}, ${memberID}`, inline: false})
                .setTimestamp()
                .setFooter({ text: "Henrehs Mod Logging System"})
 
                mChannel.send({ embeds: [embed] })
 
            } else {
                let channelID = data.Channel;
                const mChannel = await member.guild.channels.cache.get(channelID);
 
                const embed = new EmbedBuilder()
                .setColor("Blue")
                .setTitle("Member Left VC")
                .addFields({ name: "Member", value: `${mem}`, inline: false})
                .addFields({ name: "Member Tag & ID", value: `${memberTag}, ${memberID}`, inline: false})
                .setTimestamp()
                .setFooter({ text: "Henrehs Mod Logging System"})
 
                mChannel.send({ embeds: [embed] })
            }
 
        }
        })
 
    })
})

 //Bungie ID (Modal)

 client.on(Events.InteractionCreate, async interaction => {

    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === 'bungie-id') {
        
        const DiscordName = interaction.fields.getTextInputValue('Discord Username');
        const BungieName = interaction.fields.getTextInputValue('Bungie ID');
        const LOA = interaction.fields.getTextInputValue('Absence from the game (optional)') || 'NaN';
    
        axios.post('https://sheetdb.io/api/v1/e9wjzs0p4125c', {
                data: {
                    DiscordName: `${DiscordName}`,
                    BungieID: `${BungieName}`,
                    Absence: `${LOA}`
                }
            })
        
        await interaction.reply({ content: 'Your **Data** was submited! Thanks for sharing that with us :D', ephemeral: true}) 
 }
}
 
 )


 //Feedback (Modal)

 client.on(Events.InteractionCreate, async interaction => {

    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === 'feedback') {
        
        const feedbackname = interaction.fields.getTextInputValue('name');
        const feedbackfeedback = interaction.fields.getTextInputValue('feedback');
        const feedbackproblems = interaction.fields.getTextInputValue('problems') || 'User did not provide any problem information.';
    
        axios.post('https://sheetdb.io/api/v1/wfbw6iyvafo7n', {
                data: {
                    username: `${feedbackname}`,
                    feedback: `${feedbackfeedback}`,
                    problems: `${feedbackproblems}`
                }
            })
        
        await interaction.reply({ content: 'Your **feedback** was submited! Thanks for sharing that with us :D', ephemeral: true}) 
 }
}
 
 )

// AFK System Code //
 
const afkSchema = require('./src/Schemas.js/afkSchema');
 
client.on(Events.MessageCreate, async (message) => {
 
    if (message.author.bot) return;
 
    const afkcheck = await afkSchema.findOne({ Guild: message.guild.id, User: message.author.id});
    if (afkcheck) {
        const nick = afkcheck.Nickname;
 
        await afkSchema.deleteMany({
            Guild: message.guild.id,
            User: message.author.id
        })
 
        await message.member.setNickname(`${nick}`).catch(Err => {
            return;
        })
 
        const m1 = await message.reply({ content: `Hey, you are **back**! Unfortunately`, ephemeral: true})
        setTimeout(() => {
            m1.delete();
        }, 4000)
    } else {
 
        const members = message.mentions.users.first();
        if (!members) return;
        const afkData = await afkSchema.findOne({ Guild: message.guild.id, User: members.id })
 
        if (!afkData) return;
 
        const member = message.guild.members.cache.get(members.id);
        const msg = afkData.Message;
 
        if (message.content.includes(members)) {
            const m = await message.reply({ content: `${member.user.tag} is currently AFK, let's keep it down.. \n> **Reason**: ${msg}`, ephemeral: true});
            setTimeout(() => {
                m.delete();
                message.delete();
            }, 4000)
        }
    }
})

 //Ghost ping [AGP]

 const ghostSchema = require('./src/Schemas.js/ghostpingSchema');
 const numSchema = require('./src/Schemas.js/ghostNum');
const { channel } = require('diagnostics_channel');
const { Mongoose } = require('mongoose');

 client.on(Events.MessageDelete, async message => {

    const Data = await ghostSchema.findOne({ Guild: message.guild.id});
    if (!Data) return;

    if(!message.author) return;
    if(message.author.bot) return;
    if(!message.author.id === client.user.id) return;
    if (message.author === message.mentions.users.first()) return;

    if (message.mentions.users.first() || message.type === MessageType.reply) {

        let number
        let time = 15

        const data = await numSchema.findOne({ Guild: message.guild.id, User: message.author.id});
        if (!data) {
            await numSchema.create({
                Guild: message.guild.id,
                User: message.author.id,
                Number: 1
            })

            number = 1;           
        } else {
            data.Number +- 1;
            await data.save();

            number = data.Number;
        }

        if (number == 2) time = 60;
        if (number >= 3) time = 500;
        
        if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return;
        }

        const msg = await message.channel.send({ content: `${message.author}, Dont try to ghost ping please.`});
        setTimeout(() => msg.delete(), 5000);

        const member = message.member;

        if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return;
        } else {
            await member.timeout(time * 1000, 'Ghost Pinging');
            await member .send({ content: `You have been timed out in ${message.guild.name} for ${time} seconds due to ghost pinging. Do not do it.`}).catch(err => {
                return;
            })
        }
    }
 })

 module.exports = client;
//Henreh was here :D//

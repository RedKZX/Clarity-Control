const { Client, GatewayIntentBits, AuditLogEvent, ModalBuilder, TextInputStyle, TextInputBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection, MessageType } = require(`discord.js`);
const fs = require('fs');
const client = new Client({ intents: [Object.keys(GatewayIntentBits), GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessageReactions,  GatewayIntentBits.GuildVoiceStates,  GatewayIntentBits.GuildMembers] }); 
const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require ('discord.js');
const axios = require ('axios');
const { ChannelType } = require('discord.js');
const { createTranscript } = require('discord-html-transcripts');
const { QuickDB } = require("quick.db");
const db = new QuickDB();
client.commands = new Collection();

require('dotenv').config();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
    client.login(process.env.token)
})();

client.on("messageCreate", async (message) => {
	if (message.author.bot) return false;
	if (message.content.includes("hawkmoon")) {
		message.reply(`Cohen has 20k kills on that gun. Maybe hes mentally ill.`);
	}
});

client.snipes = new Map()
client.on('messageDelete', function(message, channel) {
    client.snipes.set(message.channel.id, {
        content: message.content,
        author: message.author,
        image: message.attachments.first() ? message.attachments.first().proxyURL : null
    })
})


client.on("ready", () => {
    console.log("Initialisation Complete :)");

})

const figlet = require("figlet")
figlet.text("Mini Red", function (err, data){
 console.log(data)
})

// JOIN TO CREATE VOICE CHANNEL CODE //
 
const joinschema = require('./Schemas.js/jtc1schema');
const joinchannelschema = require('./Schemas.js/jtc2Schema');
 
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
                    .setColor('Red')
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
                        .setColor('Red')
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
                    .setColor('Red')
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
            .setColor('Red')
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
 
const pollschema = require('./Schemas.js/votes');
const pollsetup = require('./Schemas.js/votesetup');
 
client.on(Events.MessageCreate, async message => {
 
    if (!message.guild) return;
 
    const setupdata = await pollsetup.findOne({ Guild: message.guild.id });
    if (!setupdata) return;
 
    if (message.channel.id !== setupdata.Channel) return;
    if (message.author.bot) return;
 
    const embed = new EmbedBuilder()
    .setColor("Red")
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
            .setColor("Red")
            .setAuthor({ name: `🤚 Poll System`})
            .setFooter({ text: `🤚 Poll Members`})
            .setTimestamp()
            .addFields({ name: `• Upvoters (${upvoters.length})`, value: `> ${upvoters.join(', ').slice(0, 1020) || 'No upvoters'}`, inline: true})
            .addFields({ name: `• Downvoters (${downvoters.length})`, value: `> ${downvoters.join(', ').slice(0, 1020) || 'No downvoters'}`, inline: true})
 
            await i.reply({ embeds: [embed], ephemeral: true })
        }
})

/// TICKET SYSTEM //
 
const ticketSchema = require("./Schemas.js/ticketSchema");
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
          .setColor("Red")
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
      .setColor('Red')
 
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
      .setColor('Red')
      .setTimestamp()
      .setThumbnail(interaction.guild.iconURL())
      .setFooter({ text: `${interaction.guild.name}'s Tickets` })
 
      const processEmbed = new EmbedBuilder()
      .setDescription(` Closing ticket in 10 seconds...`)
      .setColor('Red')
 
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
        .setColor('Red')
  
        await interaction.reply({ embeds: [noEmbed], ephemeral: true })
     }
  }
})

//Anti Crash

client.on("error", (err) => {
    const ChannelID = "903783054034751578";
    const Embed = new EmbedBuilder()
      .setColor("Red")
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
    const ChannelID = "903783054034751578";
    console.log("Unhandled promise rejection:", reason, p);
    const Embed = new EmbedBuilder()
      .setColor("Red")
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
    const ChannelID = "903783054034751578";
    const Embed = new EmbedBuilder()
      .setColor("Red")
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
    const ChannelID = "903783054034751578";
    const Embed = new EmbedBuilder()
      .setColor("Red")
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
    const ChannelID = "903783054034751578";
    const Embed = new EmbedBuilder()
      .setColor("Red")
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
    const channel = await client.channels.cache.get("895427104089464903");
    const server = interaction.guild.name
    const user = interaction.user.tag
    const userId = interaction.user.id
  
    const embed = new EmbedBuilder()
    .setColor("Red")
    .setTitle(`CMD Log`)
    .addFields({ name: `Server Name`, value: `${server}`})
    .addFields({ name: `Chat Command`, value: `${interaction}`})
    .addFields({ name: `User`, value: `${user} / ${userId}`})
    .setTimestamp()
    .setFooter({ text: `Red`})
  
    await channel.send({ embeds: [embed] });
  
    }
 })
  

  // Welcome Message //
 
client.on(Events.GuildMemberAdd, async (member) => {
 
    const channelID = await db.get(`welchannel_${member.guild.id}`)
    const channelwelcome = member.guild.channels.cache.get(channelID)
 
    const embedwelcome = new EmbedBuilder()
    .setColor("Red")
     .setTitle('Welcome!')
     .setDescription( `> Eyes up ${member}  ${member.guild.name}
     **Make sure to complete the tasks in the registration category failure to do so will result in having to play garden of salvation**`)
     .setFooter({ text: `Welcome to ${member.guild.name}!`})
     .setTimestamp()
     .setAuthor({ name: `Red`})
 
    if (channelID == null) return;
 
    const embedwelcomedm = new EmbedBuilder()
     .setColor("Red")
     .setTitle('Welcome!')
     .setDescription( `> Eyes up ${member}  ${member.guild.name}
     **Make sure to complete the tasks in the registration category failure to do so will result in having to play garden of salvation**`)
     .setFooter({ text: `Welcome to ${member.guild.name}!`})
     .setTimestamp()
     .setAuthor({ name: `Red`})
 
    if (channelID == null) return;
 
    channelwelcome.send({ embeds: [embedwelcome]})
    member.send({ embeds: [embedwelcomedm]})
})

// Leave Message //
 
client.on(Events.GuildMemberRemove, async (member) => {
 
    const channelID = await db.get(`welchannel_${member.guild.id}`)
    const channelwelcome = member.guild.channels.cache.get(channelID)
 
    const embedleave = new EmbedBuilder()
     .setColor("Red")
     .setTitle('A Member has left')
     .setDescription( `> ${member} has left the Server`)
     .setFooter({ text: `Sucks to be them`})
     .setTimestamp()
     .setAuthor({ name: `Member Left, what a loser`})
 
    if (channelID == null) return;
 
    channelwelcome.send({ embeds: [embedleave]})
})

//Invite Logger
//removed temporarly

//logging

const logSchema = require('./Schemas.js/log')
 
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
                .setColor("Red")
                .setTitle("Channel Created")
                .addFields({ name: "Channel Name", value: `${name} (<#${id}>)`, inline: false})
                .addFields({ name: "Channel Type", value: `${type}`, inline: false})
                .addFields({ name: "Channel ID", value: `${id}`, inline: false})
                .addFields({ name: "Created By", value: `${executor.tag}`, inline: false})
                .setTimestamp()
                .setFooter({ text: "Mod Logging System"})
 
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
                .setColor("Red")
                .setTitle("Channel Deleted")
                .addFields({ name: "Channel Name", value: `${name}`, inline: false})
                .addFields({ name: "Channel Type", value: `${type}`, inline: false})
                .addFields({ name: "Channel ID", value: `${id}`, inline: false})
                .addFields({ name: "Deleted By", value: `${executor.tag}`, inline: false})
                .setTimestamp()
                .setFooter({ text: "Mod Logging System"})
 
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
                .setColor("Red")
                .setTitle("Member Banned")
                .addFields({ name: "Member Name", value: `${name} (<@${id}>)`, inline: false})
                .addFields({ name: "Member ID", value: `${id}`, inline: false})
                .addFields({ name: "Banned By", value: `${executor.tag}`, inline: false})
                .setTimestamp()
                .setFooter({ text: "Mod Logging System"})
 
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
                .setColor("Red")
                .setTitle("Member Unbanned")
                .addFields({ name: "Member Name", value: `${name} (<@${id}>)`, inline: false})
                .addFields({ name: "Member ID", value: `${id}`, inline: false})
                .addFields({ name: "Unbanned By", value: `${executor.tag}`, inline: false})
                .setTimestamp()
                .setFooter({ text: "Mod Logging System"})
 
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
                .setColor("Red")
                .setTitle("Message Deleted")
                .addFields({ name: "Message Content", value: `${mes}`, inline: false})
                .addFields({ name: "Message Channel", value: `${message.channel}`, inline: false})
                .addFields({ name: "Message Author", value: `${message.author.tag}`, inline: false})
                .setTimestamp()
                .setFooter({ text: "Mod Logging System"})
 
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
            .setColor("Red")
            .setTitle("Message Edited")
            .addFields({ name: "Old Message", value: `${mes}`, inline: false})
            .addFields({ name: "New Message", value: `${newMessage}`, inline: false})
            .addFields({ name: "Message Author", value: `${executor}`, inline: false})
            .setTimestamp()
            .setFooter({ text: "Mod Logging System"})
 
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
                .setColor("Red")
                .setTitle("Member Joined VC")
                .addFields({ name: "Member", value: `${mem}`, inline: false})
                .addFields({ name: "Member Tag & ID", value: `${memberTag}, ${memberID}`, inline: false})
                .setTimestamp()
                .setFooter({ text: "Mod Logging System"})
 
                mChannel.send({ embeds: [embed] })
 
            } else {
                let channelID = data.Channel;
                const mChannel = await member.guild.channels.cache.get(channelID);
 
                const embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("Member Left VC")
                .addFields({ name: "Member", value: `${mem}`, inline: false})
                .addFields({ name: "Member Tag & ID", value: `${memberTag}, ${memberID}`, inline: false})
                .setTimestamp()
                .setFooter({ text: "Mod Logging System"})
 
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
 
const afkSchema = require('./Schemas.js/afkSchema');
 
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

 const ghostSchema = require('./Schemas.js/ghostpingSchema');
 const numSchema = require('./Schemas.js/ghostNum');
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
//Red was here :D//

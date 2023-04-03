const { Client, GatewayIntentBits, EmbedBuilder, ModalBuilder, TextInputStyle, ActionRowBuilder, TextInputBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection, MessageType } = require(`discord.js`);
const fs = require('fs');
const client = new Client({ intents: [Object.keys(GatewayIntentBits), GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] }); 
const { Events } = require ('discord.js');
const axios = require ('axios');
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

client.snipes = new Map()
client.on('messageDelete', function(message, channel) {
    client.snipes.set(message.channel.id, {
        content: message.content,
        author: message.author,
        image: message.attachments.first() ? message.attachments.first().proxyURL : null
    })
})

client.on("ready", () => {
    console.log("Red has made something that works!");

const activities = [
    'Cohen uses Cronus',
    'Red is miles above you all',
    'Langerz is ginger',
    'Kissing Bananas',
    'Benji pinging announcements',
    'ERPing with Wozzie',
    'Im having a nightmare shit rn'
];

setInterval(() => {
    const status = activities[Math.floor(Math.random() * activities.length)];
    client.user.setPresence({ activities: [{ name: `${status}`}]});
},  10000);

})

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

////logging

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

//Invite Logger

const inviteSchema = require('./Schemas.js/inviteSchema');
 
const invites = new Collection();
const wait = require("timers/promises").setTimeout;
 
client.on('ready', async () => {
 
    await wait(2000);
 
    client.guilds.cache.forEach(async (guild) => {
 
        const clientMember = guild.members.cache.get(client.user.id);
 
        if (!clientMember.permissions.has(PermissionsBitField.Flags.ManageGuild)) return;
 
        const firstInvites = await guild.invites.fetch().catch(err => {console.log(err)});
 
        invites.set(guild.id, new Collection(firstInvites.map((invite) => [invite.code, invite.uses])));
 
    })
})
 
client.on(Events.GuildMemberAdd, async member => {
 
    const Data = await inviteSchema.findOne({ Guild: member.guild.id});
    if (!Data) return;
 
    const channelID = Data.Channel;
 
    const channel = await member.guild.channels.cache.get(channelID);
 
    const newInvites = await member.guild.invites.fetch();
 
    const oldInvites = invites.get(member.guild.id);
 
    const invite = newInvites.find(i => i.uses > oldInvites.get(i.code));
 
    if (!invite) return await channel.send(`${member.user.tag} joined the server using an unknown invite. This err is most likely the vanity link!`)
 
    const inviter = await client.users.fetch(invite.inviter.id);
 
    inviter 
        ? channel.send(`${member.user.tag} joined the server using the invite ${invite.code} from ${inviter.tag}.  The invite was used ${invite.uses} times since its creation`)
        : channel.send(`${member.user.tag} joined the server but I can't find what invite they used to do it`);
})



 //Ghost ping [AGP]

 const ghostSchema = require('./Schemas.js/ghostpingSchema');
 const numSchema = require('./Schemas.js/ghostNum');

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

        const data = await numSchema.findOne({ GUild: messsage.guild.id, User: message.author.id});
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

//No stealey//

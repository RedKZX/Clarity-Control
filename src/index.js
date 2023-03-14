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

//Ticket System (modal)
 
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

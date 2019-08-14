// Import discord.js
// https://discord.js.org/#/
const Discord = require('discord.js');

// Import 'colors.js' package, used to colorize node output
// https://www.npmjs.com/package/colors
// eslint-disable-next-line no-unused-vars
const colors = require('colors');

// Initialize Discord Bot
const client = new Discord.Client();

// Checks the authorization key and command prefix
const config = require('./auth.json');

// Print Welcome message
console.log('Created by AJ Natzic for the Big Boys Club discord server.'.red);
console.log('Starting Chad Bot...'.bold.yellow);
// This event will run if the bot starts, and logs in, successfully.
client.on('ready', () => {
    console.log(`Chad Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} servers.`.bold.green);
    client.user.setActivity('Use \'?help\' for commands');
});

// This event triggers when the bot joins a server.
client.on('guildCreate', server => {
    console.log(`New server joined: ${server.name} (id: ${server.id}). This server has ${server.memberCount} members!`.bold.yellow);
    client.user.setActivity('Use \'?help\' for commands');
});

// This event triggers when the bot is removed from a server.
client.on('guildDelete', server => {
    console.log(`I have been removed from: ${server.name} (id: ${server.id})`.bold.red);
    client.user.setActivity('Use \'?help\' for commands');
});

// This sends a message to the general channel everytime someone joins the server.
client.on('guildMemberAdd', member => {
    member.guild.channels.get('267848755393331213').send(`Hey ${member}, welcome to the club.`);
});

// This sends a message to the general channel everytime someone leaves the server.
client.on('guildMemberRemove', member => {
    member.guild.channels.get('267848755393331213').send(`${member.user.tag} has left the server.`);
});
// This event will run on every single message received, from any channel or DM.
client.on('message', async message => {
    // Ignores commands from itself and other bots
    if (message.author.bot) {
        return;
    }

    // Actions that the bot will execute if the command prefix '?' is not at the beginning of a message (a plain message)
    if (message.content.indexOf(config.prefix) !== 0) {
    // Get the msg text and convert it to lowercase
        const msgText = message.content.toLowerCase();

        // Get the user mentioned TODO: make it so users mentioned will also get a react
        const userMention = message.mentions.members;

        // Check if the message includes 'bot' or 'chad'
        if (msgText.includes('bot') || msgText.includes('chad') || msgText.includes(userMention)) {
            const emoji = message.guild.emojis.find(emoji => emoji.name === 'chad');

            message.react(emoji);
        }
        // Check if the message includes 'aj'
        if (msgText.includes('aj') || msgText.includes(userMention)) {
            // An array containing the list of emojis related to aj, change as emojis are added
            const ajEmojis = ['yeehaw', 'slickAJ', 'KittenDisease'];
            const min = 0;
            const max = ajEmojis.length;
            const random = Math.floor(Math.random() * (+max - +min)) + +min;

            // Find a random emoji
            const emoji = message.guild.emojis.find(emoji => emoji.name === ajEmojis[random]);

            message.react(emoji);
        }
        // Check if the message includes 'michael', 'mikol' or 'mike'
        if (message.content.toLowerCase().includes('michael') || message.content.toLowerCase().includes('mikol') || message.content.toLowerCase().includes('mike')) {
            // An array containing the list of emojis related to michael, change as emojis are added
            const mikeEmojis = ['mikeZoinked', 'mikeSleep', 'mikeEZ', 'ProtectorOfVirginity'];
            const min = 0;
            const max = mikeEmojis.length;
            const random = Math.floor(Math.random() * (+max - +min)) + +min;

            // Find a random emoji
            const emoji = message.guild.emojis.find(emoji => emoji.name === mikeEmojis[random]);

            message.react(emoji);
        }
        // Check if the message includes 'connor'
        if (message.content.toLowerCase().includes('connor')) {
            const emoji = message.guild.emojis.find(emoji => emoji.name === 'ConnorWut');
            message.react(emoji);
        }
        // Check if the message includes 'grant'
        if (message.content.toLowerCase().includes('grant')) {
            // An array containing the list of emojis related to grant, change as emojis are added
            const grantEmojis = ['grantKappa', 'GrantFused'];
            const min = 0;
            const max = grantEmojis.length;
            const random = Math.floor(Math.random() * (+max - +min)) + +min;

            // Find a random emoji
            const emoji = message.guild.emojis.find(emoji => emoji.name === grantEmojis[random]);

            message.react(emoji);
        }
        // Check if the message includes 'walter'
        if (message.content.toLowerCase().includes('walter')) {
            const emoji = message.guild.emojis.find(emoji => emoji.name === 'walter');
            message.channel.send(`${emoji}`);
            message.channel.send('Walter');
        }
        // Return so that the below commands are not checked (since there's no command prefix)
        return;
    }

    // Separate arguments and commands
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    // All commands are lowercase, but can be called in discord in uppercase
    const command = args.shift().toLowerCase();

    const commandsList = {
        help: 'Displays this help menu.',
        ping: 'Tells you the current ping of the bot, as well as the API latency.',
        'say [message]': 'The bot will parrot anything that is typed in place of [message].',
        usercount: 'Gives you the current amount of users in the server.',
        msgcount: 'Tells you how many messages have been sent in the entire server.',
        default: 'Yeehaw',
        'joined [@user]': 'Use this command in conjunction with an [@user] to see when a specific user joined the server. Or just use the command by itself to see when you joined.',
        'botcheck [@user]': 'Use this command to see if a user has the \'bot\' role. Use the command by itself to see if you have the bot role.',
        'kick [@user] [kickReason]': 'Use this command to kick someone. You must be one of the biggest boys to do this.',
        'ban [@user] [banReason]': 'Use this command to ban someone. You must be one of the biggest boys to do this.',
        'purge [number]': 'Delete between 2 and 500 messages in a channel. You must be a big boy to do this.',
        invite: 'Get the permanent invite link to the server. This link can be used forever.',
    };

    // Var used to store mentioned member IDs from a message
    let member;
    switch (command) {
    // Gives the user a list of commands as well as a description on how to use them
    case 'help':
        var menu = (`Help menu
        --------------------------------------------------------------------\n`);
        for (var key in commandsList) {
            menu += (`?${key} | ${commandsList[key]}\n`);
        }
        message.channel.send(menu);
        break;

    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    case 'ping': {
        const m = await message.channel.send('Calculating ping...');
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
        break;
    }

    // makes the bot say something and delete the message. As an example, it's open to anyone to use.
    // To get the 'message' itself we join the `args` back into a string with spaces:
    case 'say': {
        const sayMessage = args.join(' ');
        // Then we delete the command message.
        message.delete().catch(() => { });
        // And we get the bot to say something:
        message.channel.send(sayMessage);
        break;
    }

    // Returns the amount of users in the server
    case 'usercount':
        message.channel.send(`There are currently ${client.users.size} members in this server!`);
        break;

    // Returns the amount of messages in a specific channel
    case 'msgcount':
        // FIXME can only count to 100 messages
        message.channel.fetchMessages({ limit: 10000 })
            .then(messages => message.channel.send(`There are currently ${messages.size} messages in this server!`))
            .catch(console.error);
        break;

    // Returns the link to a default dance gif, yeehaw
    case 'default': // Note: NOT the default case, the command is literally called default
        message.channel.send({ files: ['https://cdn.discordapp.com/attachments/553401247948996608/566611034090110977/a3229cf.gif'] });
        break;

    // Tells the user when a person joined
    case 'joined':
        member = message.mentions.members.first();

        // If only '!joined' is typed with no user, or user is invalid
        if (!member) {
            const author = message.member;
            message.channel.send(`${author} joined the server on ${author.joinedAt}`);
        } else {
            message.channel.send(`${member} joined the server on ${member.joinedAt}`);
        }
        break;

    // Tells the user if the mentioned member is a bot
    // Only checks if user has the 'Bots' role. Not if it's actually a bot.
    case 'botcheck': {
        const user = message.mentions.members.first();
        const author = message.author;
        if (!user) {
            if (message.member.roles.some(r => ['Bots'].includes(r.name))) {
                message.channel.send(`${author} is a bot!`);
            } else {
                message.channel.send(`${author} is not a bot!`);
            }
        } else {
            if (user.roles.some(r => ['Bots'].includes(r.name))) {
                message.channel.send(`${user} is a bot!`);
            } else {
                message.channel.send(`${user} is not a bot!`);
            }
        }
        break;
    }

    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit:
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    case 'kick': {
        if (!message.member.roles.some(r => ['The Biggest Boys'].includes(r.name))) {
            return message.reply('Sorry, you don\'t have permissions to use this!');
        }

        // Let's first check if we have a member and if we can kick them!
        // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
        // We can also support getting the member by ID, which would be args[0]
        member = message.mentions.members.first() || message.server.members.get(args[0]);
        if (!member) {
            return message.reply('Please mention a valid member of this server');
        }
        if (!member.kickable) {
            return message.reply('I cannot kick this user! Do they have a higher role? Do I have kick permissions?');
        }

        // slice(1) removes the first part, which here should be the user mention or ID
        // join(' ') takes all the various parts to make it a single string.
        let kickReason = args.slice(1).join(' ');
        if (!kickReason) {
            kickReason = 'No kick reason provided';
        }

        // Attempt to kick the member, throw error if not possible
        await member.kick(kickReason)
            .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
        message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${kickReason}`);

        break;
    }

    // Most of this command is identical to kick, except that here we'll only let admins do it.
    case 'ban': {
        if (!message.member.roles.some(r => ['The Biggest Boys'].includes(r.name))) {
            return message.reply('Sorry, you don\'t have permissions to use this!');
        }

        member = message.mentions.members.first();
        if (!member) {
            return message.reply('Please mention a valid member of this server');
        }
        if (!member.bannable) {
            return message.reply('I cannot ban this user! Do they have a higher role? Do I have ban permissions?');
        }

        let banReason = args.slice(1).join(' ');
        if (!banReason) {
            banReason = 'No ban reason provided';
        }

        await member.ban(banReason)
            .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
        message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${banReason}`);
        break;
    }

    // This command removes all messages from all users in the channel, up to 500.
    // This can only be used by Big Boys
    case 'purge': {
        if (!message.member.roles.some(r => ['Big Boys'].includes(r.name))) {
            return message.reply('Sorry, you don\'t have permissions to use this!');
        }

        // get the delete count, as an actual number.
        const deleteCount = parseInt(args[0], 10);

        if (!deleteCount || deleteCount < 2 || deleteCount > 500) {
            return message.reply('Please provide a number between 2 and 500 for the number of messages to delete');
        }

        // So we get our messages, and delete them. Simple enough, right?
        const fetched = await message.channel.fetchMessages({ limit: deleteCount });
        message.channel.bulkDelete(fetched)
            .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
        break;
    }

    // Sends a message that contains a permanent invite link
    case 'invite':
        message.reply('Here is the permanent invite link to the server:\n https://discord.gg/M86FBc8');
        break;

    // If the command is not recognized
    default:
        return message.channel.send('Honestly, I have no idea what that means. Use \'?help\' to see the list of commands.');
    }
});

client.login(config.token);

const Discord = require('discord.js');

const auth = require('./auth.json');
// Initialize Discord Bot
const client = new Discord.Client();


const config = require("./auth.json");

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} servers.`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

// This event triggers when the bot joins a server.
client.on("guildCreate", server => {
  console.log(`New server joined: ${server.name} (id: ${server.id}). This server has ${server.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

// this event triggers when the bot is removed from a server.
client.on("guildDelete", server => {
  console.log(`I have been removed from: ${server.name} (id: ${server.id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});


// This event will run on every single message received, from any channel or DM.
client.on("message", async message => {

  // Ignores commands from itself and other bots
  if(message.author.bot) return;

  // Ignores any message that does not contain the prefix defined in "auth.json"
  if(message.content.indexOf(config.prefix) !== 0) return;

  // Seperate arguments and commands
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();	// all commands are lowercase, but can be called in discord in uppercase
  
  const commandsList = {
	"ping": "Tells you the current ping of the bot, as well as the API latency.",
	"say [message]": "The bot will parrot anything that is typed in place of [message].",
	"usercount": "Gives you the current amount of users in the server.",
	"msgcount": "Tells you how many messages have been sent in the entire server.",
	"default": "Yeehaw",
	"joined [@user]": "Use this command in conjunction with an [@user] to see when a specific user joined the server. Or just use the command by itself to see when you joined.",
	"botcheck [@user]": "Use this command to see if a user has the 'bot' role. Use the command by itself to see if you have the bot role.",
	"kick [@user] [reason]": "Use this command to kick someone. You can only do this if you have admin permissions.",
	"ban [@user] [reason]": "Use this command to ban someone. You can only do this if you have admin permissions.",
	"purge [number]": "Delete between 2 and 500 messages in a channel."
  }

  // Gives the user a list of commands as well as a description on how to use them
  if(command === "help"){
		  var menu = (`Help menu
		  --------------------------------------------------------------------\n`);
	  for(var key in commandsList) {
		  menu += (`?${key} | ${commandsList[key]}\n`);
	  }
	  message.channel.send(menu);
  }

  // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
  // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
  if(command === "ping") {
    const m = await message.channel.send("Calculating ping...");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }

  // makes the bot say something and delete the message. As an example, it's open to anyone to use.
  // To get the "message" itself we join the `args` back into a string with spaces:
  if(command === "say") {
    const sayMessage = args.join(" ");
    // Then we delete the command message.
    message.delete().catch(O_o=>{});
    // And we get the bot to say something:
    message.channel.send(sayMessage);
  }

  // Returns the amount of users in the server
  if(command === "usercount"){
	message.channel.send(`There are currently ${client.users.size} members in this server!`);
  }

  // Returns the amount of messages in a specific channel
  if(command === "msgcount") {
	message.channel.fetchMessages({limit: 10000})	//FIXME can only count to 100 messages
  		.then(messages => message.channel.send(`There are currently ${messages.size} messages in this server!`))
  		.catch(console.error);
  }

  // Returns the link to a default dance gif, yeehaw
  if(command === "default"){
	  message.channel.send({files: ["https://cdn.discordapp.com/attachments/553401247948996608/566611034090110977/a3229cf.gif"]});
  }

  // Tells the user when a person joined
  if(command === "joined"){
	const member = message.mentions.members.first();
	
	// If only "!joined" is typed with no user, or user is invalid
	if(!member) {
		const author = message.member;
		message.channel.send(`${author} joined the server on ${author.joinedAt}`);
	}
	// Otherwise, find the user inputted
	else {
		message.channel.send(`${member} joined the server on ${member.joinedAt}`);
	}
  }

  // Tells the user if the mentioned member is a bot
  // Only checks if user has the "Bots" role. Not if it's actually a bot.
  if(command === "botcheck"){
	const user = message.mentions.members.first();
	const author = message.author;
	if(!user) {
		if(message.member.roles.some(r=>["Bots"].includes(r.name))) {
		message.channel.send(`${author} is a bot!`);
		}
		else {
			message.channel.send(`${author} is not a bot!`);
		}
	}
	else {
		if(user.roles.some(r=>["Bots"].includes(r.name))) {
		message.channel.send(`${user} is a bot!`);
		}
		else {
			message.channel.send(`${user} is not a bot!`);
		}
	}
  }

  if(command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit:
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.roles.some(r=>["The Biggest Boys", "Big Boys"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");

    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    // We can also support getting the member by ID, which would be args[0]
    let member = message.mentions.members.first() || message.server.members.get(args[0]);
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable)
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");

    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";

    // Attempt to kick the member, throw error if not possible
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

  }

  // Most of this command is identical to kick, except that here we'll only let admins do it.
  if(command === "ban") {
    if(!message.member.roles.some(r=>["The Biggest Boys"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");

    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable)
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";

    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }

  // This command removes all messages from all users in the channel, up to 500.
  if(command === "purge") {

	if(!message.member.roles.some(r=>["The Biggest Boys"].includes(r.name)) )
	  return message.reply("Sorry, you don't have permissions to use this!");
	  
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);

    if(!deleteCount || deleteCount < 2 || deleteCount > 500)
      return message.reply("Please provide a number between 2 and 500 for the number of messages to delete");

    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }
});

client.login(config.token);

// Invite link: https://discord.com/api/oauth2/authorize?client_id=962179559053197342&permissions=2048&scope=bot%20applications.commands

// Some imports
const fs = require("fs");
const {Client, Intents, Collection} = require("discord.js");
const {prefix, token} = require("./config.json");

// Initialize some stuff
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
const cooldowns = new Collection();

// Get all the commands and store them somewhere
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}
const defaultCommand = client.commands.get("user");

// Notify when ready
client.once("ready", () => {
	console.log("Bot online!");

  client.user.setActivity("lemon", {type: "PLAYING"});
});

client.on("messageCreate", message => {
  // Ignore messages that are not commands
  if (!message.content.startsWith(prefix)) return;

  // Get command arguments and command
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // Get command info; search for command and also the aliases
  const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  // Default lemonstatistics on user
  if (!command) {
    defaultCommand.execute(message, message.content.slice(prefix.length).trim().split(/ +/));
    return;
  }

  // Cooldown stuff
  if (!cooldowns.has(command.name)) {
    // The command is not in cooldowns yet
    cooldowns.set(command.name, new Collection());
  }

  // Current time
  const now = Date.now();
  // Collection of the timestamps for when each user that has a cooldown has run the command
  const timestamps = cooldowns.get(command.name);
  // Command Cooldown time
  const cooldownAmount = (command.cooldown || 0) * 1000;

  // Check whether the current user has a logged cooldown
  if (timestamps.has(message.author.id)) {
    // Get expiration time for cooldown
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    // Check if the cooldown is expired.
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(`please wait ${Math.round(timeLeft)}s before reusing the \`${command.name}\` command.`);
    }
  }

  // Add current time to timestamps, with author
  timestamps.set(message.author.id, now);
  // Delete the cooldown after time is up
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  // Execute command
  try {
    command.execute(message, args);
  } catch (error) {
    // There was some error running the command
    console.error(error);
    message.reply("there was an error running that command.");
  }
});


// Very important bit
client.login(token);
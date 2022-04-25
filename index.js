// Bot invite link: https://discord.com/api/oauth2/authorize?client_id=962179559053197342&permissions=2048&scope=bot%20applications.commands

// Some imports
const fs = require("fs");
const Discord = require("discord.js");
const { prefix } = require("./config.json");
const log = require("./log");

// Get token from file
var token = fs.readFileSync("./token.txt", "utf8").replace(/\s/g, "");

// Initialize some stuff
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });
const cooldowns = new Discord.Collection();

// Get all the commands and store them somewhere
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}
const defaultCommand = client.commands.get("leaderboard");

/**
 *
 * @param {{name: String, description: String, usage: String, aliases: Array<String>, cooldown: Number, universalCooldown: boolean}} command
 * @param {Discord.Message} message
 * @param {Array<String>} args
 * @returns
 */
async function runCommand(command, message, args) {
  if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return; // no permission to speak in this channel

  log.info(
    `${message.author.tag}: issued ${message.content}: ${message.guild.name} #${message.channel.name} (${message.guild.id}#${message.channel.id})`
  );

  var id = command.universalCooldown ? message.channel.id : message.author.id;
  if (!cooldowns.has(command.name)) {
    // The command is not in cooldowns yet
    cooldowns.set(command.name, new Discord.Collection());
  }

  // Current time
  const now = Date.now();
  // Collection of the timestamps for when each user that has a cooldown has run the command
  const timestamps = cooldowns.get(command.name);
  // Command Cooldown time
  const cooldownAmount = (command.cooldown || 0) * 1000;

  // Check whether the current user has a logged cooldown
  if (timestamps.has(id)) {
    // Get expiration time for cooldown
    const expirationTime = timestamps.get(id) + cooldownAmount;

    // Check if the cooldown is expired.
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      log.info(
        `${message.author.tag}: tried to run ${message.content} in ${message.guild.name} #${message.channel.name} but on cooldown for ${timeLeft} seconds`
      );
      return message.reply(`please wait ${Math.round(timeLeft)}s before reusing the \`${command.name}\` command.`);
    }
  }

  // Add current time to timestamps, with author
  timestamps.set(id, now);
  // Delete the cooldown after time is up
  setTimeout(() => timestamps.delete(id), cooldownAmount);

  try {
    await command.execute(message, args, client);
  } catch (error) {
    // There was some error running the command
    try {
      // this may not be possible because of permission stuff
      message.reply("there was an error running that command.");
      message.channel.send(`Error message:\n\`\`\`\n${error}\n\`\`\``);
    } catch (error) {}
    log.error(error.toString());
  }
  log.info(`Done running ${message.content} in ${message.guild.name} #${message.channel.name}`);
}

// Notify when ready
client.once("ready", () => {
  log.info("Bot online!");

  client.user.setActivity("lemon", { type: "PLAYING" });
});

client.on("messageCreate", async (message) => {
  // Ignore messages that are not commands
  if (!message.content.startsWith(prefix)) return;

  // Get command arguments and command
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // Get command info; search for command and also the aliases
  const command =
    client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

  // Default lemonstatistics on user
  if (!command) {
    await runCommand(defaultCommand, message, message.content.slice(prefix.length).trim().split(/ +/));
    return;
  }

  // Execute command
  await runCommand(command, message, args);
});

// Connect to the bot using the login token
client.login(token);

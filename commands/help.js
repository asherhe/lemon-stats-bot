const Discord = require("discord.js");
const pluralize = require("pluralize");
const { prefix } = require('../config.json');

module.exports = {
  name: "help",
  description: "Provides information about a certain command. If no command given, lists out all commands",
  usage: "help (command)",
  aliases: ["command"],
  /**
   * Executes this command
   * @param {Discord.Message} message The message that invoked this command
   * @param {Array<String>} args The supplied arguments for this command
   */
  execute(message, args) {
    // The data to output
    var data = [];

    // The command list
    const { commands } = message.client;

    // No argument
    if (!args.length) {
      data.push("Here's a list of all the commands:");
      data.push(commands.map(command => `\t- \`${command.name}\``).join("\n"));
      data.push(`To get more information about a command, use \`${prefix} help [command]\``);
    } else {
      // Get command info
      const name = args[0].toLowerCase();
      const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

      // No such command
      if (!command) {
        return message.reply(`${command.name} is not a valid command!`);
      }

      // Add info about command
      data.push(`**Name:** \`${command.name}\``);
      if (command.aliases) {
        data.push(`**${pluralize("Alias", command.aliases.length)}:** ${command.aliases.map(alias => `\`${alias}\``).join(", ")}`);
      }
      data.push(`**Description:** ${command.description}`);
      if (command.cooldown) {
        data.push(`**Cooldown:** ${command.cooldown}s`);
      }
      data.push(`**Usage:** \`${prefix} ${command.usage}\``);
    }
    return message.channel.send(data.join("\n"), { split: true });
  }
}
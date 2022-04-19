const Discord = require("discord.js");
const { allowedusers } = require("../config.json");
const log = require("../log");

module.exports = {
  name: "spam",
  description: "lemonlemonlemonlemonlemonlemon",
  usage: "spam <amount>",
  cooldown: 600,
  /**
   * Executes this command
   * @param {Discord.Message} message The message that invoked this command
   * @param {Array<String>} args The supplied arguments for this command
   * @param {Discord.Client} client The client that this command was run from
   */
  async execute(message, args, client) {
    if (args[0] > 500) {
      log.info(
        `User ${message.author.tag} tried to spam ${args[0]} messages in ${message.guild.name} #${message.channel.name}`
      );
      message.reply(`please do not spam ${args[0]} \`lemon\`s thank you very much`);
      return;
    }

    if (allowedusers.includes(message.author.id)) {
      for (var i = 0; i < args[0]; i++) {
        await message.channel.send("lemon");
      }
    } else {
      message.reply("you do not have permission to use this command");
    }
  },
};

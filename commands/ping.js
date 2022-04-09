const Discord = require("discord.js")
module.exports = {
  name: "ping",
  description: "Pong!",
  usage: "ping",
  cooldown: 10,
  /**
   * Executes this command
   * @param {Discord.Message} message The message that invoked this command
   * @param {Array<String>} args The supplied arguments for this command
   */
  execute(message, args) {
    message.reply(`Pong!`);
  }
}
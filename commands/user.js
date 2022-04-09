const Discord = require("discord.js")
const {prefix} = require("../config.json");

// /**
//  * 
//  * @param {Map<>} map 
//  * @param {(any, any) => void} callback 
//  */
// async function asyncForEach(map, callback) {
//   var keys = map.keys();
//   var values = map.values();
//   console.log(values.get(0));
//   for (let i = 0; i < map.size; i++) {
//     await callback(keys[i], values[i]);
//   }
// }

module.exports = {
  name: "user",
  description: `Gives lemon statistics on a user\nNote: this is the default command if no command is supplied (i.e. \`${prefix} <@user>\``,
  usage: "user <@user>",
  //cooldown: 30,
  /**
   * Executes this command
   * @param {Discord.Message} message The message that invoked this command
   * @param {Array<String>} args The supplied arguments for this command
   */
  async execute(message, args) {
    var channel = message.channel;

    message.reply(`this command is still under development. below may be some debug output\n—<@598315657595191316> (developer)`);
    
    var user = message.mentions.users.first();
    if (!user) {
      user = message.author;
    }

    channel.send(`Target User: \`${user.username}\``);

    var messages = await channel.messages.fetch({ limit: 100 })

    var lemonCount = new Discord.Collection();
    messages.forEach((message) => {
      if (message.content.includes("lemon")) {
        if (lemonCount.has(message.author.id)) {
          lemonCount.set(message.author.id, lemonCount.get(message.author.id) + 1);
        } else {
          lemonCount.set(message.author.id, 1);
        }
      }
    });

    channel.send(`Fetched ${messages.size} messages from channel \`#${channel.name}\`\n`);
    var lemonBreakdown = "**Lemon Breakdown:**"
    await lemonCount.forEach((author, count) => {
      //console.log(author)
      lemonBreakdown.concat(`\n<@${author}> - ${count}`);
      channel.sendTyping(lemonBreakdown);
    });
    
    channel.send(lemonBreakdown);
  }
}
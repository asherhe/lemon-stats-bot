const Discord = require("discord.js");
const { prefix, leaderboardawards } = require("../config.json");
const log = require("../log");

/**
 * Fetches all messages in a channel
 * @param {Discord.TextChannel} channel The channel to fetch messages from
 * @param {Number} limit The maximum amount of messages to fetch
 */
async function fetchAllMessages(channel) {
  var fetchedMessages = new Discord.Collection();
  var lastId = null;

  var fetchMessage = await channel.send("Fetching messages...");

  do {
    var options = { limit: 100 };
    if (lastId) options.before = lastId;
    var messages = await channel.messages.fetch(options);
    fetchedMessages = fetchedMessages.concat(messages);

    fetchMessage.edit(`Fetched ${fetchedMessages.size} messages from channel`);

    lastId = fetchedMessages.last().id;
  } while (messages.last());

  log.info(`Fetched total of ${fetchedMessages.size} messages from ${channel.guild.name} #${channel.name}`);
  //fetchMessage.delete();

  return fetchedMessages;
}

module.exports = {
  name: "leaderboard",
  description: "Displays the lemon count for all users in the server",
  usage: "leaderboard",
  cooldown: 300,
  universalCooldown: true,
  /**
   * Executes this command
   * @param {Discord.Message} message The message that invoked this command
   * @param {Array<String>} args The supplied arguments for this command
   * @param {Discord.Client} client The client that this command was run from
   */
  async execute(message, args, client) {
    var channel = message.channel;

    //channel.send(`this command is still under development. below may be some debug info\n—<@598315657595191316> (developer)`);

    var messages = await fetchAllMessages(channel);

    var lemonDisplayMessage = await channel.send("Searching channel...");
    var lemonCount = new Discord.Collection();
    /** @type Discord.Message */
    var lastMessage = null;
    var blockContainsLemon = false;
    messages.forEach((/** @type Discord.Message */ message) => {
      if (message.content.toLowerCase().includes("lemon")) {
        if (!blockContainsLemon && message.author.id !== message.guild.me.id) {
          if (lemonCount.has(message.author.id))
            lemonCount.set(message.author.id, lemonCount.get(message.author.id) + 1);
          else lemonCount.set(message.author.id, 1);
          blockContainsLemon = true;
        }
      }
      if (lastMessage && lastMessage.author !== message.author) blockContainsLemon = false;
      if (message.author.id !== message.guild.me.id) lastMessage = message;
    });

    log.info(`Done searching channel ${message.guild.name} #${message.channel.name}`);

    var lemonBreakdown =
      "**Lemon Leaderboard**\n*(Note: Consecutive messages containing `lemon` are considered as one)*";
    lemonCount.sort(function (count1, count2, author1, author2) {
      return count2 - count1;
    });

    var place = 0;
    lemonCount.forEach((count, author) => {
      var user = client.users.cache.get(author);
      lemonBreakdown += `\n\`${leaderboardawards[place] || ""}${user.tag}\`: ${count}`;
      place++;
    });

    lemonDisplayMessage.edit(lemonBreakdown);
  },
};

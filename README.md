# Lemon Stats

A Discord bot that counts the number of times people have said `lemon` in a channel.

## Local Setup

First, clone the repository with

```shell
git clone https://github.com/asherhe/lemon-stats-bot.git
cd lemon-stats-bot
```

Afterwards install all the dependencies with

```shell
npm install
```

Next create a text file called `token.txt` in the root directory. Paste the Discord bot token of your bot in `token.txt` (trailing whitespace is fine, the program will handle it)

Finally run the bot with

```shell
npm start
```

Your bot should appear to be online!

Afterwards say `lstats` in any Discord channel the bot is present in and it should end up counting and creating a leaderboard.

The bot will be logging commands and also any errors in `./log.txt`. If any error occurs, the error will be logged there, as well as any commands that may have lead to the error. If you spot an error please do [submit an issue](https://github.com/asherhe/lemon-stats-bot/issues/new). It really helps with the development!

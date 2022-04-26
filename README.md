# Lemon Stats

A Discord bot that counts `lemon`

## Why does this exist???

In this Discord server I am in, there is this random tradition of spamming lemon. I decided to tabulate this, and because using the Search function for every user is not extremely fun, I decided to make a bot to do this automatically.

## Where is the bot token?

For security reasons (namely not getting my bot hijacked by random strangers), I have omitted the bot token from this repository. If you do want to use this code for a bot, however, simply make a `token.txt` file in the root directory and paste your token in there. The program should sort this out by itself. (if you don't have a token for your bot, [create a bot](https://discordjs.guide/preparations/setting-up-a-bot-application.html) and get the token from the Discord Developer portal).

*(nice try but the token in the commits of yore no longer works)*

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

Afterwards send `lstats` in any Discord channel the bot is present in and it should end up counting and creating a leaderboard.

The bot will be logging commands and also any errors in `./log.txt`. If any error occurs, the error will be logged there, as well as any commands that may have lead to the error. If you spot an error please do [submit an issue](https://github.com/asherhe/lemon-stats-bot/issues/new). It really helps with the development!

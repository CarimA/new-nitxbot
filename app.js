'use strict';

const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.DISCORD_TOKEN;

client.on('ready', () => {
    console.log(`I am ready to do stuff!`);
});

client.on('message', (msg) => {
    if (msg.content === 'ping') {
        msg.channel.send('pong');
    }
});

client.login(token);
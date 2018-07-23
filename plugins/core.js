'use strict';

module.exports = {
    init: (client) => {

    },

    on_chat: (user, channel, msg, reply) => {

    },

    commands: [
        {
            aliases: [ 'about', 'git', 'source', 'sourcecode' ],
            description: `Posts a summary of information about the bot.`,
            do: (user, channel, params, reply) => {
                reply(`Hello! I am **NitxBot 2.0** *(Well, 3.0 really, but we don't talk about 1.0)* a smart plugin-based bot made in NodeJS. You can find my source code over on **GitHub https://github.com/CarimA/new-nitxbot**`);
            }
        },
        {
            aliases: [ 'ping' ],
            description: 'Pong!',
            do: (user, channel, params, reply) => {
                reply(`Pong!`);
            }  
        }
    ]
}
'use strict';

global.log = (input) => {
    console.log(input);
    if (client) {
        var chan = client.channels.get('468510016568164362');
        //console.log(client.channels);
        if (chan) {
            chan.send('```js\r\n' + input + '```');
        }
    }
}

const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.DISCORD_TOKEN;

let plugins = {};
const path = require('path');
const fs = require('fs');
const requireDir = require('require-dir');
const decache = require('decache');
const onFileChange = require('on-file-change');

function toCommand(text, cb) {
    // check that there is text and a callback...
    if (!text || !cb) {
        return;
    }

    // check that the given text might actually be a command
    if (text.substr(0, process.env.COMMAND_DELIMITER.length) !== process.env.COMMAND_DELIMITER) {
        return;
    }

    // remove command char
    text = text.substr(process.env.COMMAND_DELIMITER.length);

    // get command
    let command = text.split(' ')[0].toLowerCase();

    // filter command out
    text = text.substr(command.length)

    // pre-process arguments further
    text = text.trim();

    // split arguments now
    let args = text.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);		
	args = args || [];

    // post-process args
    for (let i = 0; i < args.length; i++) {
        args[i] = args[i].trim();
    }

    cb(command, args);
}

client.on('ready', () => {
    log(`Starting up...`);
    client.user.setPresence({ status: 'online', game: { name: 'v0.0.3' } });
});

client.on('message', (msg) => {
    if (client.user.id === msg.author.id) {
        return;
    }

    for (let p in plugins) {
        if (plugins[p].on_chat) {
            try {
                plugins[p].on_chat(msg.author, msg.channel, msg, (input) => msg.channel.send(input));
            } catch (e) {
                msg.channel.send(`Uh oh, something went wrong. I've let my master know, he'll look it up eventually :eyes:`)
                log(`An error occured in ${p}.js (on_chat). ${e.name}: ${e.message}`);
            }
        }
    }

    toCommand(msg.content, (command, params) => {
        for (let p in plugins) {
            let pluginCommands = plugins[p].commands;
            if (pluginCommands) {
                for (let c = 0; c < pluginCommands.length; c++) {
                    let com = pluginCommands[c];
                    if (com.aliases.indexOf(command) > -1) {
                        try {
                            com.do(msg.author, msg.channel, params, (input) => msg.channel.send(input));
                        } catch(e) {
                            msg.channel.send(`Uh oh, something went wrong. I've let my master know, he'll look it up eventually :eyes:`)
                            log(`An error occured in ${p}.js (command). ${e.name}: ${e.message}`);
                        }
                    }
                }
            }
        }
    });

    if (msg.content === 'ping') {
        msg.channel.send('pong');
    }
});

function loadPlugin(file, cb) {
    try {
        let name = file.replace('.js', '');
        // if the plugin's already been loaded, unload it
        if (plugins[name]) {
            decache(path.join(__dirname, `/plugins/${file}`));
        }

        // (re)load the plugin
        plugins[name] = require(`./plugins/${file}`);

        // if there's an init function, give it a call
        try {
            if (plugins[name].init) {
                plugins[name].init(client);
            }
        } catch (e) {
            log(`Loaded plugin but could not run init: ${e}`)
        }

        // if we have a callback, it's time to go back to it
        if (cb) {
            cb(null);
        }
    } catch (e) {
        // an error occured
        if (cb) {
            cb(e);
        }
    }
}

client.login(token).then(() => {
    // load all plugins
    log('Loading plugins...');
    fs.readdirSync(path.join(__dirname, '/plugins/')).forEach((file) => {
        // load script if it's a js file
        if (file.match(/\.js$/) !== null) {
            loadPlugin(file, (e) => {
                if (e) {
                    log(`Could not load ${file}: ${e}`);
                } else {
                    // enable file watcher...if wanted
                    log(`Loaded ${file}`);
                    if (process.env.ENABLE_WATCHERS) {
                        onFileChange(`./plugins/${file}`, () => {
                            loadPlugin(file, (e) => {
                                if (e) {
                                    log(`Could not reload ${file}: ${e}`);
                                } else {
                                    log(`Reloaded ${file}`);
                                }
                            })
                        })
                    }
                }
            })
        }
    });
    log('Finished loading plugins.');   
    log(`I am ready to do stuff!`);
});

let express = require('express');
let http = require('http');
let app = express();
let server = http.Server(app);

app.get('/', (request, response, next) => {
    response.send('Nothing here!');
});

let port = process.env.PORT || 3000;
server.listen(port);
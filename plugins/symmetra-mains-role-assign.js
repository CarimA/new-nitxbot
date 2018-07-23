'use strict';

var id_server =                 '235214509256474625';

var id_room_role =              '468534443460788224';

var id_role_europe =            '320292004980588545';
var id_role_americas =          '320292200858779648';
var id_role_asia =              '320292318299029504';
var id_role_pc =                '468537222795100162';
var id_role_ps4 =               '468537259449253888';
var id_role_xbo =               '468537291875418143';

var id_role_assign_message =    '';

var emoji_eu_flag =             '🇪🇺';
var emoji_us_flag =             '🇺🇸';
var emoji_kr_flag =             '🇰🇷';
var emoji_pc =                  '🖥';
var emoji_ps =                  '🇵';
var emoji_xb =                  '🇽';
var intro_message =             `Hello! Welcome to Symmetra Mains. Here, we have a few extra roles used to differentiate roles for Overwatch's server regions and platforms, which may be used to find users for games or matchmaking purposes. In order to assign a role to yourself, you need to react to this message.\r\n\r\nReact with {emoji_eu_flag} to be assigned the Europe region role.\r\nReact with {emoji_us_flag} to be assigned the Americas region role.\r\nReact with {emoji_kr_flag} to be assigned the Asia region role.\r\n\r\nReact with {emoji_pc} to be assigned the PC platform role.\r\nReact with {emoji_ps} to be assigned the PlayStation 4 platform role.\r\nReact with {emoji_xb} to be assigned the Xbox One platform role.\r\n\r\nWhile members can have any of these roles assign, please only assign roles that are actually applicable to you.\r\nIf you want a role unassigned, simply unreact (You may need to react and unreact!).`;


module.exports = {
    init: (client) => {
        // clear out role assign channel
        client.channels.get(id_room_role).bulkDelete(100).then(() => {
            // send a message with introduction
            client.channels.get(id_room_role).send(intro_message)
                .then((msg) => {
                    id_role_assign_message = msg.id;
                })
                // react with emoji in order to stop people from locking themselves out
                .then((msg) => {
                    msg.react(emoji_eu_flag);
                })
                .then((msg) => {
                    msg.react(emoji_us_flag);
                })
                .then((msg) => {
                    msg.react(emoji_kr_flag);
                })
                .then((msg) => {
                    msg.react(emoji_pc);
                })
                .then((msg) => {
                    msg.react(emoji_ps);
                })
                .then((msg) => {
                    msg.react(emoji_xb);
                });
        });

        // reacts
        client.on('messageReactionAdd', (reaction, user) => {
            let message_id = reaction.message.id;

            // ok, we have a match. get the emoji and assign a role.
            if (message_id === id_role_assign_message) {
                // get the emoji and user and set
                let emoji = reaction.emoji.name;
                console.log(emoji);
                let u = client.guilds.get(id_server).members.get(user.id);
                switch (emoji) {
                    case emoji_eu_flag: 
                        u.addRole(id_role_europe);
                        break;
                    case emoji_us_flag:
                        u.addRole(id_role_americas);
                        break;
                    case emoji_kr_flag:
                        u.addRole(id_role_asia);
                        break;
                    case emoji_pc: 
                        u.addRole(id_role_pc);    
                        break;
                    case emoji_ps:
                        u.addRole(id_role_ps4);    
                        break;
                    case emoji_xb:
                        u.addRole(id_role_xbo);    
                        break;
                }
            }
        });

        client.on('messageReactionRemove', (reaction, user) => {
            let message_id = reaction.message.id;

            // ok, we have a match. get the emoji and remove a role.
            if (message_id === id_role_assign_message) {
                // get the emoji and user and set
                let emoji = reaction.emoji.name;
                let u = client.guilds.get(id_server).members.get(user.id);
                switch (emoji) {
                    case emoji_eu_flag: 
                        u.removeRole(id_role_europe);
                        break;
                    case emoji_us_flag:
                        u.removeRole(id_role_americas);
                        break;
                    case emoji_kr_flag:
                        u.removeRole(id_role_asia);
                        break;
                    case emoji_pc: 
                        u.removeRole(id_role_pc);    
                        break;
                    case emoji_ps:
                        u.removeRole(id_role_ps4);    
                        break;
                    case emoji_xb:
                        u.removeRole(id_role_xbo);    
                        break;
                }
            }
        });
    }
}
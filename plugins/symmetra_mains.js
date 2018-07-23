'use strict';

var id_server =         '235214509256474625';

var id_room_streams =   '443447416960581632';

module.exports = {
    init: (client) => {
        // clear out streams channel
        client.channels.get(id_room_streams).bulkDelete(100);

        client.on('presenceUpdate', (oldMember, newMember) => {
            // check that it's sym mains server
            if (newMember.guild.id != id_server) { 
                return;
            } 
            
            // first check for members that are now streaming
            // check that they're streaming
            if (oldMember.presence.game) {
                //log('old');
                //log(oldMember.presence.game);
            }
            if (newMember.presence.game) {
                //log('new');
                //log(newMember.presence.game);
            }


            // now check for members that were streaming but have stopped


            //console.log(oldMember);
            //console.log(newMember);
            //global.log(newMember);
        });
    },

    on_chat: (user, channel, msg, reply) => {
        //if (msg.content === 'tf') {
        //    reply('oof');
        //}
    },

    commands: [
        {
            aliases: [ 'test', 'test2', 'test3' ],
            description: `Here's a short description about the command`,
            do: (user, channel, params, reply) => {
                reply('Hello');
            }
        }
    ]
}
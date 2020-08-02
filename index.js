const Discord = require('discord.js');
const discordConfig = require('./config.json');
const mssql = require('mssql');
const client = new Discord.Client();

const config = discordConfig.db_config;

async function fetchMore(lastMessageID, channel) {
    return new Promise((resolve, reject) => {
        channel.messages.fetch({ before: lastMessageID, limit: 100 }).then(messages => {
            if (messages.size === 0) {
                reject();
            }

            let ids = [];
            messages.forEach(msg => {
                ids.push(msg.id);
            });

            resolve({
                'messages': messages,
                'lastMessageID': ids[messages.size - 1] 
            });
        })
    });
}

function processMessages(messages) {
    messages.forEach(message => {
            
        let totalReactions = 0;
        let reactions = []
        message.reactions.cache.forEach(reaction => {
            totalReactions += reaction.count;
        });

        if (totalReactions > 0) {
            
            mssql.connect(config).then(pool => {
                
                return pool.request()
                    .input('MessageContent', mssql.NVarChar(4096), message.content)
                    .input('ReactionsCount', mssql.Int, totalReactions)
                    .execute('dbo.SaveMessage');

            }).then(res => { });
        
        }
    });
}

async function fetchAll(channel) {
    let lastMessageID = null;
    
    for (var i = 0; i < 1000000; i++) {
        try {
            let res = await fetchMore(lastMessageID, channel);
            lastMessageID = res.lastMessageID;
            processMessages(res.messages);
        } catch (err) {
            console.log(err);
            break;
        }
    }

}

class FetchMessages {
    
    constructor() {
    }

    async fetchAll (channel) {
        let lastMessageID = null;
        for (var i = 0; i < 1000000; i++) {
            try {
                let res = await fetchMore(lastMessageID, channel);
                lastMessageID = res.lastMessageID;
                processMessages(res.messages);
            } catch (err) {
                break;
            }
        }
    
    }

}

function paramsExist(params) {
    if (params !== undefined && params.startsWith('-')) {
        return true;
    }
    return false;
}

function parse(message) {

    let msg = message.content;

    let params = msg.split(' ');
    let command = params[0];
    let parameters = null;
    
    if (paramsExist(params[1])) {
        parameters = params[1].substring(1, params[1].size).split("");
    }

    if (command === '$ft') {
        let fetchMessages = new FetchMessages();
        // console.log(message);

        console.log(message.author.username + '#' + message.author.discriminator);
        console.log(new Date(message.createdTimestamp).toLocaleString());

        let totalReactions = 0;
        let reactions = []
        console.log(message.reactions)
        message.channel.send('hello', {
            system: true
        });
    }
    else if (command === '$rq') {
        // 
    }
}

client.on('message', msg => {
    parse(msg);
});

client.login(discordConfig.token);
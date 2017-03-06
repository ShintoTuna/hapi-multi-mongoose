'use strict';

const EventEmitter = require('events').EventEmitter;

class MongooseConnector extends EventEmitter {

    constructor(options, server, mongoose) {

        super();

        const mongooseOptions = {
            server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
            replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
        };

        this.connection = mongoose.createConnection(options.uri, mongooseOptions);

        this.connection.on('connected', () => {

            server.log(['info', 'database', 'mongoose'], 'Connected');
            this.emit('ready', this.connection);
        })
            .on('error', (err) => {

                server.log(['error', 'database', 'mongoose'], `Unable to connect to database: ${err.message}`);
                this.emit('error', err);
            })
            .on('close', () => {

                server.log(['info', 'database', 'mongoose'], 'Connection to database closed');
            })
            .on('disconnected', () => {

                server.log(['warn', 'database', 'mongoose'], 'Connection to database disconnected');
                this.emit('disconnected');
            });
    }
}

module.exports = MongooseConnector;

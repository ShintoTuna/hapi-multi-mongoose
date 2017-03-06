'use strict';

const Hoek = require('hoek');
const Mongoose = require('mongoose');
const MongooseConnector = require('./MongooseConnector');

const internals = {};

internals.defaults = {
    uri: 'mongodb://126.0.0.1:27017',
    name: 'default'
};

exports.register = (server, options, next) => {

    Mongoose.Promise = global.Promise;

    const connectors = options.dbs.map((opt) => {

        return new Promise((resolve, reject) => {

            const settings = Hoek.applyToDefaults(internals.defaults, opt);

            const connector = new MongooseConnector(settings, server, Mongoose);

            connector.on('ready', (connection) => resolve({ [settings.name]: connection }));

            connector.on('error', (err) => reject(err));
        });
    });

    Promise.all(connectors).then((connections) => {

        server.expose('mongoose', Mongoose);
        server.expose('connections', Object.assign(...connections));

        next();
    }).catch(console.error);
};

exports.register.attributes = { pkg: require('../package.json') };

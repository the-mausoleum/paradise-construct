'use strict';

var http = require('http');

var Parser = require('../node_modules/paradise-script/lib/parser');

var Paradise = function (vesselId) {
    var baseUrl = 'http://paradise.xxiivv.com:3000';
    var actionUrl = baseUrl + '/router.php?route=actions&phrase=';

    var parser = new Parser();

    var PROPERTIES = [
        'note',
        'program',
        'usage',
        'feedback',
        'paint'
    ];

    this.say = say;
    this.create = create;
    this.update = update;
    this.enter = enter;
    this.leave = leave;
    this.construct = construct;

    function say(message, callback) {
        var url = actionUrl + 'say-' + message + '&vessel=' + vesselId;

        http.get(url, function (res) {
            res.setEncoding('utf8');

            res.on('data', function (chunk) {
                var data = JSON.parse(chunk);

                if (typeof callback === 'function') {
                    callback(data);
                }
            });
        });
    }

    function create(vessel, callback) {
        var url = actionUrl + 'create-' + slugify(vessel.name) + '&vessel=' + vesselId;

        http.get(url, function (res) {
            res.setEncoding('utf8');

            res.on('data', function (chunk) {
                var data = JSON.parse(chunk);

                enter(vessel, function (data) {
                    if (hasAdditionalProperties(vessel)) {
                        instantiate(vessel, callback);
                    }
                });
            });
        });
    }

    function instantiate(vessel, callback) {
        var keys = Object.keys(vessel);
        keys.splice(keys.indexOf('name'), 1);

        if (keys.length > 0) {
            setProperty(vessel, keys[0], callback);
        } else {
            leave(vessel, callback);
        }
    }

    function setProperty(vessel, key, callback) {
        if (PROPERTIES.indexOf(key) === -1) {
            return;
        }

        var url = actionUrl + key + '-' + vessel[key] + '&vessel=' + vesselId;

        delete vessel[key];

        http.get(url, function (res) {
            res.setEncoding('utf8');

            res.on('data', function (chunk) {
                var data = JSON.parse(chunk);

                instantiate(vessel, callback);
            });
        });
    }

    function update(vessel, callback) {

    }

    function enter(vessel, callback) {
        var url = actionUrl + 'enter-' + slugify(vessel.name) + '&vessel=' + vesselId;

        http.get(url, function (res) {
            res.setEncoding('utf8');

            res.on('data', function (chunk) {
                var data = JSON.parse(chunk);

                if (typeof callback === 'function') {
                    callback(data);
                }
            });
        });
    }

    function leave(vessel, callback) {
       var url = actionUrl + 'leave&vessel=' + vesselId;

       http.get(url, function (res) {
            res.setEncoding('utf8');

            res.on('data', function (chunk) {
                var data = JSON.parse(chunk);

                if (typeof callback === 'function') {
                    callback(data);
                }
            });
        });
    }

    function slugify(name) {
        return name.replace(/\s/gi, '-').replace(/[^a-z]/gi, '');
    }

    function hasAdditionalProperties(vessel) {
        for (var i in PROPERTIES) {
            if (PROPERTIES[i] !== 'name' && vessel.hasOwnProperty(PROPERTIES[i])) {
                return true;
            }
        }

        return false;
    }

    function construct(script) {
        var lines = script.split(/\r?\n/);

        var output = '';

        for (var i in lines) {
            output += parser.parse(lines[i]);
        }

        parser.reset();

        var blueprint = eval(output);

        // Remove children until program can handle
        delete blueprint['children'];

        create(blueprint, function (data) {
            console.log(data);
        });
    }
};

module.exports = Paradise;

'use strict';

var http = require('http');

var Paradise = function (vesselId) {
    var baseUrl = 'http://paradise.xxiivv.com:3000';
    var actionUrl = baseUrl + '/router.php?route=actions&phrase=';

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
};

var VESSEL_ID = '';

var paradise = new Paradise(VESSEL_ID);

paradise.create({
    name: 'hotel',
    note: 'A grand hotel.',
    program: 'enter hotel',
    usage: 'check into',
    paint: '90 90 90',
    feedback: 'You have booked at room at the hotel.'
});

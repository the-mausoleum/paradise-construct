'use strict';

var fs = require('fs');
var path = require('path');
var argv = require('optimist').usage('Usage: paradise-construct <file>').argv;

var Paradise = require('./paradise');

if (argv._[0]) {
    var vesselId = argv.a || argv.auth || '';

    var paradise = new Paradise(vesselId);

    var file = fs.readFile(path.resolve(process.cwd(), argv._[0]), {
        encoding: 'utf-8'
    }, function (err, script) {
        paradise.construct(script);
    });
}

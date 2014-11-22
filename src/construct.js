'use strict';


var multiline = require('multiline');
var url = require('url');

var styles = multiline(function () {/*
    <style>
        .paradise-construct {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
        }
    </style>
*/});

var html = multiline(function () {/*
    <div class="paradise-construct">
        
    </div>
*/});

var Paradise = function (address, vessel) {
    this.url = url.resolve(address, vessel || '');

    this.execute = function (command) {
        $('#dial').val(command);

        $('#action').trigger('submit');
    };
};

(function () {
    $('head').append(styles);
    $('body').append(html);

    var paradise = new Paradise('http://paradise.xxiivv.com:3000/', 'VESSEL_ID');
})();

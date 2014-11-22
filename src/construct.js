'use strict';

var multiline = require('multiline');
var url = require('url');
var codemirror = require('codemirror');
var Parser = require('../node_modules/paradise-script/lib/parser');

var styles = multiline(function () {/*
    <style>
        .paradise-construct {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
        }
        
        .CodeMirror{font-family:monospace;height:300px}.CodeMirror-scroll{overflow:auto}.CodeMirror-lines{padding:4px 0}.CodeMirror pre{padding:0 4px}.CodeMirror-gutter-filler,.CodeMirror-scrollbar-filler{background-color:#fff}.CodeMirror-gutters{border-right:1px solid #ddd;background-color:#f7f7f7;white-space:nowrap}.CodeMirror-linenumber{padding:0 3px 0 5px;min-width:20px;text-align:right;color:#999;-moz-box-sizing:content-box;box-sizing:content-box}.CodeMirror-guttermarker{color:#000}.CodeMirror-guttermarker-subtle{color:#999}.CodeMirror div.CodeMirror-cursor{border-left:1px solid #000}.CodeMirror div.CodeMirror-secondarycursor{border-left:1px solid silver}.CodeMirror.cm-keymap-fat-cursor div.CodeMirror-cursor{width:auto;border:0;background:#7e7}.CodeMirror.cm-keymap-fat-cursor div.CodeMirror-cursors{z-index:1}.cm-animate-fat-cursor{width:auto;border:0;-webkit-animation:blink 1.06s steps(1) infinite;-moz-animation:blink 1.06s steps(1) infinite;animation:blink 1.06s steps(1) infinite}@-moz-keyframes blink{0%{background:#7e7}50%{background:0 0}100%{background:#7e7}}@-webkit-keyframes blink{0%{background:#7e7}50%{background:0 0}100%{background:#7e7}}@keyframes blink{0%{background:#7e7}50%{background:0 0}100%{background:#7e7}}.cm-tab{display:inline-block;text-decoration:inherit}.CodeMirror-ruler{border-left:1px solid #ccc;position:absolute}.cm-s-default .cm-keyword{color:#708}.cm-s-default .cm-atom{color:#219}.cm-s-default .cm-number{color:#164}.cm-s-default .cm-def{color:#00f}.cm-s-default .cm-variable-2{color:#05a}.cm-s-default .cm-variable-3{color:#085}.cm-s-default .cm-comment{color:#a50}.cm-s-default .cm-string{color:#a11}.cm-s-default .cm-string-2{color:#f50}.cm-s-default .cm-meta,.cm-s-default .cm-qualifier{color:#555}.cm-s-default .cm-builtin{color:#30a}.cm-s-default .cm-bracket{color:#997}.cm-s-default .cm-tag{color:#170}.cm-s-default .cm-attribute{color:#00c}.cm-s-default .cm-header{color:#00f}.cm-s-default .cm-quote{color:#090}.cm-s-default .cm-hr{color:#999}.cm-s-default .cm-link{color:#00c}.cm-negative{color:#d44}.cm-positive{color:#292}.cm-header,.cm-strong{font-weight:700}.cm-em{font-style:italic}.cm-link{text-decoration:underline}.cm-invalidchar,.cm-s-default .cm-error{color:red}div.CodeMirror span.CodeMirror-matchingbracket{color:#0f0}div.CodeMirror span.CodeMirror-nonmatchingbracket{color:#f22}.CodeMirror-matchingtag{background:rgba(255,150,0,.3)}.CodeMirror-activeline-background{background:#e8f2ff}.CodeMirror{line-height:1;position:relative;overflow:hidden;background:#fff;color:#000}.CodeMirror-scroll{margin-bottom:-30px;margin-right:-30px;padding-bottom:30px;height:100%;outline:0;position:relative;-moz-box-sizing:content-box;box-sizing:content-box}.CodeMirror-sizer{position:relative;border-right:30px solid transparent;-moz-box-sizing:content-box;box-sizing:content-box}.CodeMirror-gutter-filler,.CodeMirror-hscrollbar,.CodeMirror-scrollbar-filler,.CodeMirror-vscrollbar{position:absolute;z-index:6;display:none}.CodeMirror-vscrollbar{right:0;top:0;overflow-x:hidden;overflow-y:scroll}.CodeMirror-hscrollbar{bottom:0;left:0;overflow-y:hidden;overflow-x:scroll}.CodeMirror-scrollbar-filler{right:0;bottom:0}.CodeMirror-gutter-filler{left:0;bottom:0}.CodeMirror-gutters{position:absolute;left:0;top:0;padding-bottom:30px;z-index:3}.CodeMirror-gutter{white-space:normal;height:100%;-moz-box-sizing:content-box;box-sizing:content-box;padding-bottom:30px;margin-bottom:-32px;display:inline-block}.CodeMirror-gutter-elt{position:absolute;cursor:default;z-index:4}.CodeMirror-lines{cursor:text;min-height:1px}.CodeMirror pre{-moz-border-radius:0;-webkit-border-radius:0;border-radius:0;border-width:0;background:0 0;font-family:inherit;font-size:inherit;margin:0;white-space:pre;word-wrap:normal;line-height:inherit;color:inherit;z-index:2;position:relative;overflow:visible}.CodeMirror-wrap pre{word-wrap:break-word;white-space:pre-wrap;word-break:normal}.CodeMirror-linebackground{position:absolute;left:0;right:0;top:0;bottom:0;z-index:0}.CodeMirror-linewidget{position:relative;z-index:2;overflow:auto}.CodeMirror-wrap .CodeMirror-scroll{overflow-x:hidden}.CodeMirror-measure{position:absolute;width:100%;height:0;overflow:hidden;visibility:hidden}.CodeMirror-measure pre{position:static}.CodeMirror div.CodeMirror-cursor{position:absolute;border-right:none;width:0}div.CodeMirror-cursors{visibility:hidden;position:relative;z-index:3}.CodeMirror-focused div.CodeMirror-cursors{visibility:visible}.CodeMirror-selected{background:#d9d9d9}.CodeMirror-focused .CodeMirror-selected{background:#d7d4f0}.CodeMirror-crosshair{cursor:crosshair}.cm-searching{background:#ffa;background:rgba(255,255,0,.4)}.cm-force-border{padding-right:.1px}@media print{.CodeMirror div.CodeMirror-cursors{visibility:hidden}}span.CodeMirror-selectedtext{background:0 0}
    </style>
*/});

var html = multiline(function () {/*
    <div class="paradise-construct">
        <textarea id="script-editor"></textarea>
        <button id="run">Run</button>
    </div>
*/});

var Paradise = function (address, vessel) {
    this.url = url.resolve(address, vessel || '');

    this.execute = function (command) {
        $('#dial').val(command);

        $('#action').trigger('submit');
    };

    this.create = function (vessel, callback) {
        this.execute('create ' + vessel.name);
        console.log(vessel.name + ' created');
        this.execute('enter ' + vessel.name);
        console.log(vessel.name + ' entered');

        if (typeof vessel.note !== 'undefined') {
            this.execute('note ' + vessel.note);
            console.log(vessel.name + ' note set');
        }

        if (typeof vessel.program !== 'undefined') {
            this.execute('program ' + vessel.program);
            console.log(vessel.name + ' programmed');
        }

        if (typeof vessel.usage !== 'undefined') {
            this.execute('usage ' + vessel.usage);
            console.log(vessel.name + ' usage defined');
        }

        // this.execute('leave');
    };
};

var ParadiseConstruct = function (paradise) {
    this.paradise = paradise;

    this.fromBlueprint = function (blueprint) {
        console.log(blueprint)

        paradise.create({
            name: blueprint.name,
            note: blueprint.note,
            program: blueprint.program,
            usage: blueprint.usage
        });

        for (var i in blueprint.children) {
            this.fromBlueprint(blueprint.children[i]);
        }
    };
};

(function () {
    var VESSEL_ID = '';

    $('head').append(styles);
    $('body').append(html);

    var parser = new Parser();

    var editor = codemirror.fromTextArea(document.getElementById('script-editor'), {
        lineNumbers: true,
        mode: 'htmlmixed'
    });

    var construct = new ParadiseConstruct(new Paradise('http://paradise.xxiivv.com:3000/', VESSEL_ID));

    $('#run').on('click', function (e) {
        var script = editor.getValue();

        var lines = script.split(/\r?\n/);

        var output = '';

        for (var i in lines) {
            output += parser.parse(lines[i]);
        }

        parser.reset();

        var blueprints = eval(output);

        construct.fromBlueprint(blueprints);
    });
})();

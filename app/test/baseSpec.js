'use strict';

(function addCanvasToBody() {
    $('<div><canvas id="canvas" width="720px" height="405px"></canvas><div id="toolbarOptions" class="hide toolbarOptions"></div><div id="plugin-toolbar-container"><div class="ui shape" id="pluginToolbarShape"><div class="sides"><div class="side active pluginConfig" id="pluginConfig"></div><div class="side pluginProperties" id="pluginProperties"></div><div class="side pluginHelpContent" id="pluginHelpContent"></div></div></div></div><div id="pluginHelp"></div></div><i id="color"></i><div class="ui dropdown"><div>').appendTo('body');
})();

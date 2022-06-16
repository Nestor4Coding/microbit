var makecodeUrl = "https://makecode.microbit.org/";
var blocksClass = "blocks";

var injectRenderer = function () {
    var f = $("<iframe>", {
        id: "makecoderenderer",
        src: makecodeUrl + "--docs?render=1&lang=" + ($('html').attr('lang') || "en")
    });
    f.css("position", "absolute");
    f.css("left", 0);
    f.css("bottom", 0);
    f.css("width", "1px");
    f.css("height", "1px");
    $('body').append(f);
}

function makeCodeRenderPre(pre) {
    var f = document.getElementById("makecoderenderer");
    f.contentWindow.postMessage({
        type: "renderblocks",
        id: pre.id,
        code: pre.innerText
    }, "https://makecode.microbit.org/");
}

var attachBlocksListener = function () {
    var blockId = 0;
    window.addEventListener("message", function (ev) {
        var msg = ev.data;
        if (msg.source != "makecode") return;

        switch (msg.type) {
            case "renderready":
                $("." + blocksClass).each(function () {
                    var snippet = $(this)[0];
                    snippet.id = "pxt-blocks-" + (blockId++);
                    makeCodeRenderPre(snippet);
                });
                break;
            case "renderblocks":
                var svg = msg.svg; // this is a string containing SVG
                var id = msg.id;   // this is the id you sent
                // replace text with svg
                var img = document.createElement("img");
                img.src = msg.uri;
                img.width = msg.width;
                img.height = msg.height;
                var pre = document.getElementById(id)
                pre.parentNode.insertBefore(img, pre)
                pre.parentNode.removeChild(pre);
                break;
        }
    }, false);
}

$(function () {
    injectRenderer();
    attachBlocksListener();
});
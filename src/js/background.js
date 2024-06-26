chrome.browserAction.onClicked.addListener(function (tab) {
    executeScripts(null, [
        { file: "src/js/markdown-image.js" },
        { file: "src/js/convert-to-img-tag.js" }
    ])
});

function executeScripts(tabId, injectDetailsArray) {
    function createCallback(tabId, injectDetails, innerCallback) {
        return function () {
            chrome.tabs.executeScript(tabId, injectDetails, innerCallback);
        };
    }

    let callback = null;

    for (let i = injectDetailsArray.length - 1; i >= 0; --i)
        callback = createCallback(tabId, injectDetailsArray[i], callback);

    if (callback !== null)
        callback();   // Dıştaki fonksiyonu çalıştır
}

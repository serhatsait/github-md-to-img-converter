chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.executeScript({
        file: "convert_image_tag.js"
    });
});
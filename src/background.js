
var DEFAULT_TITLE = 'Nothing detected yet';
var DEFAULT_BADGE_TEXT = '';

function handleMessage(request, sender) {
  var title = DEFAULT_TITLE;
  var badgeText = DEFAULT_BADGE_TEXT;
  if (request.found.length) {
    title = 'Snoopie detected: ' + request.found.join(',');
    badgeText = '!';
    chrome.browserAction.setBadgeBackgroundColor({ color: '#FF0000' });
  }
  chrome.browserAction.setTitle({ title: title });
  chrome.browserAction.setBadgeText({ text: badgeText });
}

chrome.runtime.onMessage.addListener(handleMessage);

function runTest() {
  chrome.tabs.executeScript(null, {file: "content_script.js"});
}

chrome.browserAction.onClicked.addListener(runTest);
chrome.tabs.onActivated.addListener(runTest);

var timeout = null;

chrome.tabs.onUpdated.addListener(function() {
  runTest();

  // Check again in a second to account for a slow load.
  if (timeout === null) {
    timeout = setTimeout(function() {
      timeout = null;
      runTest();
    }, 1000);
  }
});

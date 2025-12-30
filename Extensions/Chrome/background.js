chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      chrome.tabs.create({ url: 'http://localhost:9090' });
    }
  });
});

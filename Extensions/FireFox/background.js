browser.action.onClicked.addListener((tab) => {
  browser.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      window.open('http://localhost:9090'); // Use window.open instead of chrome.tabs.create
    }
  });
});

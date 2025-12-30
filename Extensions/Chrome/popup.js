document.getElementById('loadButton').addEventListener('click', () => {
  chrome.tabs.create({ url: 'http://localhost:9090' });
});

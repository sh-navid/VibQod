document.getElementById('loadButton').addEventListener('click', () => {
  browser.tabs.create({ url: 'http://localhost:9090' });
});

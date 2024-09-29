// chrome.action.onClicked.addListener((tab) => {
//   chrome.sidePanel.setOptions({
//     path: 'panel.html'
//   })
// })
// alert('Hello from background.js')
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error))

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(
    sender.tab
      ? 'from a content script:' + sender.tab.url
      : 'from the extension'
  )
  if (request.greeting === 'hello') sendResponse({ farewell: 'goodbye1' })
})

console.log('hookland background.js loaded')

// chrome.runtime.sendMessage({ greeting: 'hello' })

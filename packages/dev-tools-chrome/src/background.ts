chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error))

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(
    sender.tab
      ? 'from a content script:' + sender.tab.url
      : 'from the extension'
  )

  console.log('Received message:', request)

  if (request.greeting === 'hello') sendResponse({ farewell: 'goodbye1' })
})

console.log('hookland background.ts loaded')

// chrome.runtime.sendMessage({ greeting: 'hello' })

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  console.log('tabId:', tabId)
  console.log('changeInfo:', changeInfo)
  console.log('tab:', tab)
})

chrome.tabs.onActivated.addListener(function (activeInfo) {
  console.log('activeInfo:', activeInfo)
})

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (msg) {
    console.log('Received message from devtools-page:', msg)
  })
})

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

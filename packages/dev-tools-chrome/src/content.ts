chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('xx!!!', request)
  if (request.message) {
    console.log('Received message:', request.message)
    sendResponse({ status: 'Message received!' })
  }
})

console.log('hookland content.js loaded')
;(async () => {
  console.log('Sending message...')
  const response = await chrome.runtime.sendMessage({ greeting: 'hello' })
  // do something with response here, not outside the function
  console.log('Response:', response)
})()

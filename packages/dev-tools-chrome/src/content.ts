import {
  HOOKLAND_HUD_CLIENT,
  HOOKLAND_HUD_EXTENSION
} from '@hookland/dev-tools-commons'

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.source === HOOKLAND_HUD_EXTENSION) {
    console.log('Received from HUD:', request, _sender)
    window.postMessage(request, '*')
  }
  return true
})

console.log('hookland content.js loaded')

window.addEventListener('message', (event) => {
  if (event.data.source === HOOKLAND_HUD_CLIENT) {
    console.log('Content.ts received message from client:', event.data)
    chrome.runtime.sendMessage(event.data)
  }
})

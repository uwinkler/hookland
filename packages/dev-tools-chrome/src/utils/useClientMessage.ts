import { MessageClientSchema } from "@hookland/dev-tools-commons"

import { z } from "zod"


export function useClientMessage() {
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(
      sender.tab
        ? 'from a content script:' + sender.tab.url
        : 'from the extension'
    )
    try {
      const res = MessageClientSchema(z.unknown(), z.unknown()).safeParse(request)
      if (res.err) {
        console.log('Received message:', res.error)
      }
      sendResponse({ status: 'Message received!' })
    }
  })
}s
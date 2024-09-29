import { Wrapper } from './components/Wrapper'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { Button } from '@mui/material'

function App() {
  return (
    <div className="container w-[25rem] p-1 bg-zinc-800">
      <Wrapper>
        <Button
          onClick={async () => {
            const [tab] = await chrome.tabs.query({
              active: true,
              lastFocusedWindow: true
            })

            console.log(tab)

            const response = await chrome.tabs.sendMessage(tab.id ?? -1, {
              greeting: 'hello'
            })

            console.log(response)
          }}
        >
          Hi
        </Button>
      </Wrapper>
    </div>
  )
}

export default App

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'


function App() {
  return (
    <button
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
    >Hi</button>
  )
}

export default App

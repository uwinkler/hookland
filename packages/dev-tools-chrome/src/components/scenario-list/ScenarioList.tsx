import { Box } from '@mui/joy'
import { useScenariosState } from './useScenarios'

function useMessageFromClient() {
  const [scenarios, setScenarios] = useScenariosState()
}

export function ScenarioList() {
  const [scenarios] = useScenariosState()

  return (
    <Box>
      <code>
        <pre>{JSON.stringify(scenarios)}</pre>
      </code>
    </Box>
  )
}

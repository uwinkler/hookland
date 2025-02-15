import { useEffect, useState } from "react"

export type Scenario<T> = {
  id: string
  groupId?: string
  description?: string
  mount: React.ComponentType<T>
}

type ScenarioProps<T> = {
  scenarios: Scenario<T>[]
}

export function Scenario(props: ScenarioProps) {

}


const EVENT_NAME = 'hookland-inject-scenario-change'

function useScenarioWindowEventListener() {
  const [param, setParam] = useState<Scenario<unknown>[]>([]);

  const handleEvent = useCallback((event: CustomEvent) => {
    setParam(event.detail)
  }, [])

  useEffect(() => {
    window.addEventListener('popstate', handleEvent);
    return () => window.removeEventListener(EVENT_NAME, handleEvent);
  }, [handleEvent]);

  return param
}

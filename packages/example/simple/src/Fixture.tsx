import React, { useEffect, useState } from 'react'

export type Fixture = {
  id: string
  title?: string
  description: string
  component: React.ComponentType | string // component or path to component
}

declare global {
  interface Window {
    __FIXTURES__?: {
      fixtures: Fixture[]
    }
  }
}

export function Fixtures(props: { fixtures?: Fixture[] }) {
  const fixtures = React.useMemo(() => {
    if (!props.fixtures && window.__FIXTURES__) {
      return window.__FIXTURES__.fixtures
    }
    return props.fixtures || []
  }, [props.fixtures])

  const activeFixtureId = useGetQueryParams('fixture') || ''

  const Comp = React.useMemo(() => {
    const activeFixture = fixtures.find(
      (fixture) => fixture.id === activeFixtureId
    )

    if (!activeFixture) {
      return null
    }

    if (typeof activeFixture.component === 'string') {
      return React.lazy(() => import('' + activeFixture.component))
    }

    return activeFixture ? activeFixture.component : null
  }, [activeFixtureId, fixtures])


  console.log(fixtures)
  if (activeFixtureId === '') {
    return (
      <ul>
        <li>
          {fixtures.map((fixture) => (
            <a key={fixture.id} href={`?fixture=${fixture.id}`}>
              {fixture.title || fixture.id}
            </a>
          ))}
        </li>
      </ul>
    )
  }

  return Comp ? (
    <React.Suspense>
      <Comp />
    </React.Suspense>
  ) : (
    <h1>Fixture not found:{activeFixtureId}</h1>
  )
}

function useGetQueryParams(paramKey: string) {
  const params = useSearchParams()
  return params.get(paramKey)
}

function useSearchParams() {
  const [search, setSearch] = useState(
    new URLSearchParams(window.location.search)
  )

  useEffect(() => {
    // Function to handle URL changes
    const handleUrlChange = () => {
      setSearch(new URLSearchParams(window.location.search))
    }

    // Listen for 'popstate' events (browser back/forward navigation)
    window.addEventListener('popstate', handleUrlChange)

    // Cleanup on unmount
    return () => {
      window.removeEventListener('popstate', handleUrlChange)
    }
  }, [])

  return search
}


export default Fixtures
/**
 * Provider — Isolated State
 *
 * Wrap components in a Provider to isolate state from the global default.
 * Each Provider creates an independent state scope. Components inside
 * different Providers don't share state, even when using the same hook.
 */
import { createTinyState } from "@hookland/tiny-state";

const [useCounter, CounterProvider] = createTinyState(0);

function Counter({ label }: { label: string }) {
  const [count, setCount] = useCounter();
  return (
    <div>
      <h3>{label}: {count}</h3>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}

/**
 * CounterA starts at 100, CounterB starts at 200.
 * Clicking +1 on one does NOT affect the other.
 */
export default function App() {
  return (
    <div>
      <CounterProvider initalValue={100}>
        <Counter label="Counter A" />
      </CounterProvider>

      <CounterProvider initalValue={200}>
        <Counter label="Counter B" />
      </CounterProvider>
    </div>
  );
}

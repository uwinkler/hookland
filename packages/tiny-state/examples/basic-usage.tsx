/**
 * Basic Usage
 *
 * Create a shared state atom and use it across multiple components.
 * All components using the same hook share the same state automatically.
 */
import { createTinyState } from "@hookland/tiny-state";

// Create a shared counter state with initial value 0
const [useCounter] = createTinyState(0);

function Counter() {
  const [count, setCount] = useCounter();

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// This component reads the same state — no prop drilling needed
function CounterDisplay() {
  const [count] = useCounter();
  return <p>The current count is: {count}</p>;
}

export default function App() {
  return (
    <div>
      <Counter />
      <CounterDisplay />
    </div>
  );
}

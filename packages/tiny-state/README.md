# Tiny State

_Tiny State_ is a simple, convenient, atom-like, and very tiny and very fast global state management library for React.

## Installation

```bash
npm install @hookland/tiny-state
```

## Basic Usage

Create a shared state atom and use it across multiple components. All components using the same hook share the same state automatically — no prop drilling needed.

```tsx
import { createTinyState } from "@hookland/tiny-state";

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
```

## Provider — Isolated State

Wrap components in a Provider to isolate state from the global default. Each Provider creates an independent state scope. Components inside different Providers don't share state, even when using the same hook.

```tsx
import { createTinyState } from "@hookland/tiny-state";

const [useCounter, CounterProvider] = createTinyState(0);

function Counter({ label }: { label: string }) {
  const [count, setCount] = useCounter();
  return (
    <div>
      <h3>
        {label}: {count}
      </h3>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}

// CounterA starts at 100, CounterB starts at 200.
// Clicking +1 on one does NOT affect the other.
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
```

## External Updates

Use `getState` and `setState` returned from `createTinyState` to read/write state from outside the React component tree — e.g. from WebSocket callbacks, timers, or other non-React code.

```tsx
import { createTinyState } from "@hookland/tiny-state";
import { useEffect } from "react";

const [useMessages, , getMessages, setMessages] = createTinyState<string[]>([]);

// External code — no React needed
function startWebSocket() {
  let i = 0;
  const interval = setInterval(() => {
    const current = getMessages();
    setMessages([...current, `Message #${++i}`]);
    if (i >= 5) clearInterval(interval);
  }, 1000);
}

function MessageList() {
  const [messages] = useMessages();
  return (
    <ul>
      {messages.map((msg, i) => (
        <li key={i}>{msg}</li>
      ))}
    </ul>
  );
}

export default function App() {
  useEffect(() => {
    startWebSocket();
  }, []);
  return (
    <div>
      <h2>Live Messages</h2>
      <MessageList />
    </div>
  );
}
```

## Selectors and Custom Hooks

Combine `createTinyState` with standard React primitives (`useMemo`, `useCallback`) to build derived values (selectors) and reusable action hooks.

```tsx
import { createTinyState } from "@hookland/tiny-state";
import { useCallback, useMemo } from "react";

const [useCount] = createTinyState(0);
const [useTodos] = createTinyState([
  { id: 1, text: "Learn tiny-state", done: true },
  { id: 2, text: "Build an app", done: false },
]);

// Custom hook with actions
function useCounterActions() {
  const [count, setCount] = useCount();

  const increment = useCallback(() => setCount(count + 1), [count, setCount]);
  const decrement = useCallback(() => setCount(count - 1), [count, setCount]);
  const reset = useCallback(() => setCount(0), [setCount]);

  return { count, increment, decrement, reset };
}

// Selector using useMemo
function useTodoStats() {
  const [todos] = useTodos();
  const doneCount = useMemo(() => todos.filter((t) => t.done).length, [todos]);
  const progress = useMemo(
    () =>
      todos.length === 0 ? 0 : Math.round((doneCount / todos.length) * 100),
    [todos, doneCount],
  );
  return { total: todos.length, doneCount, progress };
}

// Filtered selector
function useFilteredTodos(showDone: boolean) {
  const [todos] = useTodos();
  return useMemo(
    () => todos.filter((t) => t.done === showDone),
    [todos, showDone],
  );
}
```

## Benchmarks

Run the performance benchmarks (tiny-state vs zustand vs jotai):

```bash
npx vitest bench
```

### Results

| Benchmark                | tiny-state       | zustand     | jotai       |
| ------------------------ | ---------------- | ----------- | ----------- |
| create + read state      | **10,800 ops/s** | 8,042 ops/s | 9,596 ops/s |
| 100 sequential updates   | **9,432 ops/s**  | 8,976 ops/s | 48 ops/s    |
| fan-out: 100 subscribers | **94 ops/s**     | 35 ops/s    | 49 ops/s    |

In our benchmarks, tiny-state performed well across all three categories:

- **Create + read**: All three libraries are fast for basic store creation. Tiny-state is ~34% faster than zustand due to fewer internal abstractions.
- **Sequential updates**: Tiny-state and zustand perform similarly for rapid-fire state changes. Jotai falls behind dramatically here (194x slower) because each atom write triggers its own dependency resolution cycle.
- **Fan-out (100 subscribers)**: This is where tiny-state really shines — 2.7x faster than zustand and 1.9x faster than jotai. Its lightweight `Set`-based listener notification scales better than the subscription management in zustand and jotai when many components consume the same state.

### Summary

| Benchmark                | vs zustand   | vs jotai       |
| ------------------------ | ------------ | -------------- |
| create + read state      | 1.34x faster | 1.13x faster   |
| 100 sequential updates   | 1.05x faster | 194.52x faster |
| fan-out: 100 subscribers | 2.66x faster | 1.89x faster   |

## LICENSE

MIT

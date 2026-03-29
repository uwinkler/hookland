/**
 * Selectors and Custom Hooks
 *
 * Combine createTinyState with standard React primitives (useMemo, useCallback)
 * to build derived values (selectors) and reusable state action hooks.
 */
import { createTinyState } from "@hookland/tiny-state";
import { useCallback, useMemo } from "react";

// --- State atoms ---
const [useCount] = createTinyState(0);
const [useTodos] = createTinyState<{ id: number; text: string; done: boolean }[]>([
  { id: 1, text: "Learn tiny-state", done: true },
  { id: 2, text: "Build an app", done: false },
  { id: 3, text: "Ship it", done: false },
]);

// --- Custom hooks with actions (increment, decrement, reset) ---

function useCounterActions() {
  const [count, setCount] = useCount();

  const increment = useCallback(() => setCount(count + 1), [count, setCount]);
  const decrement = useCallback(() => setCount(count - 1), [count, setCount]);
  const reset = useCallback(() => setCount(0), [setCount]);

  return { count, increment, decrement, reset };
}

// --- Selectors using useMemo ---

function useTodoStats() {
  const [todos] = useTodos();

  const total = todos.length;
  const doneCount = useMemo(() => todos.filter((t) => t.done).length, [todos]);
  const openCount = useMemo(() => todos.filter((t) => !t.done).length, [todos]);
  const progress = useMemo(
    () => (total === 0 ? 0 : Math.round((doneCount / total) * 100)),
    [total, doneCount],
  );

  return { total, doneCount, openCount, progress };
}

function useFilteredTodos(showDone: boolean) {
  const [todos] = useTodos();
  return useMemo(() => todos.filter((t) => t.done === showDone), [todos, showDone]);
}

// --- Components ---

function Counter() {
  const { count, increment, decrement, reset } = useCounterActions();
  return (
    <div>
      <h2>Counter: {count}</h2>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

function TodoStats() {
  const { total, doneCount, openCount, progress } = useTodoStats();
  return (
    <p>
      {doneCount}/{total} done, {openCount} open ({progress}%)
    </p>
  );
}

function TodoList() {
  const [todos, setTodos] = useTodos();

  const toggle = useCallback(
    (id: number) => {
      setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    },
    [todos, setTodos],
  );

  return (
    <ul>
      {todos.map((todo) => (
        <li
          key={todo.id}
          onClick={() => toggle(todo.id)}
          style={{ textDecoration: todo.done ? "line-through" : "none", cursor: "pointer" }}
        >
          {todo.text}
        </li>
      ))}
    </ul>
  );
}

function OpenTodos() {
  const openTodos = useFilteredTodos(false);
  return (
    <div>
      <h3>Still open:</h3>
      <ul>
        {openTodos.map((t) => (
          <li key={t.id}>{t.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  return (
    <div>
      <Counter />
      <hr />
      <h2>Todos</h2>
      <TodoStats />
      <TodoList />
      <OpenTodos />
    </div>
  );
}

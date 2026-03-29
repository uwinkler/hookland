/**
 * External Updates (Default Context)
 *
 * Use getState and setState returned from createTinyState to read/write
 * state from outside the React component tree — e.g. from event handlers,
 * WebSocket callbacks, timers, or other non-React code.
 */
import { createTinyState } from "@hookland/tiny-state";
import { useEffect } from "react";

const [useMessages,  /*MessageProvider*/, getMessages, setMessages] = createTinyState<string[]>([]);

// --- External code (no React needed) ---

/** Simulate a WebSocket pushing messages */
function startFakeWebSocket() {
  let i = 0;
  const interval = setInterval(() => {
    const current = getMessages();
    setMessages([...current, `Message #${++i}`]);
    if (i >= 5) clearInterval(interval);
  }, 1000);
}

// --- React components ---

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
    startFakeWebSocket();
  }, []);

  return (
    <div>
      <h2>Live Messages</h2>
      <MessageList />
    </div>
  );
}

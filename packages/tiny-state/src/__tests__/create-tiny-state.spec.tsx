import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen
} from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { createTinyState } from "../create-tiny-state";

afterEach(() => {
  cleanup(); // This will unmount the component from the screen
});

test("createTinyStore - get initial value", () => {
  const [useMyCounter] = createTinyState(1);

  function Comp() {
    const [value] = useMyCounter();
    return JSON.stringify({ a: value });
  }

  render(<Comp />);

  expect(screen.getByText(/{"a":1}/)).not.toBeNull();
});

test("createTinyStore - simple two components", () => {
  const [useTinyState] = createTinyState(1);

  function CompA() {
    const [value] = useTinyState();
    return JSON.stringify({ a: value });
  }

  function CompB() {
    const [value] = useTinyState();
    return JSON.stringify({ b: value });
  }

  const { asFragment } = render(
    <>
      <CompA />
      <CompB />
    </>
  );
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      {"a":1}{"b":1}
    </DocumentFragment>
  `);
});

test("createTinyStore - update value", () => {
  const [useTinyState] = createTinyState(1);
  const { result } = renderHook(() => useTinyState());
  const [value, setValue] = result.current;
  expect(value).toBe(1);
  act(() => setValue(2));
  expect(result.current[0]).toBe(2);
});

test("createTinyStore - update value - with Components", () => {
  const [useTinyState] = createTinyState(1);
  const { result } = renderHook(() => useTinyState());
  const [value, setValue] = result.current;
  expect(value).toBe(1);

  function CompA() {
    const [v] = useTinyState();
    return JSON.stringify({ a: v });
  }

  {
    const { asFragment } = render(<CompA />);
    expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      {"a":1}
    </DocumentFragment>
  `);
  }

  // update
  act(() => setValue(2));

  {
    const { asFragment } = render(<CompA />);
    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        {"a":2}
      </DocumentFragment>
    `);
  }
});

test("createTinyStore - using Provider", () => {
  const [useTinyState, MyTinyStoreProvider] = createTinyState(1);

  function CompWrapper() {
    return (
      <MyTinyStoreProvider>
        <CompA />
      </MyTinyStoreProvider>
    );
  }

  function CompA() {
    const [value] = useTinyState();
    return JSON.stringify({ a: value });
  }

  {
    const { asFragment } = render(<CompWrapper />);
    expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      {"a":1}
    </DocumentFragment>
  `);
  }
});


test("createTinyStore - using Provider with inital value", () => {
  const [useTinyState, MyTinyStoreProvider] = createTinyState(1);

  function CompWrapper() {
    return (
      <MyTinyStoreProvider initalValue={2}>
        <CompA />
      </MyTinyStoreProvider>
    );
  }

  function CompA() {
    const [value] = useTinyState();
    return JSON.stringify({ a: value });
  }

  {
    const { asFragment } = render(<CompWrapper />);
    expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      {"a":2}
    </DocumentFragment>
  `);
  }
});

test("createTinyStore - using Provider and updating outside of component tree", () => {
  const [useTinyState, MyTinyStoreProvider] = createTinyState(1);

  function CompWrapper() {
    return (
      <MyTinyStoreProvider>
        <CompA />
      </MyTinyStoreProvider>
    );
  }

  function CompA() {
    const [value] = useTinyState();
    return JSON.stringify({ a: value });
  }

  {
    const { asFragment } = render(<CompWrapper />);
    expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      {"a":1}
    </DocumentFragment>
  `);
  }

  // We update the state OUTSIDE the isolated CompWrapper....
  const { result } = renderHook(() => useTinyState());
  const [, setValue] = result.current;
  act(() => setValue(2));

  // ... so we don't expect any changes
  {
    const { asFragment } = render(<CompWrapper />);
    expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      {"a":1}
    </DocumentFragment>
  `);
  }
});

test("createTinyStore - using Provider and updating inside of the component tree", () => {
  const [useTinyState, MyTinyStoreProvider] = createTinyState(1);

  function CompWrapper() {
    return (
      <MyTinyStoreProvider>
        <CompA />
        <CompUpdate />
      </MyTinyStoreProvider>
    );
  }

  function CompA() {
    const [value] = useTinyState();
    return JSON.stringify({ a: value });
  }

  function CompUpdate() {
    const [, setValue] = useTinyState();
    return (
      <button type="button" onClick={() => setValue(2)}>
        Update
      </button>
    );
  }

  render(<CompWrapper />);

  // We update the state inside the isolated CompWrapper....
  act(() => {
    fireEvent.click(screen.getByText("Update"));
  });

  expect(screen.getByText(/{"a":2}/)).not.toBeNull();
});

test("createTinyStore - using Provider and updating inside of the component tree but having two isolated parts", () => {
  const [useTinyState, MyTinyStoreProvider] = createTinyState(1);

  function CompWrapper() {
    return (
      <>
        <MyTinyStoreProvider>
          <CompA />
          <CompUpdate label="A" />
        </MyTinyStoreProvider>
        <MyTinyStoreProvider>
          <CompB />
          <CompUpdate label="B" />
        </MyTinyStoreProvider>
      </>
    );
  }

  function CompA() {
    const [value] = useTinyState();
    return JSON.stringify({ a: value });
  }

  function CompB() {
    const [value] = useTinyState();
    return JSON.stringify({ b: value });
  }

  function CompUpdate({ label }: { label: string }) {
    const [, setValue] = useTinyState();
    return (
      <button type="button" onClick={() => setValue(2)}>
        {label}
      </button>
    );
  }

  render(<CompWrapper />);

  // We click on A - so only the A part should update
  act(() => {
    fireEvent.click(screen.getByText("A"));
  });

  expect(screen.getByText(/{"a":2}/)).not.toBeNull();
  expect(screen.getByText(/{"b":1}/)).not.toBeNull();
});


test("createTinyState - getValue outside of the component tree", () => {
  const [useTinyState, _, getValue] = createTinyState(1);

  function CompA() {
    const [value] = useTinyState();
    return JSON.stringify({ a: value });
  }

  function CompWrapper() {
    return (
      <CompA />
    );
  }

  render(<CompWrapper />);
  expect(screen.getByText(/{"a":1}/)).not.toBeNull();

  // We get the value outside the component tree
  expect(getValue()).toBe(1);
});


test("createTinyState - setValue outside of the component tree", () => {
  const [useTinyState, _, getValue, setValue] = createTinyState(1);

  function CompA() {
    const [value] = useTinyState();
    return JSON.stringify({ a: value });
  }

  function CompWrapper() {
    return (
      <CompA />
    );
  }

  render(<CompWrapper />);
  expect(screen.getByText(/{"a":1}/)).not.toBeNull();

  act(() => {
    setValue(2);
  })

  // We get the value outside the component tree
  expect(getValue()).toBe(2);

  // We expect the component to update as well
  expect(screen.getByText(/{"a":2}/)).not.toBeNull();
});

test("performance - only subscribed components re-render", () => {
  const [useA] = createTinyState(0);
  const [useB] = createTinyState(0);

  const renderCountA = vi.fn();
  const renderCountB = vi.fn();

  function CompA() {
    const [v, setV] = useA();
    renderCountA();
    return <button onClick={() => setV(v + 1)}>A: {v}</button>;
  }

  function CompB() {
    useB();
    renderCountB();
    return <div>B</div>;
  }

  render(
    <>
      <CompA />
      <CompB />
    </>
  );
  expect(renderCountA).toHaveBeenCalledTimes(1);
  expect(renderCountB).toHaveBeenCalledTimes(1);

  act(() => {
    fireEvent.click(screen.getByText(/A:/));
  });

  // CompA should re-render, CompB should NOT
  expect(renderCountA).toHaveBeenCalledTimes(2);
  expect(renderCountB).toHaveBeenCalledTimes(1);
});

test("performance - handles many subscribers", () => {
  const [useCounter] = createTinyState(0);
  const hooks = Array.from({ length: 100 }, () =>
    renderHook(() => useCounter())
  );

  act(() => hooks[0].result.current[1](42));

  hooks.forEach((h) => expect(h.result.current[0]).toBe(42));
});

test("performance - no re-render when setting same value", () => {
  const [useCounter] = createTinyState(1);
  const renderCount = vi.fn();

  function Comp() {
    const [v, setV] = useCounter();
    renderCount();
    return <button onClick={() => setV(1)}>val: {v}</button>;
  }

  render(<Comp />);
  expect(renderCount).toHaveBeenCalledTimes(1);

  act(() => {
    fireEvent.click(screen.getByText(/val:/));
  });

  // Should NOT re-render because value didn't change
  expect(renderCount).toHaveBeenCalledTimes(1);
});


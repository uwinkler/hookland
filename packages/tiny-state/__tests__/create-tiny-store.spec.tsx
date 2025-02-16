import {
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react";
import React, { act } from "react";
import { afterEach, expect, test } from "vitest";
import { createTinyStore } from "../create-tiny-store";

afterEach(() => {
  cleanup(); // This will unmount the component from the screen
});

test("createTinyStore - get initial value", () => {
  const [createTinyState] = createTinyStore();
  const useTinyState = createTinyState(1);

  function Comp() {
    const [value] = useTinyState();
    return JSON.stringify({ a: value });
  }

  render(<Comp />);

  expect(screen.getByText(/{"a":1}/)).not.toBeNull();
});

test("createTinyStore - simple two components", () => {
  const [createTinyState] = createTinyStore();
  const useTinyState = createTinyState(1);

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
  const [createTinyState] = createTinyStore();
  const useTinyState = createTinyState(1);
  const { result } = renderHook(() => useTinyState());
  const [value, setValue] = result.current;
  expect(value).toBe(1);
  act(() => setValue(2));
  expect(result.current[0]).toBe(2);
});

test("createTinyStore - update value - with Components", () => {
  const [createTinyState] = createTinyStore();
  const useTinyState = createTinyState(1);
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
  const [createTinyState, MyTinyStoreProvider] = createTinyStore();
  const useTinyState = createTinyState(1);

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

test("createTinyStore - using Provider and updating outside of component tree", () => {
  const [createTinyState, MyTinyStoreProvider] = createTinyStore();
  const useTinyState = createTinyState(1);

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
  const [createTinyState, MyTinyStoreProvider] = createTinyStore();
  const useTinyState = createTinyState(1);

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
  const [createTinyState, MyTinyStoreProvider] = createTinyStore();
  const useTinyState = createTinyState(1);

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
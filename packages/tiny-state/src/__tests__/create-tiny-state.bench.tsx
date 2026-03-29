import { act, renderHook } from "@testing-library/react";
import { atom, createStore, Provider, useAtom } from "jotai";
import React from "react";
import { bench, describe } from "vitest";
import { create } from "zustand";
import { createTinyState } from "../create-tiny-state";

/**
 * Performance benchmarks: tiny-state vs zustand vs jotai vs mobx.
 *
 * Run with: npx vitest bench
 *
 * Vitest measures how often each function can be executed per second (ops/sec).
 * Higher values indicate better performance.
 */

// -- Helper: zustand hook factory (equivalent to createTinyState) --
function createZustandCounter(initial: number) {
  return create<{ value: number; setValue: (v: number) => void }>((set) => ({
    value: initial,
    setValue: (v) => set({ value: v }),
  }));
}

// -- Helper: jotai hook that returns [value, setValue] --
function useJotaiCounter(counterAtom: ReturnType<typeof atom<number>>) {
  return useAtom(counterAtom);
}

describe("create + read state", () => {
  bench("tiny-state", () => {
    const [useCounter] = createTinyState(0);
    const { result } = renderHook(() => useCounter());
    result.current[0];
  });

  bench("zustand", () => {
    const useStore = createZustandCounter(0);
    const { result } = renderHook(() => useStore((s) => s.value));
    result.current;
  });

  bench("jotai", () => {
    const counterAtom = atom(0);
    const store = createStore();
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(Provider, { store }, children);
    const { result } = renderHook(() => useJotaiCounter(counterAtom), { wrapper });
    result.current[0];
  });

});

describe("100 sequential state updates", () => {
  bench("tiny-state", () => {
    const [useCounter] = createTinyState(0);
    const { result } = renderHook(() => useCounter());
    act(() => {
      for (let i = 0; i < 100; i++) {
        result.current[1](i);
      }
    });
  });

  bench("zustand", () => {
    const useStore = createZustandCounter(0);
    const { result } = renderHook(() => useStore());
    act(() => {
      for (let i = 0; i < 100; i++) {
        result.current.setValue(i);
      }
    });
  });

  bench("jotai", () => {
    const counterAtom = atom(0);
    const store = createStore();
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(Provider, { store }, children);
    const { result } = renderHook(() => useJotaiCounter(counterAtom), { wrapper });
    act(() => {
      for (let i = 0; i < 100; i++) {
        result.current[1](i);
      }
    });
  });

});

describe("fan-out: 100 subscribers, single update", () => {
  const SUBSCRIBERS = 100;
  bench("tiny-state", () => {
    const [useCounter] = createTinyState(0);
    const hooks = Array.from({ length: SUBSCRIBERS }, () =>
      renderHook(() => useCounter())
    );
    act(() => hooks[0].result.current[1](42));
  });

  bench("zustand", () => {
    const useStore = createZustandCounter(0);
    const hooks = Array.from({ length: SUBSCRIBERS }, () =>
      renderHook(() => useStore())
    );
    act(() => hooks[0].result.current.setValue(42));
  });

  bench("jotai", () => {
    const counterAtom = atom(0);
    const store = createStore();
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(Provider, { store }, children);
    const hooks = Array.from({ length: SUBSCRIBERS }, () =>
      renderHook(() => useJotaiCounter(counterAtom), { wrapper })
    );
    act(() => hooks[0].result.current[1](42));
  });

});

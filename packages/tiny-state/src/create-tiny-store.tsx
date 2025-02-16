import React, { PropsWithChildren, useContext } from "react";

type Listener = () => void;

/**
 * Atom like state management
 *
 * Usage :
 *
 * ```
 * const [createTinyStateHook, MyTinyStateProvider] = createTinyStore()
 *
 * const useMyValue = createTinyStateHook(1)
 *
 * function Component() {
 *   const [value, setValue] = useMyValue()
 *   ...
 * }
 * ```
 *
 * To isolate the state, wrap the component with the Provider
 *
 * ```
 * const MyTest() {
 *  <MyTinyStateProvider>
 *   <Component />
 * </MyTinyStoreProvider>
 * }
 * ```
 */
export function createTinyStore(name = "TinyStore") {
  const defaultMap = new Map<symbol, unknown>();
  const Context = React.createContext(defaultMap);

  function Provider({ children }: PropsWithChildren<unknown>) {
    const isolatedMap = React.useMemo(() => new Map(), []);
    return <Context.Provider value={isolatedMap}>{children}</Context.Provider>;
  }

  Provider.displayName = name;

  function createTinyState<T>(value: T, label = "createTinyState") {
    const key = Symbol(label);
    const listenerSet = new Set<Listener>();

    function subscribe(listener: Listener) {
      listenerSet.add(listener);
      return () => {
        listenerSet.delete(listener);
      };
    }

    function createSetState(map: Map<symbol, unknown>) {
      return function setState(newValue: T) {
        const oldValue = map.get(key);
        if (oldValue === newValue) {
          return;
        }
        map.set(key, newValue);
        listenerSet.forEach((listener) => listener());
      };
    }

    function createGetState(map: Map<symbol, unknown>, defaultValue: T) {
      return function getState(): T {
        return map.has(key) ? (map.get(key) as T) : defaultValue;
      };
    }

    function useTinyStateHook(defaultValue: T = value) {
      const map = useContext(Context);
      const getState = React.useMemo(() => createGetState(map, defaultValue), [map]);
      const setState = React.useMemo(() => createSetState(map), [map]);

      const valueToUse = React.useSyncExternalStore(subscribe, getState);

      React.useEffect(() => {
        if (defaultValue !== value) {
          setState(defaultValue);
        }
      }, [defaultValue, setState])


      return [valueToUse, setState] as const;
    }

    return useTinyStateHook;
  }

  return [createTinyState, Provider] as const;
}


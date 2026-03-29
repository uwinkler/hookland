import React, { PropsWithChildren, useContext } from "react";

type Listener = () => void;

/**
 * Atom like state management
 *
 * Usage :
 *
 * ```
 * const [useMyCounter] = createTinyState(0)
 *
 * function MyComponent() {
 *   const [value, setValue] = useMyCounter()
 *   ...
 * }
 * ```
 *
 * To isolate the state - and to initalize with another value - wrap the component
 * with the created TinyStateProvider
 *
 * ```
 *
 *  const [useMyCounter, MyCounterProvider] = createTinyState(0)
 *
 *
 * const MyTest() {
 *  <MyCounterProvider initalValue={10}>
 *   <Component />
 * </MyCounterProvider>
 * }
 * ```
 */
export function createTinyState<T>(initalValue: T, name = "TinyState") {
  type ContainerType = { value: T };

  const defaultContainer: ContainerType = { value: initalValue };

  const Context = React.createContext<ContainerType>(defaultContainer);

  function TinyStateProvider(props: PropsWithChildren<{ initalValue?: T }>) {
    return (
      <Context.Provider
        value={{ value: props.initalValue ? props.initalValue : initalValue }}
      >
        {props.children}
      </Context.Provider>
    );
  }
  TinyStateProvider.displayName = name;

  const listenerSet = new Set<Listener>();

  function subscribe(listener: Listener) {
    listenerSet.add(listener);
    return () => {
      listenerSet.delete(listener);
    };
  }

  function setStateFactory(container: ContainerType): (newValue: T) => void {
    return (newValue: T) => {
      if (newValue === container.value) {
        return;
      }
      container.value = newValue;
      listenerSet.forEach((listener) => listener());
    };
  }

  // Performance optimization: we cache the setState function for each container, 
  // so that we don't create a new function on every render of the hook.
  const setStateCache = new WeakMap<ContainerType, (newValue: T) => void>();

  function useTinyStateHook() {
    const container = useContext(Context);

    let setState = setStateCache.get(container);
    if (!setState) {
      setState = setStateFactory(container);
      setStateCache.set(container, setState);
    }

    const value = React.useSyncExternalStore(
      subscribe,
      () => container.value,
    );

    return [value, setState] as const;
  }

  function setStateExternal(newValue: T) {
    if (newValue === defaultContainer.value) {
      return;
    }
    defaultContainer.value = newValue;
    listenerSet.forEach((listener) => listener());
  }

  function getStateExternal() {
    return defaultContainer.value;
  }

  function subscribeExternal(listener: Listener) {
    listenerSet.add(listener);
    return () => {
      listenerSet.delete(listener);
    };
  }

  return [useTinyStateHook, TinyStateProvider, getStateExternal, setStateExternal, subscribeExternal] as const;
}

import { MessageClientScenarios, Scenario } from '@hookland/dev-tools-commons';
import { HookMockMapping, HookProvider } from '@hookland/inject';
import { useCallback, useEffect, useState } from 'react';

export type HooklandScenario = Omit<Scenario, 'active'> & { hooks: HookMockMapping[] }

export function createScenario(props: HooklandScenario) {
  return props
}

export function HooklandScenarioProvider(
  props: React.PropsWithChildren<{ scenarios?: HooklandScenario[]; }>) {
  const { scenarios = [], children } = props;

  const [activeScenario, setActiveScenario] = useState(
    scenarios[0]?.id || 'none'
  );

  const hooksWithActiveState = scenarios.map((scenario) => {
    return {
      ...scenario,
      active: scenario.id === activeScenario
    };
  });

  const hudListenerActiveId = useCallback(
    (event: MessageEvent) => {
      if (event.data.source === 'HOOKLAND_HUD_EXTENSION') {
        console.log('Received from HUD:', event.data);
        setActiveScenario(event.data.payload.id);
      }
    },
    [setActiveScenario]
  );

  useEffect(() => {
    window.addEventListener('message', hudListenerActiveId);
    return () => {
      window.removeEventListener('message', hudListenerActiveId);
    };
  }, [setActiveScenario, hudListenerActiveId]);

  useEffect(() => {
    setTimeout(() => {
      const hooksWithActiveState = scenarios.map((scenario) => {
        return {
          ...scenario,
          active: scenario.id === activeScenario
        };
      });

      const hudScenarios: Scenario[] = hooksWithActiveState.map((scenario) => {
        // Remove hook
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { hooks, ...rest } = scenario;
        return rest;
      });

      const msg: MessageClientScenarios = {
        source: 'HOOKLAND_HUD_ClIENT',
        type: 'SCENARIOS',
        payload: {
          scenarios: hudScenarios
        }
      };

      window.postMessage(msg, '*');
    }, 100); // TODO listen for the content script to be ready and to accept messages
  }, [activeScenario, scenarios]);

  return (
    <HookProvider
      key={activeScenario}
      hooks={hooksWithActiveState
        .filter((s) => s.active)
        .flatMap((scenario) => scenario.hooks)}
    >
      {children}
    </HookProvider>
  );
}

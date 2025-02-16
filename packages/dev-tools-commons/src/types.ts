export type HOOKLAND_CAPTN_CLIENT = 'HOOKLAND_CAPTN_ClIENT'
export type HOOKLAND_CAPTN_EXTENSION = 'HOOKLAND_CAPTN_EXTENSION'
export type Markdown = string
export type UUID = string
export type URLString = string

export type Message =
  | MessageClientScenarios
  | MessageExtensionScenarios


interface MessageClient<Type, Payload> {
  sender: HOOKLAND_CAPTN_CLIENT
  type: Type
  payload: Payload
}

interface MessageExtension<Type, Payload> {
  sender: HOOKLAND_CAPTN_EXTENSION
  type: Type
  payload: Payload
}

export type MessageClientScenarios = MessageClient<'SCENARIOS', { scenarios: Scenario[] }>
export type MessageExtensionScenarios = MessageExtension<'SCENARIOS', { activeScenarios: Scenario[] }>

export interface Scenario {
  id: UUID
  name: string
  group: string
  description: Markdown
}

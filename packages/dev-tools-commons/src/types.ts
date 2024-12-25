export type HOOKLAND_CAPTN_CLIENT = 'HOOKLAND_CAPTN_ClIENT'
export type HOOKLAND_CAPTN_EXTENSION = 'HOOKLAND_CAPTN_EXTENSION'
export type Markdown = string
export type UUID = string
export type URLString = string

export type Message =
  | MessageClientConfig
  | MessageExtensionButtonOnClick
  | MessageExtensionSelectOnChange

export interface UiConfig {
  id: UUID
  name: string
  path: string
  url?: URLString
  descriptionShort?: string
  descriptionLong?: Markdown
  blocks: UiBlock[]
}

export interface MessageClientConfig {
  sender: HOOKLAND_CAPTN_CLIENT
  type: 'UI_CONFIG'
  payload: UiConfig
}

export type UiBlock = UiBlockButton | UiBlockSelect | UiBlockMarkdown

//
// Button
//

export interface UiBlockButton {
  id: UUID
  type: 'button'
  label: string
  color?: 'primary' | 'secondary'
  variant?: 'contained' | 'outlined' | 'text'
  disabled?: boolean
  tooltip?: string
}

export interface MessageExtensionButtonOnClick {
  sender: HOOKLAND_CAPTN_EXTENSION
  type: 'UI_BUTTON_ON_CLICK'
  payload: {
    id: UUID // The id of the button that was clicked
  }
}

//
// Select
//

export interface UiBlockSelect {
  id: UUID
  type: 'select'
  label: string
  value: string
  options: UiBlockSelectOption[]
}

export interface MessageExtensionSelectOnChange {
  sender: HOOKLAND_CAPTN_EXTENSION
  type: 'UI_SELECT_ON_CHANGE'
  payload: {
    id: UUID // The id of the select that was changed
    nextValue: string // The value that the select was changed to
  }
}

export interface UiBlockSelectOption {
  value: string | number | boolean | null
  label: string
}

//
// Markdown
//

export interface UiBlockMarkdown {
  id: UUID
  type: 'markdown'
  content: Markdown
}

export type Sender = 'HOOKLAND_CAPTN_CLIENT' | 'HOOKLAND_CAPTN_EXTENSION'

export type Message =
  | MessageUiConfig
  | MessageUiButtonOnClick
  | MessageUiButtonOnChange

export interface UiConfig {
  name: string
  id: string
  tab: string
  group: string
  descriptionShort?: string
  descriptionLong?: string // Markdown
  url: string
  blocksGroup: UiBlock[]
}

export interface MessageUiConfig {
  sender: Sender
  type: 'UI_CONFIG'
  payload: UiConfig
}

export type UiBlock = UiBlockButton | UiBlockSelect | UiBlockMarkdown

export interface UiBlockButton {
  id: string
  type: 'button'
  label: string
  color?: 'primary' | 'secondary'
  variant?: 'contained' | 'outlined' | 'text'
  disabled?: boolean
  tooltip?: string
}

export interface MessageUiButtonOnClick {
  sender: Sender
  type: 'UI_BUTTON_ON_CLICK'
  payload: {
    id: string // The id of the button that was clicked
  }
}

export interface UiBlockSelect {
  id: string
  type: 'select'
  label: string
  value: string
  options: UiBlockSelectOption[]
}

export interface MessageUiButtonOnChange {
  sender: Sender
  type: 'UI_SELECT_ON_CHANGE'
  payload: {
    id: string // The id of the select that was changed
    nextValue: string // The value that the select was changed to
  }
}

export interface UiBlockSelectOption {
  value: string
  label: string
}

export interface UiBlockMarkdown {
  id: string
  type: 'markdown'
  content: string
}

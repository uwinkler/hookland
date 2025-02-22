import { z } from 'zod'

// Basic types
const HOOKLAND_HUD_CLIENT_Schema = z.literal('HOOKLAND_HUD_ClIENT')
const HOOKLAND_HUD_EXTENSION_Schema = z.literal('HOOKLAND_HUD_EXTENSION')
const HUDMarkdownSchema = z.string()
const HUD_UUID_Schema = z.string()
const HDU_URLStringSchema = z.string()

// Scenario schema
const ScenarioSchema = z.object({
  id: HUD_UUID_Schema,
  name: z.string(),
  group: z.string(),
  active: z.boolean(),
  description: HUDMarkdownSchema
})

const DevDuckTypeSchema = z.union([
  z.literal('listitem'),
  z.literal('state'),
  z.literal('button'),
  z.literal('select'),
  z.literal('md')
])

// Common entry schema
const DevDuckEntrySchema = z.object({
  id: HUD_UUID_Schema,
  type: DevDuckTypeSchema,
  path: z.string(),
  text: z.string(),
  subtext: z.string(),
  content: HUDMarkdownSchema,
  history: z.boolean().optional()
})

// MessageClient schema
const MessageClientSchema = <T extends z.ZodType, P extends z.ZodType>(
  type: T,
  payload: P
) =>
  z.object({
    source: HOOKLAND_HUD_CLIENT_Schema,
    type: type,
    payload: payload
  })

// MessageExtension schema
const MessageExtensionSchema = <T extends z.ZodType, P extends z.ZodType>(
  type: T,
  payload: P
) =>
  z.object({
    source: HOOKLAND_HUD_EXTENSION_Schema,
    type: type,
    payload: payload
  })

// MessageClientScenarios schema
const MessageClientScenariosSchema = MessageClientSchema(
  z.literal('SCENARIOS'),
  z.object({ scenarios: z.array(ScenarioSchema) })
)

// MessageExtensionScenarios schema
const MessageExtensionScenariosSchema = MessageExtensionSchema(
  z.literal('SCENARIOS'),
  z.object({ activeScenarios: z.array(ScenarioSchema) })
)

// Message schema
const MessageSchema = z.union([
  MessageClientScenariosSchema,
  MessageExtensionScenariosSchema
])

// Export schemas
export {
  HOOKLAND_HUD_CLIENT_Schema,
  HOOKLAND_HUD_EXTENSION_Schema,
  HUDMarkdownSchema as MarkdownSchema,
  MessageClientScenariosSchema,
  MessageClientSchema,
  MessageExtensionScenariosSchema,
  MessageExtensionSchema,
  MessageSchema,
  ScenarioSchema,
  HDU_URLStringSchema as URLStringSchema,
  HUD_UUID_Schema as UUID_Schema
}

export const HOOKLAND_HUD_CLIENT = HOOKLAND_HUD_CLIENT_Schema.value
export const HOOKLAND_HUD_EXTENSION = HOOKLAND_HUD_EXTENSION_Schema.value
export type Markdown = z.infer<typeof HUDMarkdownSchema>
export type MessageClientScenarios = z.infer<
  typeof MessageClientScenariosSchema
>
export type MessageClient<
  P extends z.ZodTypeAny,
  T extends z.ZodTypeAny
> = z.infer<ReturnType<typeof MessageClientSchema<P, T>>>
export type MessageExtensionScenarios = z.infer<
  typeof MessageExtensionScenariosSchema
>
export type MessageExtension<
  P extends z.ZodTypeAny,
  T extends z.ZodTypeAny
> = z.infer<ReturnType<typeof MessageExtensionSchema<P, T>>>
export type Message = z.infer<typeof MessageSchema>
export type Scenario = z.infer<typeof ScenarioSchema>
export type URLString = z.infer<typeof HDU_URLStringSchema>
export type UUID = z.infer<typeof HUD_UUID_Schema>

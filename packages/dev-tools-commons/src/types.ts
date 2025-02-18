import { z } from "zod";

// Basic types
const HOOKLAND_HUD_CLIENT_Schema = z.literal('HOOKLAND_CAPTN_ClIENT');
const HOOKLAND_HUD_EXTENSION_Schema = z.literal('HOOKLAND_CAPTN_EXTENSION');
const MarkdownSchema = z.string();
const UUID_Schema = z.string();
const URLStringSchema = z.string();

// Scenario schema
const ScenarioSchema = z.object({
  id: UUID_Schema,
  name: z.string(),
  group: z.string(),
  description: MarkdownSchema,
});

// MessageClient schema
const MessageClientSchema = <T extends z.ZodType, P extends z.ZodType>(type: T, payload: P) =>
  z.object({
    sender: HOOKLAND_HUD_CLIENT_Schema,
    type: type,
    payload: payload,
  });

// MessageExtension schema
const MessageExtensionSchema = <T extends z.ZodType, P extends z.ZodType>(type: T, payload: P) =>
  z.object({
    sender: HOOKLAND_HUD_EXTENSION_Schema,
    type: type,
    payload: payload,
  });

// MessageClientScenarios schema
const MessageClientScenariosSchema = MessageClientSchema(
  z.literal('SCENARIOS'),
  z.object({ scenarios: z.array(ScenarioSchema) })
);

// MessageExtensionScenarios schema
const MessageExtensionScenariosSchema = MessageExtensionSchema(
  z.literal('SCENARIOS'),
  z.object({ activeScenarios: z.array(ScenarioSchema) })
);

// Message schema
const MessageSchema = z.union([MessageClientScenariosSchema, MessageExtensionScenariosSchema]);

// Export schemas
export {
  HOOKLAND_HUD_CLIENT_Schema,
  HOOKLAND_HUD_EXTENSION_Schema,
  MarkdownSchema,
  MessageClientScenariosSchema,
  MessageClientSchema,
  MessageExtensionScenariosSchema,
  MessageExtensionSchema,
  MessageSchema,
  ScenarioSchema,
  URLStringSchema,
  UUID_Schema
};

export type HOOKLAND_HUD_CLIENT = z.infer<typeof HOOKLAND_HUD_CLIENT_Schema>;
export type HOOKLAND_HUD_EXTENSION = z.infer<typeof HOOKLAND_HUD_EXTENSION_Schema>
export type Markdown = z.infer<typeof MarkdownSchema>
export type MessageClientScenarios = z.infer<typeof MessageClientScenariosSchema>
export type MessageClient<P extends z.ZodTypeAny, T extends z.ZodTypeAny> = z.infer<ReturnType<typeof MessageClientSchema<P, T>>>
export type MessageExtensionScenarios = z.infer<typeof MessageExtensionScenariosSchema>
export type MessageExtension<P extends z.ZodTypeAny, T extends z.ZodTypeAny> = z.infer<ReturnType<typeof MessageExtensionSchema<P, T>>>
export type Message = z.infer<typeof MessageSchema>
export type Scenario = z.infer<typeof ScenarioSchema>
export type URLString = z.infer<typeof URLStringSchema>
export type UUID = z.infer<typeof UUID_Schema>
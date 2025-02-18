import { type Scenario } from "@hookland/dev-tools-commons";
import { createTinyState } from "@hookland/tiny-state";

export const useScenariosState = createTinyState<Scenario[]>([]);
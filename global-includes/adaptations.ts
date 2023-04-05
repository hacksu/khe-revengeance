import { FieldOptions, Fields } from "remult";

/** Use instead of Fields.object() for native MongoDB object handling */
export function rawObj(options: FieldOptions = {}) {
  return Fields.object({
    ...options,
    valueConverter: {
      toDb: (x) => x,
      fromDb: (x) => x,
    },
  });
}

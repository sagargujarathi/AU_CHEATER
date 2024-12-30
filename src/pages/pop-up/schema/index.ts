import { z as zod } from "zod";

const schema = zod.object({
  generateKey: zod.string({
    required_error: "Generate Key is required",
    invalid_type_error: "Auto Select Key is required",
  }),
  autoSelectKey: zod.string({
    required_error: "Auto Select Key is required",
    invalid_type_error: "Auto Select Key is required",
  }),
  termsAndConditions: zod.boolean().refine((value) => value === true, {
    message: "Accepting is required",
  }),
});

export type FormType = zod.infer<typeof schema>;

export default schema;

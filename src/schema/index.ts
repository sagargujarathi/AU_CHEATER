import { z as zod } from "zod";

const schema = zod.object({
  // secretKey: zod
  //   .string({
  //     required_error: "OpenAI Key is required",
  //     message: "OpenAI Key is required",
  //   })
  //   .min(10, { message: "OpenAI Key is required" }),
  generateKey: zod.string({
    required_error: "Generate Key is required",
    invalid_type_error: "Auto Select Key is required",
  }),
  autoSelectKey: zod.string({
    required_error: "Auto Select Key is required",
    invalid_type_error: "Auto Select Key is required",
  }),
});

export type FormType = zod.infer<typeof schema>;

export default schema;

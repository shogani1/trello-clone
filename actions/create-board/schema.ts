import { z } from "zod";

export const CreateBoard = z.object({
  title: z
    .string({
      required_error: "Title is required ",
      invalid_type_error: "Title is required ",
    })
    .min(3, {
      message: "Title must have at least 3 characters",
    })
    .max(30, { message: "Title is too long" }),
  image: z.string({
    required_error: "Image is required, click on the one of the images",
    invalid_type_error: "Image is required, click on the one of the images",
  }),
});

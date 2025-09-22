import { transform, z } from "zod";
import xss from "xss";

export const signUpSchema = z.object({
  username: z
    .string()
    .min(3, "username should be atleast 3 characters long")
    .max(50, "username can have maximum of 50 characters only")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscore"
    )
    .transform((val) => xss(val)),

  email: z
    .string()
    .email("invalid email")
    .transform((val) => xss(val)),

  password: z.string().min(5, "password should be atleast 5 characters long"),
});

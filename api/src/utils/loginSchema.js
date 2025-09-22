import { z } from "zod";
import xss from "xss";

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(3, "Username/email must have atleast 3 characters")
    .max(100, "username/email can have a maximum of 100 characters")
    .transform((val) => xss(val)),
  password: z
    .string()
    .min(3, "Password must be atleast 3 characters long")
    .max("Password can have a max of 100 characters"),
});

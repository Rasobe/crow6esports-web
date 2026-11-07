import { z } from "zod";
import { NOTES_MAX, REQUEST_STATUSES } from "@/domain/tryouts/tryout-application";

const EMAIL_MAX = 254;
const PASSWORD_MAX = 256;

export const loginSchema = z.object({
  email: z.email().max(EMAIL_MAX),
  password: z.string().min(1).max(PASSWORD_MAX),
});

export const requestIdSchema = z.uuid();

/** Empty notes are stored as null so the panel can tell "no notes" from "blank notes". */
export const reviewSchema = z.object({
  status: z.enum(REQUEST_STATUSES),
  notes: z
    .string()
    .trim()
    .max(NOTES_MAX)
    .transform((notes) => (notes === "" ? null : notes)),
});

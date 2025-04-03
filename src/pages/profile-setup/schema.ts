
import * as z from "zod";

export const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  dob: z.string().optional(),
  account_type: z.enum(["individual", "company"]),
  company_name: z.string().optional(),
  address: z.string().optional(),
  contact_number: z.string().optional(),
  contact_type: z.enum(["business", "mobile"]).default("mobile"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

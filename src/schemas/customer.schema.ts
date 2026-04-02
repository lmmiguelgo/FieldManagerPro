import { z } from "zod";

export const CustomerAddressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "ZIP code is required"),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export const CustomerFormSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  address: CustomerAddressSchema,
  notes: z.string().optional(),
  isActive: z.boolean(),
});

export type CustomerFormData = z.infer<typeof CustomerFormSchema>;

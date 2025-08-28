import * as z from "zod";

// ---------------- Zod Schemas ----------------

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const UserGetResponseSchema = UserSchema;

export const UserUpdateRequestSchema = z.object({
  name: z.string(),
});

// Optimistic UI: return updated user
export const UserUpdateResponseSchema = UserSchema;

export const UserDeleteResponseSchema = z.object({
  message: z.string(),
});

export const LogoutResponseSchema = z.object({
  message: z.string(),
});

// ---------------- Inferred Types (backwards-compatible names) ----------------

export type User = z.infer<typeof UserSchema>;

export type UserGetResponse = z.infer<typeof UserGetResponseSchema>;

export type UserUpdateRequest = z.infer<typeof UserUpdateRequestSchema>;

export type UserUpdateResponse = z.infer<typeof UserUpdateResponseSchema>;

export type UserDeleteResponse = z.infer<typeof UserDeleteResponseSchema>;

export type LogoutResponse = z.infer<typeof LogoutResponseSchema>;

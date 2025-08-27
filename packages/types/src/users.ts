export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
}

export type UserGetResponse = User;

export interface UserUpdateRequest {
  name: string;
}

// Optimistic UI: return updated user
export type UserUpdateResponse = User;

export interface UserStripeCreateRequest {}

export interface UserStripeCreateResponse {
  // shape can be extended when Stripe fields are known
  success: boolean;
}

export interface UserDeleteResponse {
  message: string;
}

export interface LogoutResponse {
  message: string;
}

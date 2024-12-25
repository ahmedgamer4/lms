export type Role = "teacher" | "student";

export type AsyncWrapperResponse<T> =
  | { error: null; data: T }
  | { error: any; data: null };

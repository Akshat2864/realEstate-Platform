
import api from "./api";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "../types/auth.types";

export const registerUser = async (
  credentials: RegisterCredentials
): Promise<AuthResponse> => {
  try {
    const response = await api.post(
      "/auth/register",
      credentials
    );

    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const loginUser = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  try {
    const response = await api.post(
      "/auth/login",
      credentials
    );

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get("/users/me");

    return response.data.user;
  } catch (error) {
    console.error("Get current user error:", error);
    throw error;
  }
};


export const updateProfile = async (name: string) => {
  try {
    const response = await api.put("/users/profile", { name });
    return response.data.user;
  } catch (error) {
    console.error("Update profile error:", error);
    throw error;
  }
};

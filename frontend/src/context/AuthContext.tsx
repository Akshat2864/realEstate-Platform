
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../services/auth.service";

import type {
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthContextType,
} from "../types/auth.types";

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    }
  }, []);

  // Restore authentication when the application loads
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await refreshUser();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [refreshUser]);

  const login = async (credentials: LoginCredentials) => {
    const response = await loginUser(credentials);

    // The backend sets the HTTP-only cookie.
    // Fetch the authenticated user from the server.
    await refreshUser();

    if (!response.success) {
      throw new Error(response.message || "Login failed");
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    await registerUser(credentials);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};

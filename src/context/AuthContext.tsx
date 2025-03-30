import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import api from "../api-services/api-services";
import { Center, VStack, Spinner, Text } from "@chakra-ui/react";
import axios from "axios";

const PUBLIC_ROUTES = ["/login"];

interface AuthContextType {
  isAuthenticated: boolean;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const pathname = window.location.pathname;
    const token = localStorage.getItem("access_token");

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/test-token`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
      .then(() => {
        if (PUBLIC_ROUTES.includes(pathname)) {
          window.location.href = "/dashboard";
        } else {
          setLoading(false);
          setIsAuthenticated(true);
        }
      })
      .catch(async (_) => {
        try {
          const refreshToken = localStorage.getItem("refresh_token");
          if (refreshToken) {
            const response = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/refresh-token`,
              {
                refresh_token: refreshToken,
              }
            );

            // Update tokens in localStorage
            localStorage.setItem("access_token", response.data.access_token);
            localStorage.setItem("refresh_token", response.data.refresh_token);

            // Retry the original request with new token
            const token = response.data.access_token;
            await axios.get(`${import.meta.env.VITE_API_BASE_URL}/test-token`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (PUBLIC_ROUTES.includes(pathname)) {
              window.location.href = "/dashboard";
            } else {
              setLoading(false);
              setIsAuthenticated(true);
            }
          } else {
            handleAuthFailure();
          }
        } catch (_) {
          handleAuthFailure();
        }
      });
  }, []);

  // Helper function to handle authentication failure
  const handleAuthFailure = () => {
    if (PUBLIC_ROUTES.includes(window.location.pathname)) {
      setLoading(false);
    } else {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
    }
  };

  const login = async (phone: string, password: string) => {
    if (phone && password) {
      const response = await api.post("/admin-login", { phone, password });
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      if (response.status === 200) {
        setIsAuthenticated(true);
      } else {
        throw new Error("Invalid credentials");
      }
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <Center backgroundColor="white" minH="100vh" minW="100vw">
        <VStack spacing={4}>
          <Spinner size="xl" color="#3182CE" thickness="4px" />
          <Text color="#3182CE" fontSize="lg">
            Loading...
          </Text>
        </VStack>
      </Center>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

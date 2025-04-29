import type { User } from "@supabase/supabase-js";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { supabase } from "../lib/supabase-client";

interface AuthContextValue {
  user: User | null;
  isSignedIn: boolean;
  isLoading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("[Auth Event]:", event, session);

      switch (event) {
        case "INITIAL_SESSION":
          setUser(session?.user ?? null);
          setIsLoading(false);
          break;

        case "SIGNED_IN":
          setUser(session?.user ?? null);
          setIsLoading(false);
          toast.success("Signed in successfully!");
          navigate("/counters", { replace: true });
          break;

        case "SIGNED_OUT":
          setUser(null);
          setIsLoading(false);
          toast.success("Signed out successfully.");
          navigate("/sign-in", { replace: true });
          break;

        case "TOKEN_REFRESHED":
        case "USER_UPDATED":
          setUser(session?.user ?? null);
          break;

        default:
          console.warn("Unhandled auth event:", event);
          break;
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate]);

  const value = {
    user,
    isSignedIn: !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { useAuth };
export default AuthProvider;

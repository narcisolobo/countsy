import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../lib/supabase-client";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

function AuthCallbackPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function handleAuthRedirect() {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.substring(1)); // Remove the '#' and parse
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (!accessToken || !refreshToken) {
        toast.error("Invalid or expired sign-in link. Please try again.");
        navigate("/sign-in");
        return;
      }

      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (error) {
        console.error("Auth error:", error.message);
        toast.error("Sign-in failed. Please try again.");
        navigate("/sign-in");
      } else {
        toast.success("Signed in successfully!");
        navigate("/counters");
      }

      setLoading(false);
    }

    handleAuthRedirect();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Signing you in...</span>
      </div>
    );
  }

  return null;
}

export default AuthCallbackPage;

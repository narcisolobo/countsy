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
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");

      if (!code) {
        toast.error("Missing authorization code. Please try signing in again.");
        navigate("/sign-in");
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Auth error:", error.message);
        toast.error("Sign-in link expired or invalid. Please try again.");
        navigate("/sign-in");
      } else {
        toast.success("Signed in successfully!");
        navigate("/counters");
      }

      setLoading(false);
    }

    handleAuthRedirect();
  }, [navigate]);

  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center p-4 text-center">
      {loading ? (
        <>
          <Loader2 className="h-8 w-8 animate-spin" />
          <h2 className="mt-4 text-2xl font-bold">Signing you in...</h2>
        </>
      ) : null}
    </section>
  );
}

export default AuthCallbackPage;

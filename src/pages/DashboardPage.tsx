import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase-client";
import { useNavigate } from "react-router";

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUserEmail(session.user.email);
      } else {
        navigate("/signin");
      }

      setLoading(false);
    };

    getUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center p-4 text-center">
      <h1 className="mb-2 text-3xl font-bold">Welcome to Countsy 🎉</h1>
      <p className="text-base-content/70">
        You are signed in as <strong>{userEmail}</strong>
      </p>
    </div>
  );
}

export default DashboardPage;

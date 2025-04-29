import { useState } from "react";
import { supabase } from "../lib/supabase-client";

function SignInPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setMessage("Oops! Something went wrong: " + error.message);
    } else {
      setMessage("Check your email for a magic link!");
    }
  }

  async function handleSignInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Google sign-in error:", error.message);
    }
  }

  return (
    <div className="bg-base-200 flex min-h-[70vh] items-center justify-center p-4">
      <div className="card bg-base-100 w-full max-w-sm shadow-lg">
        <div className="card-body">
          <h1 className="text-center text-2xl font-bold">Sign in to Countsy</h1>

          <form onSubmit={handleSignIn} className="mt-4 space-y-4">
            <div className="form-control">
              <label className="label" htmlFor="email">
                <span className="label-text">Email</span>
              </label>
              <input
                id="email"
                type="email"
                required
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full ${loading ? "btn-disabled" : ""}`}
            >
              {loading ? "Sending..." : "Send Magic Link"}
            </button>

            {message && (
              <div className="text-success mt-2 text-center text-sm">
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
export default SignInPage;

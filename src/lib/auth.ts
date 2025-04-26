import { supabase } from "./supabase-client";
import toast from "react-hot-toast";

export async function handleSignOut(navigate: (path: string) => void) {
  const { error } = await supabase.auth.signOut();

  if (error) {
    toast.error("Oops! Logout failed.");
    console.error("Logout error:", error.message);
  } else {
    toast.success("Signed out successfully.");
    navigate("/sign-in");
  }
}

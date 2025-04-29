import { Loader2 } from "lucide-react";

function AuthCallbackPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
      <span className="ml-2">Signing you in...</span>
    </div>
  );
}

export default AuthCallbackPage;

import { Route, Routes, useNavigate } from "react-router";
import Drawer from "./components/layout/Drawer";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./guards/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import { handleSignOut } from "./lib/auth";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import CountersPage from "./pages/CountersPage";
import EditCounterPage from "./pages/EditCounterPage";
import LandingPage from "./pages/LandingPage";
import PrivacyPage from "./pages/PrivacyPage";
import SignInPage from "./pages/SignInPage";
import TermsPage from "./pages/TermsPage";
import type { DrawerItem } from "./types/types";

function App() {
  const { isSignedIn, isLoading } = useAuth();
  const navigate = useNavigate();

  const drawerItemsSignedIn: DrawerItem[] = [
    { label: "Counters", href: "/counters" },
    { label: "Settings", href: "/settings" },
    { label: "Sign out", onClick: () => handleSignOut(navigate) },
  ];

  const drawerItemsSignedOut: DrawerItem[] = [
    { label: "Sign in", href: "/sign-in" },
    { label: "Learn more", href: "/#features" },
  ];

  if (isLoading) return null;

  return (
    <Drawer items={isSignedIn ? drawerItemsSignedIn : drawerItemsSignedOut}>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route
          path="/counters"
          element={
            <ProtectedRoute>
              <CountersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/counters/:id/edit"
          element={
            <ProtectedRoute>
              <EditCounterPage />
            </ProtectedRoute>
          }
        />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Routes>
      <Footer />
    </Drawer>
  );
}

export default App;

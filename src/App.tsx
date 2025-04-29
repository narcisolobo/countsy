import { Route, Routes, useNavigate } from "react-router";
import { Fragment } from "react/jsx-runtime";
import Drawer from "./components/layout/Drawer";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import { useAuth } from "./hooks/useAuth";
import { handleSignOut } from "./lib/auth";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import CountersPage from "./pages/CountersPage";
import EditCounterPage from "./pages/EditCounterPage";
import LandingPage from "./pages/LandingPage";
import PrivacyPage from "./pages/PrivacyPage";
import SignInPage from "./pages/SignInPage";
import type { DrawerItem } from "./types/types";
import TermsPage from "./pages/TermsPage";

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
    <Fragment>
      <Drawer items={isSignedIn ? drawerItemsSignedIn : drawerItemsSignedOut}>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/counters" element={<CountersPage />} />
          <Route path="/counters/:id/edit" element={<EditCounterPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
        <Footer />
      </Drawer>
    </Fragment>
  );
}

export default App;

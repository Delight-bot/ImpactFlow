import { useState } from "react";
import Layout from "./components/layout/Layout";
import Overview from "./pages/Overview";
import Volunteers from "./pages/Volunteers";
import Beneficiaries from "./pages/Beneficiaries";
import Matches from "./pages/Matches";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import { AuthProvider, useAuth } from "./auth/AuthContext";

const PAGES = {
  overview: Overview,
  volunteers: Volunteers,
  beneficiaries: Beneficiaries,
  matches: Matches,
};

function Dashboard() {
  const [view, setView] = useState("overview");
  const Page = PAGES[view] ?? Overview;

  return (
    <Layout active={view} onNavigate={setView}>
      <Page onNavigate={setView} />
    </Layout>
  );
}

function Gate() {
  const { user, loading } = useAuth();
  const [publicView, setPublicView] = useState("landing");

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-slate-400">Loading…</div>;
  }

  if (user) return <Dashboard />;

  return publicView === "login" ? (
    <Login onBack={() => setPublicView("landing")} />
  ) : (
    <Landing onSignIn={() => setPublicView("login")} />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}

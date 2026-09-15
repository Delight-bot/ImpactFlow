import { useEffect, useMemo, useState } from "react";
import Card from "../components/ui/Card";
import Table from "../components/ui/Table";
import Badge from "../components/ui/Badge";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import { IconRefreshCw } from "../components/icons";
import { api } from "../api";
import { useAuth } from "../auth/AuthContext";

export default function Matches() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);
  const [summary, setSummary] = useState(null);

  function refresh() {
    setLoading(true);
    const isAdmin = user?.role === "admin";
    Promise.all([
      api.matches(),
      isAdmin ? api.volunteers() : Promise.resolve([]),
      isAdmin ? api.beneficiaries() : Promise.resolve([]),
    ])
      .then(([m, v, b]) => {
        setMatches(m);
        setVolunteers(v);
        setBeneficiaries(b);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(refresh, [user]);

  const volunteerName = useMemo(() => Object.fromEntries(volunteers.map((v) => [v.id, v.name])), [volunteers]);
  const beneficiaryName = useMemo(() => Object.fromEntries(beneficiaries.map((b) => [b.id, b.name])), [beneficiaries]);

  async function onGenerate() {
    setGenerating(true);
    setError("");
    setSummary(null);
    try {
      const result = await api.generateMatches();
      setSummary(result);
      refresh();
    } catch (err) {
      setError(err.message || "Could not generate matches.");
    } finally {
      setGenerating(false);
    }
  }

  async function onConfirm(matchId) {
    try {
      await api.updateMatch(matchId, "confirmed");
      refresh();
    } catch (err) {
      setError(err.message || "Could not update match.");
    }
  }

  const columns = [
    {
      key: "volunteer",
      header: "Volunteer",
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={volunteerName[row.volunteer_id] ?? `Volunteer #${row.volunteer_id}`} />
          <p className="font-medium text-slate-900">{volunteerName[row.volunteer_id] ?? `#${row.volunteer_id}`}</p>
        </div>
      ),
    },
    { key: "beneficiary", header: "Beneficiary", render: (row) => beneficiaryName[row.beneficiary_id] ?? `#${row.beneficiary_id}` },
    { key: "program", header: "Program", render: (row) => <span className="capitalize">{row.program}</span> },
    { key: "score", header: "Match Score", render: (row) => row.score.toFixed(1) },
    { key: "date", header: "Matched On" },
    { key: "status", header: "Status", render: (row) => <Badge status={row.status} /> },
    {
      key: "actions",
      header: "",
      render: (row) =>
        user?.role === "admin" && row.status === "proposed" ? (
          <button
            type="button"
            onClick={() => onConfirm(row.id)}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            Confirm
          </button>
        ) : null,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          {loading ? "Loading…" : `${matches.length} match${matches.length === 1 ? "" : "es"}`}
        </p>
        {user?.role === "admin" && (
          <Button variant="secondary" icon={IconRefreshCw} onClick={onGenerate} disabled={generating}>
            {generating ? "Matching…" : "Generate Matches"}
          </Button>
        )}
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      {summary && (
        <p className="rounded-lg bg-brand-50 px-4 py-3 text-sm text-brand-700 ring-1 ring-inset ring-brand-600/20">
          Created {summary.created.length} new match{summary.created.length === 1 ? "" : "es"}.
          {summary.unmatched_volunteers.length > 0 &&
            ` ${summary.unmatched_volunteers.length} volunteer${summary.unmatched_volunteers.length === 1 ? "" : "s"} left unmatched.`}
          {summary.unmatched_beneficiaries.length > 0 &&
            ` ${summary.unmatched_beneficiaries.length} beneficiar${summary.unmatched_beneficiaries.length === 1 ? "y" : "ies"} left unmatched.`}
        </p>
      )}

      <Card>
        <Table columns={columns} rows={matches} emptyLabel={loading ? "Loading…" : "No matches yet."} />
      </Card>
    </div>
  );
}

import { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import Table from "../components/ui/Table";
import Badge from "../components/ui/Badge";
import Avatar from "../components/ui/Avatar";
import StatCard from "../components/ui/StatCard";
import { IconUsers, IconHeart, IconCheckCircle, IconClock } from "../components/icons";
import { api } from "../api";
import { useAuth } from "../auth/AuthContext";

const volunteerColumns = [
  {
    key: "name",
    header: "Volunteer",
    render: (row) => (
      <div className="flex items-center gap-3">
        <Avatar name={row.name} className="size-8" />
        <p className="font-medium text-slate-900">{row.name}</p>
      </div>
    ),
  },
  { key: "skills", header: "Skills", render: (row) => row.skills.join(", ") || "—" },
  { key: "status", header: "Status", render: (row) => <Badge status={row.status} /> },
];

const beneficiaryColumns = [
  {
    key: "name",
    header: "Beneficiary",
    render: (row) => (
      <div className="flex items-center gap-3">
        <Avatar name={row.name} className="size-8" />
        <p className="font-medium text-slate-900">{row.name}</p>
      </div>
    ),
  },
  { key: "needs", header: "Needs", render: (row) => row.needs.join(", ") || "—" },
  { key: "status", header: "Status", render: (row) => <Badge status={row.status} /> },
];

export default function Overview({ onNavigate }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [volunteers, setVolunteers] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      isAdmin ? api.volunteers() : Promise.resolve([]),
      isAdmin ? api.beneficiaries() : Promise.resolve([]),
      api.matches(),
    ])
      .then(([v, b, m]) => {
        setVolunteers(v);
        setBeneficiaries(b);
        setMatches(m);
      })
      .finally(() => setLoading(false));
  }, [isAdmin]);

  const pendingVolunteers = volunteers.filter((v) => v.status === "pending" || v.status === "review");
  const pendingBeneficiaries = beneficiaries.filter((b) => b.status === "pending" || b.status === "review");
  const confirmedMatches = matches.filter((m) => m.status !== "proposed");

  const stats = [
    { id: "volunteers", label: "Active Volunteers", value: volunteers.length, icon: IconUsers },
    { id: "beneficiaries", label: "Beneficiaries Supported", value: beneficiaries.length, icon: IconHeart },
    { id: "matches", label: "Confirmed Matches", value: confirmedMatches.length, icon: IconCheckCircle },
    { id: "pending", label: "Pending Reviews", value: pendingVolunteers.length + pendingBeneficiaries.length, icon: IconClock },
  ];

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <Card title="Your Matches" subtitle="Confirmed and proposed pairings">
          <Table
            columns={[
              { key: "program", header: "Program", render: (row) => <span className="capitalize">{row.program}</span> },
              { key: "date", header: "Matched On" },
              { key: "status", header: "Status", render: (row) => <Badge status={row.status} /> },
            ]}
            rows={matches}
            emptyLabel={loading ? "Loading…" : "No matches yet."}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} icon={stat.icon} label={stat.label} value={loading ? "—" : stat.value} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card
          title="Volunteers"
          subtitle="Awaiting approval"
          action={
            <button type="button" onClick={() => onNavigate("volunteers")} className="text-sm font-medium text-brand-600 hover:text-brand-700">
              View all
            </button>
          }
        >
          <Table columns={volunteerColumns} rows={pendingVolunteers.slice(0, 4)} emptyLabel={loading ? "Loading…" : "Nothing pending."} />
        </Card>

        <Card
          title="Beneficiaries"
          subtitle="Awaiting approval"
          action={
            <button type="button" onClick={() => onNavigate("beneficiaries")} className="text-sm font-medium text-brand-600 hover:text-brand-700">
              View all
            </button>
          }
        >
          <Table columns={beneficiaryColumns} rows={pendingBeneficiaries.slice(0, 4)} emptyLabel={loading ? "Loading…" : "Nothing pending."} />
        </Card>
      </div>

      <Card
        title="Recent Matches"
        subtitle="Latest volunteer-beneficiary pairings"
        action={
          <button type="button" onClick={() => onNavigate("matches")} className="text-sm font-medium text-brand-600 hover:text-brand-700">
            View all
          </button>
        }
      >
        <Table
          columns={[
            { key: "program", header: "Program", render: (row) => <span className="capitalize">{row.program}</span> },
            { key: "date", header: "Matched On" },
            { key: "status", header: "Status", render: (row) => <Badge status={row.status} /> },
          ]}
          rows={matches.slice(0, 5)}
          emptyLabel={loading ? "Loading…" : "No matches yet."}
        />
      </Card>
    </div>
  );
}

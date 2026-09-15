import { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import Table from "../components/ui/Table";
import Badge from "../components/ui/Badge";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import { IconPlus } from "../components/icons";
import { api } from "../api";
import { useAuth } from "../auth/AuthContext";

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20";

const BACKGROUND_CHECK_OPTIONS = ["not_started", "in_review", "cleared", "failed"];

function buildColumns({ isAdmin, onApprove, onReject, onBackgroundCheckChange }) {
  const columns = [
    {
      key: "name",
      header: "Volunteer",
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} />
          <div>
            <p className="font-medium text-slate-900">{row.name}</p>
            <p className="text-xs text-slate-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: "skills", header: "Skills", render: (row) => row.skills.join(", ") || "—" },
    { key: "location", header: "Location" },
    { key: "applied", header: "Applied", render: (row) => new Date(row.applied).toLocaleDateString() },
    { key: "status", header: "Status", render: (row) => <Badge status={row.status} /> },
    {
      key: "backgroundCheck",
      header: "Background check",
      render: (row) =>
        isAdmin ? (
          <select
            value={row.background_check_status}
            onChange={(e) => onBackgroundCheckChange(row.id, e.target.value)}
            className="rounded-md border border-slate-200 bg-white py-1 pl-2 pr-6 text-xs font-medium text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            {BACKGROUND_CHECK_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt.replace("_", " ")}
              </option>
            ))}
          </select>
        ) : (
          <Badge status={row.background_check_status} />
        ),
    },
  ];

  if (isAdmin) {
    columns.push({
      key: "actions",
      header: "",
      render: (row) =>
        row.status === "pending" || row.status === "review" ? (
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => onApprove(row.id)} className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
              Approve
            </button>
            <button type="button" onClick={() => onReject(row.id)} className="text-xs font-semibold text-rose-600 hover:text-rose-700">
              Reject
            </button>
          </div>
        ) : null,
    });
  }

  return columns;
}

function AddVolunteerModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ name: "", email: "", location: "", skills: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api.createVolunteer({
        name: form.name,
        email: form.email,
        location: form.location,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      });
      onCreated();
      onClose();
    } catch (err) {
      setError(err.message || "Could not create volunteer.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title="Add Volunteer" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block text-sm font-medium text-slate-700">
          Name
          <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input className={inputClass} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Location
          <input className={inputClass} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Skills (comma separated)
          <input className={inputClass} value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="Mentorship, Tutoring" />
        </label>
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <Button type="submit" disabled={busy} className="w-full justify-center">
          {busy ? "Adding…" : "Add Volunteer"}
        </Button>
      </form>
    </Modal>
  );
}

export default function Volunteers() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  function refresh() {
    setLoading(true);
    api
      .volunteers()
      .then(setVolunteers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(refresh, []);

  async function setStatus(id, status) {
    try {
      await api.updateVolunteer(id, status);
      refresh();
    } catch (err) {
      setError(err.message || "Could not update volunteer.");
    }
  }

  async function setBackgroundCheck(id, status) {
    try {
      await api.updateBackgroundCheck(id, status);
      refresh();
    } catch (err) {
      setError(err.message || "Could not update background check status.");
    }
  }

  const columns = buildColumns({
    isAdmin,
    onApprove: (id) => setStatus(id, "approved"),
    onReject: (id) => setStatus(id, "rejected"),
    onBackgroundCheckChange: setBackgroundCheck,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          {loading ? "Loading…" : `${volunteers.length} volunteer${volunteers.length === 1 ? "" : "s"}`}
        </p>
        {isAdmin && (
          <Button icon={IconPlus} onClick={() => setShowAdd(true)}>
            Add Volunteer
          </Button>
        )}
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      {isAdmin && (
        <p className="text-xs text-slate-400">
          Background check status is attested by an admin after a real third-party check — it gates any match with a
          minor beneficiary, regardless of skill fit.
        </p>
      )}

      <Card>
        <Table columns={columns} rows={volunteers} emptyLabel={loading ? "Loading…" : "No volunteers yet."} />
      </Card>

      {showAdd && <AddVolunteerModal onClose={() => setShowAdd(false)} onCreated={refresh} />}
    </div>
  );
}

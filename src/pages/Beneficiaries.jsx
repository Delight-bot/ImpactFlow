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

function buildColumns({ isAdmin, onApprove, onReject }) {
  const columns = [
    {
      key: "name",
      header: "Beneficiary",
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} />
          <div className="flex items-center gap-2">
            <p className="font-medium text-slate-900">{row.name}</p>
            {row.is_minor && (
              <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700 ring-1 ring-inset ring-amber-600/20">
                Minor
              </span>
            )}
          </div>
        </div>
      ),
    },
    { key: "needs", header: "Needs", render: (row) => row.needs.join(", ") || "—" },
    { key: "location", header: "Location" },
    { key: "submitted", header: "Submitted", render: (row) => new Date(row.submitted).toLocaleDateString() },
    { key: "status", header: "Status", render: (row) => <Badge status={row.status} /> },
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

function AddBeneficiaryModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ name: "", location: "", needs: "", isMinor: false });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api.createBeneficiary({
        name: form.name,
        location: form.location,
        needs: form.needs.split(",").map((s) => s.trim()).filter(Boolean),
        is_minor: form.isMinor,
      });
      onCreated();
      onClose();
    } catch (err) {
      setError(err.message || "Could not create beneficiary.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title="Add Beneficiary" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block text-sm font-medium text-slate-700">
          Name
          <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Location
          <input className={inputClass} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Needs (comma separated)
          <input className={inputClass} value={form.needs} onChange={(e) => setForm({ ...form, needs: e.target.value })} placeholder="Housing Assistance, Job Placement" />
        </label>
        <label className="flex items-start gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            className="mt-0.5 size-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500/30"
            checked={form.isMinor}
            onChange={(e) => setForm({ ...form, isMinor: e.target.checked })}
          />
          <span>
            This beneficiary is a minor
            <span className="block text-xs text-slate-400">Only a volunteer with a cleared background check can be matched.</span>
          </span>
        </label>
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <Button type="submit" disabled={busy} className="w-full justify-center">
          {busy ? "Adding…" : "Add Beneficiary"}
        </Button>
      </form>
    </Modal>
  );
}

export default function Beneficiaries() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  function refresh() {
    setLoading(true);
    api
      .beneficiaries()
      .then(setBeneficiaries)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(refresh, []);

  async function setStatus(id, status) {
    try {
      await api.updateBeneficiary(id, status);
      refresh();
    } catch (err) {
      setError(err.message || "Could not update beneficiary.");
    }
  }

  const columns = buildColumns({
    isAdmin,
    onApprove: (id) => setStatus(id, "approved"),
    onReject: (id) => setStatus(id, "rejected"),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          {loading ? "Loading…" : `${beneficiaries.length} beneficiar${beneficiaries.length === 1 ? "y" : "ies"}`}
        </p>
        {isAdmin && (
          <Button icon={IconPlus} onClick={() => setShowAdd(true)}>
            Add Beneficiary
          </Button>
        )}
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <Card>
        <Table columns={columns} rows={beneficiaries} emptyLabel={loading ? "Loading…" : "No beneficiaries yet."} />
      </Card>

      {showAdd && <AddBeneficiaryModal onClose={() => setShowAdd(false)} onCreated={refresh} />}
    </div>
  );
}

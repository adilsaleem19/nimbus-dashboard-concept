import { useRef, useState, type ReactNode } from 'react';
import { PLANS } from '../data/mockData';
import type { Plan } from '../types';

const FIELD =
  'w-full rounded-lg border border-ink/10 bg-page px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 dark:border-white/10 dark:bg-page-dark dark:focus-visible:ring-accent-dark';

function Card({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-ink/10 bg-paper p-5 shadow-xs dark:border-white/10 dark:bg-paper-dark">
      <h2 className="font-display text-sm font-semibold">{title}</h2>
      <p className="mb-4 text-xs text-muted">{description}</p>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-ink-2 dark:text-ink-2-dark">{label}</span>
      {children}
    </label>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted">{description}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-accent dark:focus-visible:ring-accent-dark ${
          checked ? 'bg-accent dark:bg-accent-dark' : 'bg-ink/15 dark:bg-white/15'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

export default function SettingsView() {
  const [name, setName] = useState('Dana Reyes');
  const [email, setEmail] = useState('dana@nimbus.io');
  const [plan, setPlan] = useState<Plan>('Growth');
  const [billingEmail, setBillingEmail] = useState('billing@nimbus.io');
  const [digest, setDigest] = useState(true);
  const [churnAlerts, setChurnAlerts] = useState(true);
  const [productUpdates, setProductUpdates] = useState(false);
  const [saved, setSaved] = useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    if (savedTimer.current) clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      <Card title="Profile" description="Your account details across the workspace.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name">
            <input className={FIELD} value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Email">
            <input type="email" className={FIELD} value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Role">
            <input className={FIELD} value="Admin" disabled aria-describedby="role-note" />
          </Field>
        </div>
        <p id="role-note" className="mt-2 text-xs text-muted">
          Role changes are managed by your workspace owner.
        </p>
      </Card>

      <Card title="Plan & billing" description="Manage the plan this workspace is billed on.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Current plan">
            <select className={FIELD} value={plan} onChange={(e) => setPlan(e.target.value as Plan)}>
              {PLANS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Billing email">
            <input
              type="email"
              className={FIELD}
              value={billingEmail}
              onChange={(e) => setBillingEmail(e.target.value)}
            />
          </Field>
        </div>
      </Card>

      <Card title="Notifications" description="Choose which updates land in your inbox.">
        <div className="divide-y divide-ink/5 dark:divide-white/5">
          <Toggle checked={digest} onChange={setDigest} label="Weekly digest" description="A Monday summary of MRR, churn, and signups." />
          <Toggle checked={churnAlerts} onChange={setChurnAlerts} label="Churn alerts" description="Get notified when churn spikes above trend." />
          <Toggle checked={productUpdates} onChange={setProductUpdates} label="Product updates" description="Occasional news about new Nimbus features." />
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-page dark:bg-accent-dark dark:hover:bg-accent-dark/90 dark:focus-visible:ring-offset-page-dark"
        >
          Save changes
        </button>
        <span aria-live="polite" className="text-xs text-muted">
          {saved ? 'Saved — note: this demo doesn’t persist changes.' : ''}
        </span>
      </div>
    </form>
  );
}

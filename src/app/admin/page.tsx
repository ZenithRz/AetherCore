"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDiscordAuth } from "@/contexts/DiscordAuthProvider";
import { useLanguage } from "@/contexts/LanguageProvider";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Shield, Gamepad2, CalendarPlus, Users, Plus, Trash2, Image, X, Check, AlertCircle, ChevronDown, Volume2, Volume1, VolumeX } from "lucide-react";

type EventItem = {
  id: string; name: string; description: string; type: string; game: string; image: string;
  duration: number; maxPlayers: number; createdAt: string; createdBy: string;
};

type GameItem = {
  id: string; name: string; type: string; image: string; createdAt: string;
};

type SubAdmin = {
  serialNumber: string; discordId: string; name: string; addedAt: string; addedBy: string;
};

const EVENT_TYPES = ["Tournament", "Friendly Match", "Training / Scrim", "Competition", "Live Stream", "Community Night", "Special Event", "Launch Party", "Other"];
const GAME_TYPES = ["MOBA", "FPS", "Battle Royale", "Strategy", "Racing", "Sports", "Fighting", "RPG", "Open World", "Simulation", "Casual", "Party"];
const MAIN_ADMIN_SERIAL = "AC-KTVH-0X4960";

export default function AdminPage() {
  const { user, loading: authLoading } = useDiscordAuth();
  const { lang } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"events" | "games" | "admins">("events");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [games, setGames] = useState<GameItem[]>([]);
  const [admins, setAdmins] = useState<{ mainAdmin: string; subAdmins: SubAdmin[] } | null>(null);
  const [status, setStatus] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);
  const [isAllowed, setIsAllowed] = useState(false);
  const [isMain, setIsMain] = useState(false);
  const [checking, setChecking] = useState(true);

  const isRtl = lang === "ar";

  useEffect(() => {
    if (authLoading) return;
    if (!user?.serialNumber) { setChecking(false); return; }
    const sn = user.serialNumber;
    setIsMain(sn === MAIN_ADMIN_SERIAL);
    fetch("/api/admin/admins").then(r => r.json()).then(data => {
      setAdmins(data);
      setIsAllowed(data.mainAdmin === sn || data.subAdmins?.some((a: SubAdmin) => a.serialNumber === sn));
      setChecking(false);
    }).catch(() => { setIsAllowed(false); setChecking(false); });
    fetchEvents(); fetchGames();
  }, [user, authLoading]);

  function fetchEvents() { fetch("/api/admin/events").then(r => r.json()).then(setEvents).catch(() => {}); }
  function fetchGames() { fetch("/api/admin/games").then(r => r.json()).then(setGames).catch(() => {}); }
  function fetchAdmins() { fetch("/api/admin/admins").then(r => r.json()).then(setAdmins).catch(() => {}); }

  const showStatus = useCallback((type: "success" | "error" | "info", message: string) => {
    setStatus({ type, message });
    setTimeout(() => setStatus(null), 4000);
  }, []);

  async function api(url: string, method: string, body: object) {
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { showStatus("error", data.error || res.statusText); return false; }
      return true;
    } catch (e: unknown) {
      showStatus("error", `Network error`);
      return false;
    }
  }

  if (authLoading || checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-2 border-[var(--text-muted)] border-t-accent-platinum rounded-full" />
      </div>
    );
  }
  if (!user) return <Gate title="Access Denied" msg="You must log in with Discord to access the admin panel." />;
  if (!isAllowed) return <Gate title="Forbidden" msg="Your account does not have admin access." sub={user.serialNumber} />;

  const tabs = [
    { id: "events" as const, icon: CalendarPlus, label: isRtl ? "الإيفنتات" : "Events" },
    { id: "games" as const, icon: Gamepad2, label: isRtl ? "الألعاب" : "Games" },
    { id: "admins" as const, icon: Shield, label: isRtl ? "المشرفين" : "Admins" },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-accent-mauve/5 blur-[120px] animate-float-slower" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent-navy/5 blur-[120px] animate-float-slow" />
        </div>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative flex items-center gap-4 mb-8">
          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={() => router.push("/")}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--border)]/50 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-accent-platinum/30 transition-all"
          >
            <ArrowLeft className="w-4.5 h-4.5" style={{ transform: isRtl ? "scaleX(1)" : "none" }} />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-[family-name:var(--font-orbitron)] text-[var(--text-primary)]">
              {isRtl ? "لوحة التحكم" : "Admin Panel"}
            </h1>
            <p className="text-xs text-[var(--text-muted)] mt-0.5 font-mono">{user.serialNumber}</p>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)]/30">
            <img src={user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=32` : `https://cdn.discordapp.com/embed/avatars/${Number(user.id) % 5}.png`} alt="" className="w-7 h-7 rounded-full" />
            <span className="text-sm text-[var(--text-secondary)] hidden sm:block">{user.globalName || user.username}</span>
          </div>
        </motion.div>

        <div className="relative flex gap-1.5 mb-8 p-1.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)]/30 w-fit">
          {tabs.map((tab, i) => {
            const Icon = tab.icon;
            return (
              <motion.button key={tab.id} onClick={() => setActiveTab(tab.id)} layout
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className={`relative flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id ? "text-[var(--background)]" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div layoutId="tab-bg" className="absolute inset-0 rounded-xl bg-accent-platinum" transition={{ type: "spring", stiffness: 400, damping: 35 }} />
                )}
                <Icon className="w-4 h-4 relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "events" && (
            <EventsTab key="events" events={events} games={games} serial={user.serialNumber} api={api} onRefresh={fetchEvents} isRtl={isRtl} showStatus={showStatus} />
          )}
          {activeTab === "games" && (
            <GamesTab key="games" games={games} serial={user.serialNumber} api={api} onRefresh={fetchGames} isRtl={isRtl} showStatus={showStatus} />
          )}
          {activeTab === "admins" && (
            <AdminsTab key="admins" admins={admins} isMain={isMain} mySerial={user.serialNumber} api={api} onRefresh={fetchAdmins} isRtl={isRtl} showStatus={showStatus} />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {status && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm border shadow-xl backdrop-blur-md ${
              status.type === "success" ? "bg-green-500/10 border-green-500/30 text-green-400" :
              status.type === "error" ? "bg-red-500/10 border-red-500/30 text-red-400" :
              "bg-accent-platinum/10 border-accent-platinum/30 text-accent-platinum"
            }`}
          >
            {status.type === "success" ? <Check className="w-4 h-4" /> : status.type === "error" ? <AlertCircle className="w-4 h-4" /> : null}
            <span>{status.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Gate({ title, msg, sub }: { title: string; msg: string; sub?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] gap-4 px-4">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
        <Shield className="w-7 h-7 text-red-400" />
      </motion.div>
      <div className="text-2xl font-bold text-[var(--text-primary)]">{title}</div>
      <div className="text-[var(--text-muted)] text-center">{msg}</div>
      {sub && <div className="text-[var(--text-muted)] text-xs font-mono mt-2 opacity-60">{sub}</div>}
    </div>
  );
}

function InteractiveSelect({ label, value, options, onChange, other, isRtl }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void; other?: boolean; isRtl: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler); return () => document.removeEventListener("mousedown", handler);
  }, []);

  const allOptions = other ? ["", ...options] : options;

  return (
    <div ref={ref} className="relative">
      <label className="block text-xs text-[var(--text-muted)] mb-1.5">{label}</label>
      <motion.button type="button" onClick={() => setOpen(!open)}
        whileTap={{ scale: 0.99 }}
        className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]/50 text-sm text-[var(--text-primary)] hover:border-accent-platinum/30 transition-all"
      >
        <span className={!value ? "text-[var(--text-muted)]" : ""}>{value || (isRtl ? "-- اختر --" : "-- Select --")}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
        </motion.div>
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -6, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 top-full mt-1.5 left-0 right-0 max-h-48 overflow-y-auto rounded-xl bg-[var(--surface)] border border-[var(--border)]/50 shadow-xl shadow-dark-900/30 backdrop-blur-xl"
          >
            {allOptions.map((opt) => (
              <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-3.5 py-2.5 text-sm transition-all hover:bg-accent-platinum/5 ${
                  opt === value ? "text-accent-platinum bg-accent-platinum/10" : "text-[var(--text-secondary)]"
                } ${!opt ? "text-[var(--text-muted)] italic" : ""}`}
              >
                {opt || (isRtl ? "مخصص" : "Custom")}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FileUpload({ label, value, onChange, isRtl }: { label: string; value: string; onChange: (v: string) => void; isRtl: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(value || "");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert(isRtl ? "الصورة كبيرة جداً (الحد الأقصى 2MB)" : "Image too large (max 2MB)"); return; }
    const reader = new FileReader();
    reader.onload = () => { const result = reader.result as string; setPreview(result); onChange(result); };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label className="block text-xs text-[var(--text-muted)] mb-1.5">{label}</label>
      <div className="relative">
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <motion.button type="button" onClick={() => inputRef.current?.click()}
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl bg-[var(--surface)] border border-dashed border-[var(--border)]/50 hover:border-accent-platinum/30 text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-all"
        >
          <Image className="w-4 h-4 shrink-0" />
          <span className="truncate">{preview ? (isRtl ? "تم اختيار صورة" : "Image selected") : (isRtl ? "اختر صورة من جهازك" : "Upload from device")}</span>
        </motion.button>
      </div>
      <AnimatePresence>
        {preview && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="mt-2 relative rounded-xl overflow-hidden border border-[var(--border)]/30"
          >
            <img src={preview} alt="" className="w-full h-32 object-cover" />
            <motion.button type="button" onClick={() => { setPreview(""); onChange(""); }}
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-dark-900/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-red-500/60 transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StyledInput({ label, value, onChange, required, type, placeholder, isRtl }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string; placeholder?: string; isRtl?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs text-[var(--text-muted)] mb-1.5">{label}</label>
      <input type={type || "text"} value={value} onChange={(e) => onChange(e.target.value)} required={required} placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]/50 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-accent-platinum/40 focus:shadow-[0_0_0_3px_rgba(184,191,203,0.06)] transition-all"
        dir={isRtl ? "rtl" : "ltr"}
      />
    </div>
  );
}

function EventsTab({ events, games, serial, api, onRefresh, isRtl, showStatus }: {
  events: EventItem[]; games: GameItem[]; serial: string;
  api: (url: string, method: string, body: object) => Promise<boolean>;
  onRefresh: () => void; isRtl: boolean; showStatus: (t: "success" | "error" | "info", m: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", type: EVENT_TYPES[0], game: "", image: "", duration: 60, maxPlayers: 10 });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const ok = await api("/api/admin/events", "POST", { serial, ...form });
    setLoading(false);
    if (ok) {
      setShowForm(false);
      setForm({ name: "", description: "", type: EVENT_TYPES[0], game: "", image: "", duration: 60, maxPlayers: 10 });
      showStatus("success", isRtl ? "تم إنشاء الإيفنت" : "Event created");
      onRefresh();
    }
  }

  async function handleDelete(id: string) {
    setDeleteId(null);
    const ok = await api(`/api/admin/events/${id}`, "DELETE", { serial });
    if (ok) { showStatus("success", isRtl ? "تم حذف الإيفنت" : "Event deleted"); onRefresh(); }
  }

  return (
    <motion.div key="events" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">{isRtl ? "الإيفنتات" : "Events"} <span className="text-[var(--text-muted)] font-mono text-sm ml-1">{events.length}</span></h2>
        <motion.button onClick={() => setShowForm(!showForm)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-platinum/10 text-accent-platinum text-sm font-medium hover:bg-accent-platinum/20 transition-all border border-accent-platinum/20"
        >
          <Plus className="w-3.5 h-3.5" />
          {showForm ? (isRtl ? "إلغاء" : "Cancel") : isRtl ? "إيفنت جديد" : "New Event"}
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreate} className="overflow-hidden rounded-2xl bg-[var(--surface)] border border-[var(--border)]/30 p-5 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <StyledInput label={isRtl ? "الاسم" : "Name"} value={form.name} onChange={(v) => setForm({ ...form, name: v })} required isRtl={isRtl} />
              <InteractiveSelect label={isRtl ? "النوع" : "Type"} value={form.type} options={EVENT_TYPES} onChange={(v) => setForm({ ...form, type: v })} isRtl={isRtl} />
              <InteractiveSelect label={isRtl ? "اللعبة" : "Game"} value={form.game} options={games.map(g => g.name)} onChange={(v) => setForm({ ...form, game: v })} other isRtl={isRtl} />
              <InteractiveSelect label={isRtl ? "المدة (دقيقة)" : "Duration (min)"} value={String(form.duration)} options={["15","30","45","60","90","120","180","240"]} onChange={(v) => setForm({ ...form, duration: Number(v) })} isRtl={isRtl} />
              <StyledInput label={isRtl ? "الحد الأقصى للاعبين" : "Max Players"} type="number" value={String(form.maxPlayers)} onChange={(v) => setForm({ ...form, maxPlayers: Number(v) })} required isRtl={isRtl} />
              <FileUpload label={isRtl ? "صورة الإيفنت" : "Event Image"} value={form.image} onChange={(v) => setForm({ ...form, image: v })} isRtl={isRtl} />
            </div>
            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1.5">{isRtl ? "الوصف" : "Description"}</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]/50 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none resize-none focus:border-accent-platinum/40 transition-all"
                dir={isRtl ? "rtl" : "ltr"} />
            </div>
            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              className="w-full py-2.5 rounded-xl text-sm font-semibold bg-accent-platinum text-dark-900 hover:bg-accent-platinum/80 disabled:opacity-50 transition-all"
            >
              {loading ? (isRtl ? "جاري الإنشاء..." : "Creating...") : isRtl ? "إنشاء الإيفنت" : "Create Event"}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {events.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)]/30 flex items-center justify-center">
              <CalendarPlus className="w-5 h-5 text-[var(--text-muted)]" />
            </div>
            <p className="text-sm text-[var(--text-muted)]">{isRtl ? "لا توجد إيفنتات بعد" : "No events yet"}</p>
          </motion.div>
        )}
        {events.map((ev, i) => (
          <motion.div key={ev.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="group relative flex items-center gap-4 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]/20 hover:border-accent-platinum/20 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-accent-mauve/10 border border-accent-mauve/20 flex items-center justify-center shrink-0 overflow-hidden">
              {ev.image ? <img src={ev.image} alt="" className="w-full h-full object-cover" /> : <CalendarPlus className="w-5 h-5 text-accent-mauve" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-primary)] truncate">{ev.name}</p>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-[var(--text-muted)]">
                <span>{ev.type}</span>
                <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                <span>{ev.duration}{isRtl ? "د" : "min"}</span>
                <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                <span>{ev.game}</span>
              </div>
            </div>
            <motion.button onClick={() => setDeleteId(ev.id)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </motion.button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900/60 backdrop-blur-sm p-4"
            onClick={() => setDeleteId(null)}
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl bg-[var(--surface)] border border-[var(--border)]/30 p-6 shadow-2xl"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <p className="text-center text-sm text-[var(--text-primary)] mb-1">{isRtl ? "تأكيد الحذف" : "Confirm delete"}</p>
              <p className="text-center text-xs text-[var(--text-muted)] mb-6">{isRtl ? "لا يمكن التراجع عن هذا الإجراء" : "This action cannot be undone"}</p>
              <div className="flex gap-3">
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm bg-[var(--surface)] border border-[var(--border)]/30 text-[var(--text-secondary)] hover:border-[var(--border)]/60 transition-all"
                >{isRtl ? "إلغاء" : "Cancel"}</motion.button>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => handleDelete(deleteId)}
                  className="flex-1 py-2.5 rounded-xl text-sm bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
                >{isRtl ? "حذف" : "Delete"}</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function GamesTab({ games, serial, api, onRefresh, isRtl, showStatus }: {
  games: GameItem[]; serial: string;
  api: (url: string, method: string, body: object) => Promise<boolean>;
  onRefresh: () => void; isRtl: boolean; showStatus: (t: "success" | "error" | "info", m: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", type: GAME_TYPES[0], image: "" });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const ok = await api("/api/admin/games", "POST", { serial, ...form });
    setLoading(false);
    if (ok) {
      setShowForm(false); setForm({ name: "", type: GAME_TYPES[0], image: "" });
      showStatus("success", isRtl ? "تمت إضافة اللعبة" : "Game added"); onRefresh();
    }
  }

  async function handleDelete(id: string) {
    setDeleteId(null);
    const ok = await api(`/api/admin/games/${id}`, "DELETE", { serial });
    if (ok) { showStatus("success", isRtl ? "تم حذف اللعبة" : "Game deleted"); onRefresh(); }
  }

  return (
    <motion.div key="games" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">{isRtl ? "الألعاب" : "Games"} <span className="text-[var(--text-muted)] font-mono text-sm ml-1">{games.length}</span></h2>
        <motion.button onClick={() => setShowForm(!showForm)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-platinum/10 text-accent-platinum text-sm font-medium hover:bg-accent-platinum/20 transition-all border border-accent-platinum/20"
        >
          <Plus className="w-3.5 h-3.5" />
          {showForm ? (isRtl ? "إلغاء" : "Cancel") : isRtl ? "لعبة جديدة" : "New Game"}
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreate} className="overflow-hidden rounded-2xl bg-[var(--surface)] border border-[var(--border)]/30 p-5 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StyledInput label={isRtl ? "الاسم" : "Name"} value={form.name} onChange={(v) => setForm({ ...form, name: v })} required isRtl={isRtl} />
              <InteractiveSelect label={isRtl ? "النوع" : "Type"} value={form.type} options={GAME_TYPES} onChange={(v) => setForm({ ...form, type: v })} isRtl={isRtl} />
            </div>
            <FileUpload label={isRtl ? "صورة اللعبة" : "Game Image"} value={form.image} onChange={(v) => setForm({ ...form, image: v })} isRtl={isRtl} />
            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              className="w-full py-2.5 rounded-xl text-sm font-semibold bg-accent-platinum text-dark-900 hover:bg-accent-platinum/80 disabled:opacity-50 transition-all"
            >
              {loading ? (isRtl ? "جاري الإضافة..." : "Adding...") : isRtl ? "إضافة اللعبة" : "Add Game"}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {games.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)]/30 flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-[var(--text-muted)]" />
            </div>
            <p className="text-sm text-[var(--text-muted)]">{isRtl ? "لا توجد ألعاب بعد" : "No games yet"}</p>
          </div>
        )}
        {games.map((g, i) => (
          <motion.div key={g.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="group relative flex items-center gap-3 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]/20 hover:border-accent-platinum/20 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-accent-navy/10 border border-accent-navy/20 flex items-center justify-center shrink-0 overflow-hidden">
              {g.image ? <img src={g.image} alt="" className="w-full h-full object-cover" /> : <Gamepad2 className="w-4.5 h-4.5 text-accent-navy" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-primary)] truncate">{g.name}</p>
              <p className="text-xs text-[var(--text-muted)]">{g.type}</p>
            </div>
            <motion.button onClick={() => setDeleteId(g.id)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </motion.button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900/60 backdrop-blur-sm p-4"
            onClick={() => setDeleteId(null)}
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl bg-[var(--surface)] border border-[var(--border)]/30 p-6 shadow-2xl"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <p className="text-center text-sm text-[var(--text-primary)] mb-1">{isRtl ? "تأكيد الحذف" : "Confirm delete"}</p>
              <p className="text-center text-xs text-[var(--text-muted)] mb-6">{isRtl ? "لا يمكن التراجع عن هذا الإجراء" : "This action cannot be undone"}</p>
              <div className="flex gap-3">
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm bg-[var(--surface)] border border-[var(--border)]/30 text-[var(--text-secondary)] hover:border-[var(--border)]/60 transition-all"
                >{isRtl ? "إلغاء" : "Cancel"}</motion.button>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => handleDelete(deleteId)}
                  className="flex-1 py-2.5 rounded-xl text-sm bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
                >{isRtl ? "حذف" : "Delete"}</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function AdminsTab({ admins, isMain, mySerial, api, onRefresh, isRtl, showStatus }: {
  admins: { mainAdmin: string; subAdmins: SubAdmin[] } | null; isMain: boolean; mySerial: string;
  api: (url: string, method: string, body: object) => Promise<boolean>;
  onRefresh: () => void; isRtl: boolean; showStatus: (t: "success" | "error" | "info", m: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [targetSerial, setTargetSerial] = useState("");
  const [lookupResult, setLookupResult] = useState<{ name: string; status: "idle" | "checking" | "found" | "not_found" | "not_in_guild" }>({ name: "", status: "idle" });
  const lookupTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!targetSerial || targetSerial.length < 6 || isMain) {
      setLookupResult({ name: "", status: "idle" });
      return;
    }
    if (lookupTimer.current !== undefined) clearTimeout(lookupTimer.current);
    setLookupResult(prev => ({ ...prev, status: "checking" }));
    lookupTimer.current = setTimeout(() => {
      fetch("/api/admin/admins")
        .then(r => r.json())
        .then(data => {
          const found = data.subAdmins?.find((a: SubAdmin) => a.serialNumber === targetSerial);
          if (found) { setLookupResult({ name: found.name, status: "found" }); return; }
          setLookupResult({ name: "", status: "not_found" });
        })
        .catch(() => setLookupResult({ name: "", status: "not_found" }));
    }, 500);
    return () => { if (lookupTimer.current !== undefined) clearTimeout(lookupTimer.current); };
  }, [targetSerial, isMain]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const ok = await api("/api/admin/admins", "POST", { serial: mySerial, targetSerial });
    setLoading(false);
    if (ok) {
      setShowForm(false); setTargetSerial(""); setLookupResult({ name: "", status: "idle" });
      showStatus("success", isRtl ? "تمت إضافة المشرف" : "Admin added");
      onRefresh();
    }
  }

  async function handleRemove(serial: string) {
    const ok = await api(`/api/admin/admins/${serial}`, "DELETE", { requesterSerial: mySerial });
    if (ok) { showStatus("success", isRtl ? "تمت إزالة المشرف" : "Admin removed"); onRefresh(); }
  }

  return (
    <motion.div key="admins" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-4">
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent-mauve/5 via-transparent to-accent-navy/5 border border-accent-mauve/20 p-5"
      >
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-accent-mauve/5 blur-[80px]" />
        <p className="text-xs text-[var(--text-muted)] mb-1">{isRtl ? "المشرف الرئيسي" : "Main Admin"}</p>
        <p className="font-mono text-sm text-[var(--text-primary)]">{admins?.mainAdmin || "..."}</p>
      </motion.div>

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">{isRtl ? "المشرفون" : "Sub Admins"} <span className="text-[var(--text-muted)] font-mono text-sm ml-1">{(admins?.subAdmins || []).length}</span></h3>
        {isMain && (
          <motion.button onClick={() => setShowForm(!showForm)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-platinum/10 text-accent-platinum text-sm font-medium hover:bg-accent-platinum/20 transition-all border border-accent-platinum/20"
          >
            <Plus className="w-3.5 h-3.5" />
            {showForm ? (isRtl ? "إلغاء" : "Cancel") : isRtl ? "إضافة مشرف" : "Add Admin"}
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {showForm && isMain && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAdd} className="overflow-hidden rounded-2xl bg-[var(--surface)] border border-[var(--border)]/30 p-5 space-y-4"
          >
            <div className="relative">
              <StyledInput label={isRtl ? "الرقم التسلسلي" : "Serial Number"} value={targetSerial}
                onChange={(v) => setTargetSerial(v.toUpperCase())} required placeholder="AC-XXXX-0X####" isRtl={isRtl} />
              <AnimatePresence>
                {lookupResult.status === "checking" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="mt-2 flex items-center gap-2 text-xs text-[var(--text-muted)]"
                  >
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-3 h-3 border border-[var(--text-muted)] border-t-accent-platinum rounded-full"
                    />
                    {isRtl ? "جاري التحقق..." : "Checking..."}
                  </motion.div>
                )}
                {lookupResult.status === "found" && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mt-2 flex items-center gap-2 text-xs text-green-400"
                  >
                    <Check className="w-3 h-3" />
                    {isRtl ? "موجود: " : "Found: "}{lookupResult.name}
                  </motion.div>
                )}
                {lookupResult.status === "not_found" && targetSerial.length >= 6 && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mt-2 flex items-center gap-2 text-xs text-amber-400"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {isRtl ? " لم يسجل الدخول. يجب تسجيل الدخول أولاً" : "Not registered. User must log in first."}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {isRtl ? "⚠️ فقط الأشخاص المسجلين في السيرفر يمكن إضافتهم. أدخل الرقم التسلسلي وسيتم التحقق تلقائياً." : "⚠️ Only guild members can be added. Enter the serial number — validation is automatic."}
            </p>
            <motion.button type="submit" disabled={loading || lookupResult.status === "checking"} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              className="w-full py-2.5 rounded-xl text-sm font-semibold bg-accent-platinum text-dark-900 hover:bg-accent-platinum/80 disabled:opacity-50 transition-all"
            >
              {loading ? (isRtl ? "جاري الإضافة..." : "Adding...") : isRtl ? "إضافة المشرف" : "Add Sub Admin"}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {(admins?.subAdmins || []).length === 0 && (
          <div className="py-12 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)]/30 flex items-center justify-center">
              <Users className="w-5 h-5 text-[var(--text-muted)]" />
            </div>
            <p className="text-sm text-[var(--text-muted)]">{isRtl ? "لا يوجد مشرفون بعد" : "No sub-admins yet"}</p>
          </div>
        )}
        {(admins?.subAdmins || []).map((a, i) => (
          <motion.div key={a.serialNumber} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="group relative flex items-center gap-4 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]/20 hover:border-accent-platinum/20 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-accent-mauve/10 border border-accent-mauve/20 flex items-center justify-center shrink-0">
              <Shield className="w-4.5 h-4.5 text-accent-mauve" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-primary)]">{a.name}</p>
              <p className="text-xs text-[var(--text-muted)] font-mono">{a.serialNumber}</p>
            </div>
            {isMain && (
              <motion.button onClick={() => handleRemove(a.serialNumber)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

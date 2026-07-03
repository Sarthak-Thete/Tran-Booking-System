/**
 * RailBook — Train Booking Frontend
 * Stack: React + Bootstrap 5 (CDN) + custom CSS
 * Backend: Spring Boot REST API at http://localhost:8080/api
 *
 * For demo purposes, the app works in "mock mode" when the API is unreachable.
 */

import { useState, useEffect } from "react";

// ── Bootstrap 5 injected at runtime ─────────────────────────────────────────
const BOOTSTRAP_CSS = "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/css/bootstrap.min.css";
const BOOTSTRAP_ICONS = "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.3/font/bootstrap-icons.min.css";

// ── API base (change to your Spring Boot host) ───────────────────────────────
const API = "http://localhost:8080/api";

// ── Mock data (used when API is offline) ────────────────────────────────────
const MOCK_TRAINS = [
  { id: "T001", name: "Rajdhani Express", fromCity: "Mumbai", toCity: "Delhi",    departure: "06:00", arrival: "22:00", seats: 120, price: 1450, duration: "16h" },
  { id: "T002", name: "Shatabdi Express", fromCity: "Mumbai", toCity: "Pune",     departure: "07:30", arrival: "10:30", seats: 80,  price: 380,  duration: "3h" },
  { id: "T003", name: "Duronto Express",  fromCity: "Delhi",  toCity: "Kolkata",  departure: "08:15", arrival: "02:30", seats: 100, price: 1200, duration: "18h15m" },
  { id: "T004", name: "Garib Rath",       fromCity: "Chennai",toCity: "Bangalore",departure: "05:00", arrival: "11:00", seats: 200, price: 320,  duration: "6h" },
  { id: "T005", name: "Vande Bharat",     fromCity: "Delhi",  toCity: "Varanasi", departure: "06:00", arrival: "14:00", seats: 60,  price: 1750, duration: "8h" },
  { id: "T006", name: "Kerala Express",   fromCity: "Delhi",  toCity: "Trivandrum",departure:"11:35", arrival: "17:05", seats: 150, price: 1600, duration: "29.5h" },
];

const MOCK_USERS = [
  { id: "U001", username: "admin", password: "admin123", role: "ADMIN", name: "Admin User",    email: "admin@railbook.in" },
  { id: "U002", username: "rahul", password: "pass123",  role: "USER",  name: "Rahul Sharma",  email: "rahul@example.com" },
  { id: "U003", username: "priya", password: "pass123",  role: "USER",  name: "Priya Patel",   email: "priya@example.com" },
];

let MOCK_BOOKINGS = [
  { pnr: "PNR1001", userId: "U002", trainId: "T001", travelDate: "2026-07-15", passengers: 2, totalPrice: 2900, status: "CONFIRMED", bookedOn: "2026-06-20" },
  { pnr: "PNR1002", userId: "U003", trainId: "T004", travelDate: "2026-07-10", passengers: 1, totalPrice: 320,  status: "CONFIRMED", bookedOn: "2026-06-22" },
];

const CITIES = ["Mumbai","Delhi","Pune","Kolkata","Chennai","Bangalore","Varanasi","Trivandrum","Hyderabad","Ahmedabad"];

function genPNR() { return "PNR" + Math.floor(1000 + Math.random() * 9000); }

// ── Tiny API wrapper (falls back to mock if fetch fails) ─────────────────────
async function apiFetch(path, opts = {}) {
  try {
    const res = await fetch(API + path, {
      headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
      ...opts,
    });
    if (!res.ok) throw new Error(await res.text());
    return { ok: true, data: await res.json() };
  } catch {
    return { ok: false };
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [trains, setTrains]       = useState(MOCK_TRAINS);
  const [bookings, setBookings]   = useState(MOCK_BOOKINGS);
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage]           = useState("home");
  const [toast, setToast]         = useState(null);
  const [mockMode, setMockMode]   = useState(true); // true = API offline

  // Inject Bootstrap CSS once
  useEffect(() => {
    [BOOTSTRAP_CSS, BOOTSTRAP_ICONS].forEach(href => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const l = document.createElement("link");
        l.rel = "stylesheet"; l.href = href;
        document.head.appendChild(l);
      }
    });
    // Try to reach API
    apiFetch("/trains").then(r => {
      if (r.ok) { setTrains(r.data); setMockMode(false); }
    });
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const logout = () => { setCurrentUser(null); setPage("home"); showToast("Logged out."); };

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      <NavBar currentUser={currentUser} page={page} setPage={setPage} logout={logout} />

      {mockMode && (
        <div className="rb-mock-banner">
          <i className="bi bi-wifi-off me-2"></i>
          Running in demo mode — Spring Boot API not connected. All data is local.
        </div>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} />}

      <main className="rb-main">
        {page === "home"       && <HomePage setPage={setPage} currentUser={currentUser} />}
        {page === "login"      && <LoginPage setCurrentUser={setCurrentUser} setPage={setPage} showToast={showToast} mockMode={mockMode} />}
        {page === "register"   && <RegisterPage setPage={setPage} showToast={showToast} mockMode={mockMode} />}
        {page === "search"     && <SearchPage trains={trains} currentUser={currentUser} setPage={setPage} bookings={bookings} setBookings={setBookings} showToast={showToast} mockMode={mockMode} />}
        {page === "pnr"        && <PNRPage bookings={bookings} trains={trains} mockMode={mockMode} />}
        {page === "mybookings" && <MyBookingsPage bookings={bookings} trains={trains} currentUser={currentUser} />}
        {page === "admin"      && currentUser?.role === "ADMIN" && <AdminPage trains={trains} setTrains={setTrains} bookings={bookings} showToast={showToast} mockMode={mockMode} />}
      </main>

      <footer className="rb-footer">
        <span>© 2026 RailBook · India's simplest train booking</span>
      </footer>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// NAV
// ══════════════════════════════════════════════════════════════════════════════
function NavBar({ currentUser, page, setPage, logout }) {
  const [open, setOpen] = useState(false);

  const NavItem = ({ label, icon, pg }) => (
    <button
      className={`rb-nav-link ${page === pg ? "active" : ""}`}
      onClick={() => { setPage(pg); setOpen(false); }}
    >
      <i className={`bi ${icon} me-1`}></i>{label}
    </button>
  );

  return (
    <nav className="rb-nav">
      <div className="rb-nav-inner">
        {/* Brand */}
        <button className="rb-brand" onClick={() => setPage("home")}>
          <span className="rb-brand-icon"><i className="bi bi-train-front-fill"></i></span>
          RailBook
        </button>

        {/* Hamburger (mobile) */}
        <button className="rb-hamburger d-md-none" onClick={() => setOpen(o => !o)}>
          <i className={`bi ${open ? "bi-x-lg" : "bi-list"}`}></i>
        </button>

        {/* Links */}
        <div className={`rb-nav-links ${open ? "open" : ""}`}>
          {currentUser ? (
            <>
              <NavItem label="Search" icon="bi-search" pg="search" />
              <NavItem label="PNR" icon="bi-ticket-perforated" pg="pnr" />
              <NavItem label="My Bookings" icon="bi-bookmark-check" pg="mybookings" />
              {currentUser.role === "ADMIN" && <NavItem label="Admin" icon="bi-gear" pg="admin" />}
              <div className="rb-nav-divider d-md-none"></div>
              <div className="rb-nav-user">
                <div className="rb-avatar">{currentUser.name.charAt(0)}</div>
                <span className="rb-nav-username">{currentUser.name.split(" ")[0]}</span>
              </div>
              <button className="rb-nav-logout" onClick={logout}>
                <i className="bi bi-box-arrow-right me-1"></i>Logout
              </button>
            </>
          ) : (
            <>
              <NavItem label="Login" icon="bi-person" pg="login" />
              <button className="rb-nav-signup" onClick={() => { setPage("register"); setOpen(false); }}>
                <i className="bi bi-person-plus me-1"></i>Sign up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TOAST
// ══════════════════════════════════════════════════════════════════════════════
function Toast({ msg, type }) {
  const icon = type === "error" ? "bi-exclamation-circle-fill" : "bi-check-circle-fill";
  return (
    <div className={`rb-toast rb-toast-${type}`}>
      <i className={`bi ${icon} me-2`}></i>{msg}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// HOME
// ══════════════════════════════════════════════════════════════════════════════
function HomePage({ setPage, currentUser }) {
  const features = [
    { icon: "bi-shield-check",     title: "Secure booking",  desc: "PNR-verified tickets with instant confirmation" },
    { icon: "bi-lightning-charge", title: "Instant results", desc: "Search across all routes in milliseconds" },
    { icon: "bi-credit-card",      title: "Easy payment",    desc: "Multiple payment options supported" },
    { icon: "bi-headset",          title: "24/7 support",    desc: "Help whenever you need it" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="rb-hero">
        <div className="rb-hero-badge">
          <i className="bi bi-train-front me-2"></i>Indian Railways · Simplified
        </div>
        <h1 className="rb-hero-heading">
          Book your next<br />
          <span className="rb-hero-accent">train journey</span>
        </h1>
        <p className="rb-hero-sub">
          Search, book and manage rail tickets across India — in seconds.
        </p>
        <div className="rb-hero-actions">
          <button className="rb-btn-primary rb-btn-lg" onClick={() => setPage(currentUser ? "search" : "login")}>
            <i className="bi bi-search me-2"></i>Search trains
          </button>
          <button className="rb-btn-outline rb-btn-lg" onClick={() => setPage("pnr")}>
            <i className="bi bi-ticket-perforated me-2"></i>Check PNR
          </button>
        </div>
      </section>

      {/* Feature cards */}
      <section className="rb-section">
        <div className="row g-3">
          {features.map(f => (
            <div key={f.title} className="col-6 col-md-3">
              <div className="rb-feature-card">
                <div className="rb-feature-icon"><i className={`bi ${f.icon}`}></i></div>
                <h6 className="rb-feature-title">{f.title}</h6>
                <p className="rb-feature-desc">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular routes */}
      <section className="rb-section">
        <h2 className="rb-section-title">Popular routes</h2>
        <div className="row g-3">
          {MOCK_TRAINS.slice(0, 4).map(t => (
            <div key={t.id} className="col-12 col-md-6">
              <div className="rb-route-chip">
                <div>
                  <span className="rb-route-name">{t.name}</span>
                  <span className="rb-route-path">{t.fromCity} → {t.toCity}</span>
                </div>
                <div className="rb-route-price">₹{t.price.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// LOGIN
// ══════════════════════════════════════════════════════════════════════════════
function LoginPage({ setCurrentUser, setPage, showToast, mockMode }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [err, setErr]   = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (!form.username || !form.password) { setErr("Enter username and password."); return; }
    setLoading(true); setErr("");
    if (mockMode) {
      const u = MOCK_USERS.find(u => u.username === form.username && u.password === form.password);
      if (!u) { setErr("Invalid credentials."); setLoading(false); return; }
      setCurrentUser(u); setPage("search"); showToast(`Welcome back, ${u.name}!`);
    } else {
      const r = await apiFetch("/auth/login", { method: "POST", body: JSON.stringify(form) });
      if (!r.ok) { setErr("Invalid credentials."); setLoading(false); return; }
      setCurrentUser(r.data); setPage("search"); showToast(`Welcome back, ${r.data.name}!`);
    }
    setLoading(false);
  };

  return (
    <div className="rb-form-page">
      <div className="rb-form-card">
        <div className="rb-form-header">
          <div className="rb-form-icon"><i className="bi bi-person-circle"></i></div>
          <h2 className="rb-form-title">Log in</h2>
          <p className="rb-form-sub">Welcome back to RailBook</p>
        </div>

        <Field label="Username" value={form.username} onChange={v => setForm(p => ({...p, username: v}))} placeholder="your_username" icon="bi-person" />
        <Field label="Password" value={form.password} onChange={v => setForm(p => ({...p, password: v}))} placeholder="••••••••" type="password" icon="bi-lock" />

        {err && <div className="rb-error"><i className="bi bi-exclamation-triangle me-2"></i>{err}</div>}

        <button className="rb-btn-primary w-100 mt-2" onClick={handle} disabled={loading}>
          {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Logging in…</> : <><i className="bi bi-box-arrow-in-right me-2"></i>Log in</>}
        </button>

        <p className="rb-form-switch">No account? <button className="rb-link" onClick={() => setPage("register")}>Sign up</button></p>

        <div className="rb-demo-hint">
          <i className="bi bi-info-circle me-1"></i>
          Demo: <strong>admin / admin123</strong> · <strong>rahul / pass123</strong>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// REGISTER
// ══════════════════════════════════════════════════════════════════════════════
function RegisterPage({ setPage, showToast, mockMode }) {
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [err, setErr]   = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (!form.name || !form.username || !form.email || !form.password) { setErr("All fields are required."); return; }
    setLoading(true); setErr("");
    if (mockMode) {
      if (MOCK_USERS.find(u => u.username === form.username)) { setErr("Username taken."); setLoading(false); return; }
      MOCK_USERS.push({ id: "U" + Date.now(), ...form, role: "USER" });
      showToast("Account created. Log in to continue."); setPage("login");
    } else {
      const r = await apiFetch("/auth/register", { method: "POST", body: JSON.stringify(form) });
      if (!r.ok) { setErr("Username or email already taken."); setLoading(false); return; }
      showToast("Account created. Log in to continue."); setPage("login");
    }
    setLoading(false);
  };

  return (
    <div className="rb-form-page">
      <div className="rb-form-card">
        <div className="rb-form-header">
          <div className="rb-form-icon"><i className="bi bi-person-plus"></i></div>
          <h2 className="rb-form-title">Create account</h2>
          <p className="rb-form-sub">Start booking in minutes</p>
        </div>

        <Field label="Full name"  value={form.name}     onChange={v => setForm(p=>({...p,name:v}))}     placeholder="Rahul Sharma"        icon="bi-person" />
        <Field label="Username"   value={form.username}  onChange={v => setForm(p=>({...p,username:v}))} placeholder="rahul123"             icon="bi-at" />
        <Field label="Email"      value={form.email}     onChange={v => setForm(p=>({...p,email:v}))}    placeholder="rahul@example.com"    icon="bi-envelope" type="email" />
        <Field label="Password"   value={form.password}  onChange={v => setForm(p=>({...p,password:v}))} placeholder="••••••••"             icon="bi-lock"     type="password" />

        {err && <div className="rb-error"><i className="bi bi-exclamation-triangle me-2"></i>{err}</div>}

        <button className="rb-btn-primary w-100 mt-2" onClick={handle} disabled={loading}>
          {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Creating…</> : <><i className="bi bi-person-check me-2"></i>Create account</>}
        </button>

        <p className="rb-form-switch">Already registered? <button className="rb-link" onClick={() => setPage("login")}>Log in</button></p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SEARCH
// ══════════════════════════════════════════════════════════════════════════════
function SearchPage({ trains, currentUser, setPage, bookings, setBookings, showToast, mockMode }) {
  const [from, setFrom]           = useState("");
  const [to, setTo]               = useState("");
  const [date, setDate]           = useState("");
  const [results, setResults]     = useState(null);
  const [booking, setBooking]     = useState(null);
  const [passengers, setPassengers] = useState(1);
  const [loading, setLoading]     = useState(false);
  const [confirming, setConfirming] = useState(false);

  if (!currentUser) {
    return (
      <div className="rb-locked">
        <i className="bi bi-lock-fill rb-locked-icon"></i>
        <h4>Login required</h4>
        <p>Log in to search and book trains.</p>
        <button className="rb-btn-primary" onClick={() => setPage("login")}>Log in</button>
      </div>
    );
  }

  const search = async () => {
    if (!from || !to) { showToast("Select origin and destination.", "error"); return; }
    if (from === to)  { showToast("Origin and destination must differ.", "error"); return; }
    setLoading(true);
    if (mockMode) {
      setResults(trains.filter(t => t.fromCity === from && t.toCity === to));
    } else {
      const r = await apiFetch(`/trains/search?from=${from}&to=${to}`);
      setResults(r.ok ? r.data : trains.filter(t => t.fromCity === from && t.toCity === to));
    }
    setLoading(false);
  };

  const confirmBooking = async () => {
    setConfirming(true);
    const payload = {
      userId: currentUser.id, trainId: booking.id,
      travelDate: date || "2026-07-20", passengers,
    };
    if (mockMode) {
      const pnr = genPNR();
      const nb = { pnr, ...payload, totalPrice: booking.price * passengers, status: "CONFIRMED", bookedOn: new Date().toISOString().slice(0,10) };
      MOCK_BOOKINGS = [...MOCK_BOOKINGS, nb];
      setBookings(MOCK_BOOKINGS);
      showToast(`Booked! PNR: ${pnr}`); setBooking(null); setPage("mybookings");
    } else {
      const r = await apiFetch("/bookings", { method: "POST", body: JSON.stringify(payload) });
      if (r.ok) { setBookings(p => [...p, r.data]); showToast(`Booked! PNR: ${r.data.pnr}`); setBooking(null); setPage("mybookings"); }
      else showToast("Booking failed. Try again.", "error");
    }
    setConfirming(false);
  };

  return (
    <div>
      <h2 className="rb-page-title">Search trains</h2>

      {/* Search form */}
      <div className="rb-search-card">
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-3">
            <label className="rb-label">From</label>
            <select className="rb-select" value={from} onChange={e => setFrom(e.target.value)}>
              <option value="">Select city</option>
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="col-auto d-none d-md-flex align-items-end pb-1">
            <button className="rb-swap-btn" onClick={() => { const t=from; setFrom(to); setTo(t); }}>
              <i className="bi bi-arrow-left-right"></i>
            </button>
          </div>
          <div className="col-12 col-md-3">
            <label className="rb-label">To</label>
            <select className="rb-select" value={to} onChange={e => setTo(e.target.value)}>
              <option value="">Select city</option>
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="col-12 col-md-3">
            <label className="rb-label">Date</label>
            <input type="date" className="rb-input" value={date} onChange={e => setDate(e.target.value)}
              min={new Date().toISOString().slice(0,10)} />
          </div>
          <div className="col-12 col-md-2">
            <button className="rb-btn-primary w-100" onClick={search} disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm"></span> : <><i className="bi bi-search me-1"></i>Search</>}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {results !== null && (
        <div className="mt-4">
          {results.length === 0 ? (
            <div className="rb-empty">
              <i className="bi bi-train-front rb-empty-icon"></i>
              <p>No trains found for this route.</p>
            </div>
          ) : (
            <div>
              <p className="rb-results-count">{results.length} train{results.length > 1 ? "s" : ""} found</p>
              <div className="d-flex flex-column gap-3">
                {results.map(t => <TrainCard key={t.id} train={t} onBook={() => setBooking(t)} />)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Booking modal */}
      {booking && (
        <Modal title="Confirm booking" onClose={() => setBooking(null)}>
          <div className="rb-modal-train-info">
            <span className="rb-train-badge">{booking.id}</span>
            <strong>{booking.name}</strong>
            <p className="mb-0 mt-1 rb-text-muted small">{booking.fromCity} → {booking.toCity} · {booking.departure} – {booking.arrival}</p>
          </div>
          <div className="mt-3">
            <label className="rb-label">Passengers</label>
            <div className="rb-passenger-ctrl">
              <button onClick={() => setPassengers(p => Math.max(1, p-1))}><i className="bi bi-dash"></i></button>
              <span>{passengers}</span>
              <button onClick={() => setPassengers(p => Math.min(6, p+1))}><i className="bi bi-plus"></i></button>
            </div>
          </div>
          <div className="rb-price-summary mt-3">
            <div className="d-flex justify-content-between">
              <span className="rb-text-muted">Fare per person</span>
              <span>₹{booking.price.toLocaleString()}</span>
            </div>
            <div className="d-flex justify-content-between mt-1">
              <span className="rb-text-muted">Passengers</span>
              <span>× {passengers}</span>
            </div>
            <hr className="my-2" />
            <div className="d-flex justify-content-between">
              <strong>Total</strong>
              <strong className="rb-accent-text">₹{(booking.price * passengers).toLocaleString()}</strong>
            </div>
          </div>
          <button className="rb-btn-primary w-100 mt-3" onClick={confirmBooking} disabled={confirming}>
            {confirming ? <><span className="spinner-border spinner-border-sm me-2"></span>Booking…</> : <><i className="bi bi-check-lg me-2"></i>Confirm booking</>}
          </button>
        </Modal>
      )}
    </div>
  );
}

function TrainCard({ train, onBook }) {
  return (
    <div className="rb-train-card">
      <div className="rb-train-card-left">
        <div className="rb-train-head">
          <span className="rb-train-name">{train.name}</span>
          <span className="rb-train-id-badge">{train.id}</span>
        </div>
        <div className="rb-train-route">
          <div className="rb-time-col">
            <span className="rb-time">{train.departure}</span>
            <span className="rb-city">{train.fromCity}</span>
          </div>
          <div className="rb-route-line">
            <span className="rb-route-dot"></span>
            <span className="rb-route-track"></span>
            <span className="rb-duration-label">{train.duration}</span>
            <span className="rb-route-track"></span>
            <span className="rb-route-dot"></span>
          </div>
          <div className="rb-time-col rb-time-col-right">
            <span className="rb-time">{train.arrival}</span>
            <span className="rb-city">{train.toCity}</span>
          </div>
        </div>
        <p className="rb-seats-info">
          <i className="bi bi-people me-1"></i>{train.seats} seats available
        </p>
      </div>
      <div className="rb-train-card-right">
        <p className="rb-train-price">₹{train.price.toLocaleString()}</p>
        <span className="rb-per-person">per person</span>
        <button className="rb-btn-primary rb-btn-book mt-2" onClick={onBook}>Book</button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PNR
// ══════════════════════════════════════════════════════════════════════════════
function PNRPage({ bookings, trains, mockMode }) {
  const [pnr, setPnr]       = useState("");
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!pnr.trim()) return;
    setLoading(true);
    if (mockMode) {
      setResult(bookings.find(b => b.pnr === pnr.trim().toUpperCase()) || null);
    } else {
      const r = await apiFetch(`/bookings/pnr/${pnr.trim().toUpperCase()}`);
      setResult(r.ok ? r.data : null);
    }
    setSearched(true); setLoading(false);
  };

  const train = result ? trains.find(t => t.id === result.trainId) : null;

  return (
    <div className="rb-narrow-page">
      <h2 className="rb-page-title">PNR Status</h2>

      <div className="rb-card">
        <label className="rb-label">PNR Number</label>
        <div className="d-flex gap-2 mt-1">
          <input
            className="rb-input flex-grow-1"
            value={pnr}
            onChange={e => setPnr(e.target.value)}
            placeholder="e.g. PNR1001"
            onKeyDown={e => e.key === "Enter" && search()}
          />
          <button className="rb-btn-primary" onClick={search} disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm"></span> : "Check"}
          </button>
        </div>
      </div>

      {searched && (
        <div className="mt-4">
          {!result ? (
            <div className="rb-pnr-not-found">
              <i className="bi bi-x-circle-fill rb-pnr-icon text-danger"></i>
              <p className="mb-0">No booking found for <strong>{pnr.toUpperCase()}</strong>.</p>
            </div>
          ) : (
            <div className="rb-pnr-result">
              <div className="rb-pnr-header">
                <i className="bi bi-check-circle-fill me-2"></i>
                <span>{result.status}</span>
                <span className="rb-pnr-number ms-auto">{result.pnr}</span>
              </div>
              <div className="rb-card-body-p">
                <InfoRow label="Train"       value={train?.name || result.trainId} />
                <InfoRow label="Route"       value={`${train?.fromCity} → ${train?.toCity}`} />
                <InfoRow label="Travel date" value={result.travelDate} />
                <InfoRow label="Passengers"  value={result.passengers} />
                <InfoRow label="Total fare"  value={`₹${result.totalPrice.toLocaleString()}`} accent />
                <InfoRow label="Booked on"   value={result.bookedOn} last />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MY BOOKINGS
// ══════════════════════════════════════════════════════════════════════════════
function MyBookingsPage({ bookings, trains, currentUser }) {
  if (!currentUser) return (
    <div className="rb-locked">
      <i className="bi bi-lock-fill rb-locked-icon"></i>
      <p>Log in to view your bookings.</p>
    </div>
  );

  const myBookings = bookings.filter(b => b.userId === currentUser.id);

  return (
    <div>
      <h2 className="rb-page-title">My Bookings</h2>
      {myBookings.length === 0 ? (
        <div className="rb-empty">
          <i className="bi bi-bookmark-x rb-empty-icon"></i>
          <p>No bookings yet. Start by searching for a train!</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {myBookings.map(b => {
            const t = trains.find(tr => tr.id === b.trainId);
            return (
              <div key={b.pnr} className="rb-booking-card">
                <div className="rb-booking-top">
                  <div>
                    <span className="rb-train-name">{t?.name || b.trainId}</span>
                    <span className="rb-status-badge ms-2">{b.status}</span>
                  </div>
                  <div className="rb-booking-price">₹{b.totalPrice.toLocaleString()}</div>
                </div>
                <div className="rb-booking-route">
                  <span>{t?.fromCity}</span>
                  <i className="bi bi-arrow-right mx-2 rb-text-muted"></i>
                  <span>{t?.toCity}</span>
                  <span className="rb-text-muted mx-2">·</span>
                  <span>{b.travelDate}</span>
                </div>
                <div className="rb-booking-meta">
                  <span><i className="bi bi-ticket-perforated me-1"></i>{b.pnr}</span>
                  <span><i className="bi bi-people me-1"></i>{b.passengers} passenger{b.passengers > 1 ? "s" : ""}</span>
                  <span className="rb-text-muted">Booked {b.bookedOn}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN
// ══════════════════════════════════════════════════════════════════════════════
function AdminPage({ trains, setTrains, bookings, showToast, mockMode }) {
  const [tab, setTab]   = useState("trains");
  const [form, setForm] = useState({ id:"", name:"", fromCity:"", toCity:"", departure:"", arrival:"", duration:"", seats:"", price:"" });
  const [formErr, setFormErr] = useState("");

  const addTrain = async () => {
    if (!form.id||!form.name||!form.fromCity||!form.toCity||!form.departure||!form.arrival||!form.seats||!form.price)
      { setFormErr("All fields are required."); return; }
    const payload = { ...form, seats: parseInt(form.seats), price: parseInt(form.price) };
    if (mockMode) {
      if (trains.find(t=>t.id===form.id)) { setFormErr("Train ID already exists."); return; }
      setTrains(p=>[...p, payload]);
    } else {
      const r = await apiFetch("/trains", { method:"POST", body: JSON.stringify(payload) });
      if (!r.ok) { setFormErr("Failed to add train."); return; }
      setTrains(p=>[...p, r.data]);
    }
    setForm({ id:"",name:"",fromCity:"",toCity:"",departure:"",arrival:"",duration:"",seats:"",price:"" });
    setFormErr(""); showToast("Train added.");
  };

  const deleteTrain = async id => {
    if (mockMode) { setTrains(p=>p.filter(t=>t.id!==id)); }
    else { const r = await apiFetch(`/trains/${id}`,{method:"DELETE"}); if(!r.ok) { showToast("Delete failed.","error"); return; } setTrains(p=>p.filter(t=>t.id!==id)); }
    showToast("Train removed.");
  };

  const stats = [
    { icon:"bi-train-front", label:"Trains",   value: trains.length },
    { icon:"bi-ticket",      label:"Bookings",  value: bookings.length },
    { icon:"bi-currency-rupee", label:"Revenue", value: "₹" + bookings.reduce((s,b)=>s+b.totalPrice,0).toLocaleString() },
  ];

  const tabs = ["trains","add_train"];

  return (
    <div>
      <h2 className="rb-page-title">Admin Panel</h2>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {stats.map(s => (
          <div key={s.label} className="col-4">
            <div className="rb-stat-card">
              <i className={`bi ${s.icon} rb-stat-icon`}></i>
              <div className="rb-stat-value">{s.value}</div>
              <div className="rb-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="rb-tabs mb-4">
        {tabs.map(t => (
          <button key={t} className={`rb-tab ${tab===t?"active":""}`} onClick={() => setTab(t)}>
            {t === "trains" ? <><i className="bi bi-list-ul me-1"></i>Trains</> : <><i className="bi bi-plus-circle me-1"></i>Add train</>}
          </button>
        ))}
      </div>

      {/* Manage trains */}
      {tab === "trains" && (
        <div className="d-flex flex-column gap-3">
          {trains.map(t => (
            <div key={t.id} className="rb-admin-train-row">
              <div>
                <span className="rb-train-name">{t.name}</span>
                <span className="rb-train-id-badge ms-2">{t.id}</span>
                <p className="rb-text-muted small mb-0 mt-1">
                  {t.fromCity} → {t.toCity} · ₹{t.price.toLocaleString()} · {t.seats} seats
                </p>
              </div>
              <button className="rb-btn-danger" onClick={() => deleteTrain(t.id)}>
                <i className="bi bi-trash me-1"></i>Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add train */}
      {tab === "add_train" && (
        <div className="rb-card">
          <div className="row g-3">
            {[
              ["Train ID","id","T007"], ["Train name","name","Express name"],
              ["From","fromCity","Mumbai"], ["To","toCity","Delhi"],
              ["Departure","departure","06:00"], ["Arrival","arrival","22:00"],
              ["Duration","duration","16h"], ["Seats","seats","120","number"],
              ["Price (₹)","price","1450","number"],
            ].map(([label, key, ph, type="text"]) => (
              <div key={key} className="col-12 col-md-4">
                <label className="rb-label">{label}</label>
                <input type={type} className="rb-input" placeholder={ph} value={form[key]} onChange={e => setForm(p=>({...p,[key]:e.target.value}))} />
              </div>
            ))}
          </div>
          {formErr && <div className="rb-error mt-2"><i className="bi bi-exclamation-triangle me-1"></i>{formErr}</div>}
          <button className="rb-btn-primary mt-3" onClick={addTrain}>
            <i className="bi bi-plus-lg me-2"></i>Add train
          </button>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// REUSABLE COMPONENTS
// ══════════════════════════════════════════════════════════════════════════════
function Field({ label, value, onChange, type="text", placeholder, icon }) {
  return (
    <div className="mb-3">
      <label className="rb-label">{label}</label>
      <div className="rb-input-group">
        {icon && <span className="rb-input-icon"><i className={`bi ${icon}`}></i></span>}
        <input
          type={type}
          className={`rb-input ${icon ? "has-icon" : ""}`}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

function InfoRow({ label, value, accent, last }) {
  return (
    <div className={`rb-info-row ${last ? "last" : ""}`}>
      <span className="rb-text-muted">{label}</span>
      <span className={accent ? "rb-accent-text fw-semibold" : "fw-medium"}>{value}</span>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="rb-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="rb-modal">
        <div className="rb-modal-header">
          <h5 className="mb-0">{title}</h5>
          <button className="rb-modal-close" onClick={onClose}><i className="bi bi-x-lg"></i></button>
        </div>
        <div className="rb-modal-body">{children}</div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// GLOBAL CSS
// ══════════════════════════════════════════════════════════════════════════════
const GLOBAL_CSS = `
  /* ── Design tokens ─────────────────────────────── */
  :root {
    --rb-bg:        #f0f4ff;
    --rb-surface:   #ffffff;
    --rb-surface-2: #f8faff;
    --rb-border:    #e2e8f8;
    --rb-accent:    #2563eb;
    --rb-accent-h:  #1d4ed8;
    --rb-accent-lt: #eff6ff;
    --rb-green:     #16a34a;
    --rb-green-lt:  #f0fdf4;
    --rb-red:       #dc2626;
    --rb-red-lt:    #fef2f2;
    --rb-text:      #0f172a;
    --rb-text-2:    #475569;
    --rb-text-3:    #94a3b8;
    --rb-shadow:    0 1px 3px rgba(0,0,0,.08), 0 4px 16px rgba(37,99,235,.06);
    --rb-shadow-lg: 0 4px 24px rgba(37,99,235,.12);
    --rb-radius:    12px;
    --rb-radius-sm: 8px;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background: var(--rb-bg);
    color: var(--rb-text);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  /* ── Nav ───────────────────────────────────────── */
  .rb-nav {
    background: var(--rb-surface);
    border-bottom: 1px solid var(--rb-border);
    position: sticky; top: 0; z-index: 100;
    box-shadow: 0 1px 0 var(--rb-border);
  }
  .rb-nav-inner {
    max-width: 1100px; margin: 0 auto;
    padding: 0 20px;
    display: flex; align-items: center; justify-content: space-between;
    height: 60px;
  }
  .rb-brand {
    display: flex; align-items: center; gap: 10px;
    background: none; border: none; cursor: pointer;
    font-size: 18px; font-weight: 700; color: var(--rb-text);
    letter-spacing: -.3px;
  }
  .rb-brand-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: var(--rb-accent); color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
  }
  .rb-nav-links {
    display: flex; align-items: center; gap: 4px;
  }
  .rb-nav-link {
    background: none; border: none; cursor: pointer;
    padding: 7px 12px; border-radius: var(--rb-radius-sm);
    font-size: 14px; color: var(--rb-text-2);
    transition: all .15s;
  }
  .rb-nav-link:hover { background: var(--rb-surface-2); color: var(--rb-text); }
  .rb-nav-link.active { background: var(--rb-accent-lt); color: var(--rb-accent); font-weight: 600; }
  .rb-nav-user {
    display: flex; align-items: center; gap: 8px;
    padding: 4px 10px; border-radius: 50px;
    border: 1px solid var(--rb-border);
    font-size: 13px; color: var(--rb-text-2);
  }
  .rb-nav-username { font-size: 13px; font-weight: 500; color: var(--rb-text); }
  .rb-avatar {
    width: 28px; height: 28px; border-radius: 50%;
    background: var(--rb-accent); color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700;
  }
  .rb-nav-logout {
    background: none; border: 1px solid var(--rb-border);
    border-radius: var(--rb-radius-sm); padding: 6px 12px;
    font-size: 13px; color: var(--rb-text-2); cursor: pointer;
    transition: all .15s;
  }
  .rb-nav-logout:hover { border-color: var(--rb-red); color: var(--rb-red); }
  .rb-nav-signup {
    background: var(--rb-accent); color: #fff; border: none;
    border-radius: var(--rb-radius-sm); padding: 7px 14px;
    font-size: 14px; font-weight: 600; cursor: pointer;
    transition: background .15s;
  }
  .rb-nav-signup:hover { background: var(--rb-accent-h); }
  .rb-hamburger {
    background: none; border: 1px solid var(--rb-border);
    border-radius: var(--rb-radius-sm); padding: 6px 10px;
    font-size: 18px; cursor: pointer; color: var(--rb-text);
  }
  @media (max-width: 767px) {
    .rb-nav-links { display: none; flex-direction: column; align-items: stretch;
      position: absolute; top: 60px; left: 0; right: 0;
      background: var(--rb-surface); border-bottom: 1px solid var(--rb-border);
      padding: 12px 16px; gap: 6px; }
    .rb-nav-links.open { display: flex; }
    .rb-nav-divider { border-top: 1px solid var(--rb-border); margin: 4px 0; }
    .rb-nav-logout, .rb-nav-signup, .rb-nav-link { width: 100%; text-align: left; }
  }

  /* ── Mock banner ───────────────────────────────── */
  .rb-mock-banner {
    background: #fffbeb; border-bottom: 1px solid #fde68a;
    color: #92400e; font-size: 13px; text-align: center; padding: 8px 16px;
  }

  /* ── Toast ─────────────────────────────────────── */
  .rb-toast {
    position: fixed; top: 72px; right: 20px; z-index: 999;
    padding: 12px 18px; border-radius: var(--rb-radius-sm);
    font-size: 14px; font-weight: 500;
    box-shadow: var(--rb-shadow-lg); animation: slideIn .2s ease;
  }
  .rb-toast-success { background: var(--rb-green-lt); color: var(--rb-green); border: 1px solid #bbf7d0; }
  .rb-toast-error   { background: var(--rb-red-lt);   color: var(--rb-red);   border: 1px solid #fecaca; }
  @keyframes slideIn { from { opacity:0; transform: translateX(20px); } to { opacity:1; transform: none; } }

  /* ── Main layout ───────────────────────────────── */
  .rb-main {
    max-width: 1100px; margin: 0 auto;
    padding: 32px 20px 80px;
  }
  .rb-narrow-page { max-width: 520px; margin: 0 auto; }
  .rb-page-title  { font-size: 24px; font-weight: 700; letter-spacing: -.4px; margin-bottom: 24px; }
  .rb-section     { margin-top: 40px; }
  .rb-section-title { font-size: 18px; font-weight: 700; margin-bottom: 16px; }

  /* ── Hero ──────────────────────────────────────── */
  .rb-hero {
    text-align: center;
    padding: 64px 20px 48px;
    background: linear-gradient(135deg, #eff6ff 0%, #f0f4ff 100%);
    border-radius: 24px;
    border: 1px solid #dbeafe;
    position: relative; overflow: hidden;
  }
  .rb-hero::before {
    content: ''; position: absolute;
    width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle, rgba(37,99,235,.08) 0%, transparent 70%);
    top: -60px; right: -60px;
  }
  .rb-hero-badge {
    display: inline-flex; align-items: center;
    background: #fff; border: 1px solid var(--rb-border);
    border-radius: 50px; padding: 5px 14px;
    font-size: 12px; font-weight: 600; color: var(--rb-accent);
    margin-bottom: 20px; letter-spacing: .3px;
  }
  .rb-hero-heading {
    font-size: clamp(32px, 5vw, 52px);
    font-weight: 800; line-height: 1.15;
    letter-spacing: -1px; margin-bottom: 16px;
  }
  .rb-hero-accent { color: var(--rb-accent); }
  .rb-hero-sub { font-size: 17px; color: var(--rb-text-2); margin-bottom: 32px; }
  .rb-hero-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

  /* ── Feature cards ─────────────────────────────── */
  .rb-feature-card {
    background: var(--rb-surface); border: 1px solid var(--rb-border);
    border-radius: var(--rb-radius); padding: 24px 16px;
    text-align: center; height: 100%;
    transition: box-shadow .2s, transform .2s;
  }
  .rb-feature-card:hover { box-shadow: var(--rb-shadow); transform: translateY(-2px); }
  .rb-feature-icon {
    width: 48px; height: 48px; border-radius: 14px;
    background: var(--rb-accent-lt); color: var(--rb-accent);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; margin: 0 auto 14px;
  }
  .rb-feature-title { font-size: 14px; font-weight: 700; margin-bottom: 6px; }
  .rb-feature-desc  { font-size: 13px; color: var(--rb-text-2); margin: 0; }

  /* ── Route chips ───────────────────────────────── */
  .rb-route-chip {
    background: var(--rb-surface); border: 1px solid var(--rb-border);
    border-radius: var(--rb-radius-sm); padding: 14px 16px;
    display: flex; justify-content: space-between; align-items: center;
    transition: box-shadow .15s;
  }
  .rb-route-chip:hover { box-shadow: var(--rb-shadow); }
  .rb-route-name { display: block; font-size: 14px; font-weight: 600; }
  .rb-route-path { display: block; font-size: 12px; color: var(--rb-text-2); margin-top: 2px; }
  .rb-route-price { font-size: 18px; font-weight: 700; color: var(--rb-accent); }

  /* ── Form pages ────────────────────────────────── */
  .rb-form-page { max-width: 420px; margin: 0 auto; padding: 20px 0; }
  .rb-form-card {
    background: var(--rb-surface); border: 1px solid var(--rb-border);
    border-radius: 16px; padding: 32px; box-shadow: var(--rb-shadow);
  }
  .rb-form-header { text-align: center; margin-bottom: 28px; }
  .rb-form-icon {
    width: 56px; height: 56px; border-radius: 16px;
    background: var(--rb-accent-lt); color: var(--rb-accent);
    font-size: 28px; display: flex; align-items: center; justify-content: center;
    margin: 0 auto 14px;
  }
  .rb-form-title { font-size: 22px; font-weight: 800; letter-spacing: -.4px; }
  .rb-form-sub   { font-size: 14px; color: var(--rb-text-2); margin-top: 4px; }
  .rb-form-switch { text-align: center; font-size: 13px; color: var(--rb-text-2); margin-top: 16px; }
  .rb-link { background: none; border: none; color: var(--rb-accent); font-weight: 600; cursor: pointer; font-size: 13px; }
  .rb-demo-hint {
    margin-top: 16px; padding: 12px; border-radius: var(--rb-radius-sm);
    background: var(--rb-surface-2); border: 1px solid var(--rb-border);
    font-size: 12px; color: var(--rb-text-2);
  }

  /* ── Inputs ────────────────────────────────────── */
  .rb-label { display: block; font-size: 13px; font-weight: 600; color: var(--rb-text-2); margin-bottom: 6px; }
  .rb-input, .rb-select {
    width: 100%; padding: 10px 13px;
    border: 1.5px solid var(--rb-border); border-radius: var(--rb-radius-sm);
    font-size: 14px; color: var(--rb-text); background: var(--rb-surface);
    transition: border-color .15s, box-shadow .15s;
    outline: none;
  }
  .rb-input:focus, .rb-select:focus {
    border-color: var(--rb-accent);
    box-shadow: 0 0 0 3px rgba(37,99,235,.1);
  }
  .rb-input.has-icon { padding-left: 38px; }
  .rb-input-group { position: relative; }
  .rb-input-icon {
    position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    color: var(--rb-text-3); font-size: 15px; pointer-events: none;
  }

  /* ── Buttons ───────────────────────────────────── */
  .rb-btn-primary {
    background: var(--rb-accent); color: #fff; border: none;
    border-radius: var(--rb-radius-sm); padding: 10px 20px;
    font-size: 14px; font-weight: 600; cursor: pointer;
    transition: background .15s, transform .1s;
    display: inline-flex; align-items: center; justify-content: center;
  }
  .rb-btn-primary:hover:not(:disabled) { background: var(--rb-accent-h); transform: translateY(-1px); }
  .rb-btn-primary:disabled { opacity: .65; cursor: not-allowed; }
  .rb-btn-primary.rb-btn-lg { padding: 13px 28px; font-size: 16px; border-radius: 10px; }
  .rb-btn-primary.rb-btn-book { padding: 8px 18px; font-size: 14px; }
  .rb-btn-outline {
    background: var(--rb-surface); color: var(--rb-text);
    border: 1.5px solid var(--rb-border); border-radius: 10px;
    padding: 13px 28px; font-size: 16px; font-weight: 600; cursor: pointer;
    transition: border-color .15s;
  }
  .rb-btn-outline:hover { border-color: var(--rb-accent); color: var(--rb-accent); }
  .rb-btn-danger {
    background: var(--rb-red-lt); color: var(--rb-red);
    border: 1px solid #fecaca; border-radius: var(--rb-radius-sm);
    padding: 7px 14px; font-size: 13px; font-weight: 600; cursor: pointer;
    transition: background .15s;
  }
  .rb-btn-danger:hover { background: #fee2e2; }

  /* ── Error ─────────────────────────────────────── */
  .rb-error {
    padding: 10px 13px; border-radius: var(--rb-radius-sm);
    background: var(--rb-red-lt); color: var(--rb-red);
    border: 1px solid #fecaca; font-size: 13px;
  }

  /* ── Card ──────────────────────────────────────── */
  .rb-card {
    background: var(--rb-surface); border: 1px solid var(--rb-border);
    border-radius: var(--rb-radius); padding: 20px;
    box-shadow: var(--rb-shadow);
  }
  .rb-card-body-p { padding: 20px; }

  /* ── Search card ───────────────────────────────── */
  .rb-search-card {
    background: var(--rb-surface); border: 1px solid var(--rb-border);
    border-radius: 16px; padding: 20px;
    box-shadow: var(--rb-shadow-lg);
  }
  .rb-swap-btn {
    background: var(--rb-surface-2); border: 1.5px solid var(--rb-border);
    border-radius: 8px; padding: 8px 10px; cursor: pointer; color: var(--rb-accent);
    font-size: 15px; transition: all .15s;
  }
  .rb-swap-btn:hover { background: var(--rb-accent-lt); border-color: var(--rb-accent); }
  .rb-results-count { font-size: 13px; color: var(--rb-text-2); margin-bottom: 12px; }

  /* ── Train card ────────────────────────────────── */
  .rb-train-card {
    background: var(--rb-surface); border: 1px solid var(--rb-border);
    border-radius: var(--rb-radius); padding: 20px;
    display: flex; justify-content: space-between; align-items: center;
    gap: 16px; box-shadow: var(--rb-shadow);
    transition: box-shadow .2s, transform .2s;
  }
  .rb-train-card:hover { box-shadow: var(--rb-shadow-lg); transform: translateY(-1px); }
  .rb-train-card-left  { flex: 1; min-width: 0; }
  .rb-train-card-right { text-align: right; flex-shrink: 0; }
  .rb-train-head { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
  .rb-train-name { font-size: 16px; font-weight: 700; }
  .rb-train-id-badge {
    font-size: 11px; font-weight: 600; padding: 2px 8px;
    border-radius: 50px; background: var(--rb-accent-lt); color: var(--rb-accent);
  }
  .rb-train-route { display: flex; align-items: center; gap: 10px; }
  .rb-time-col { display: flex; flex-direction: column; align-items: flex-start; }
  .rb-time-col-right { align-items: flex-end; }
  .rb-time { font-size: 20px; font-weight: 700; letter-spacing: -.5px; }
  .rb-city { font-size: 12px; color: var(--rb-text-2); margin-top: 2px; }
  .rb-route-line { flex: 1; display: flex; align-items: center; gap: 4px; flex-direction: column; gap: 2px; }
  .rb-duration-label { font-size: 11px; color: var(--rb-text-3); white-space: nowrap; }
  .rb-route-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--rb-accent); }
  .rb-route-track { flex: 1; width: 1px; min-height: 10px; background: var(--rb-border); }
  .rb-seats-info { font-size: 12px; color: var(--rb-text-2); margin-top: 12px; margin-bottom: 0; }
  .rb-train-price { font-size: 26px; font-weight: 800; color: var(--rb-accent); letter-spacing: -1px; margin-bottom: 0; }
  .rb-per-person  { font-size: 11px; color: var(--rb-text-3); }

  /* ── Booking modal ─────────────────────────────── */
  .rb-modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.45);
    display: flex; align-items: center; justify-content: center;
    z-index: 200; padding: 16px;
  }
  .rb-modal {
    background: var(--rb-surface); border-radius: 20px;
    width: 100%; max-width: 460px; box-shadow: var(--rb-shadow-lg);
    animation: modalIn .2s ease;
  }
  @keyframes modalIn { from { opacity:0; transform: scale(.96); } to { opacity:1; transform: scale(1); } }
  .rb-modal-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 24px; border-bottom: 1px solid var(--rb-border);
  }
  .rb-modal-body   { padding: 24px; }
  .rb-modal-close  { background: none; border: none; font-size: 16px; cursor: pointer; color: var(--rb-text-2); padding: 4px; }
  .rb-modal-train-info {
    background: var(--rb-accent-lt); border-radius: var(--rb-radius-sm);
    padding: 14px; border: 1px solid #bfdbfe;
  }
  .rb-passenger-ctrl {
    display: inline-flex; align-items: center; gap: 0;
    border: 1.5px solid var(--rb-border); border-radius: var(--rb-radius-sm); overflow: hidden;
  }
  .rb-passenger-ctrl button {
    background: var(--rb-surface-2); border: none; width: 36px; height: 36px;
    font-size: 18px; cursor: pointer; color: var(--rb-text); transition: background .1s;
  }
  .rb-passenger-ctrl button:hover { background: var(--rb-accent-lt); color: var(--rb-accent); }
  .rb-passenger-ctrl span { width: 40px; text-align: center; font-weight: 700; font-size: 16px; }
  .rb-price-summary { background: var(--rb-surface-2); border-radius: var(--rb-radius-sm); padding: 14px; border: 1px solid var(--rb-border); }

  /* ── PNR ───────────────────────────────────────── */
  .rb-pnr-not-found {
    text-align: center; padding: 32px; border-radius: var(--rb-radius);
    background: var(--rb-red-lt); border: 1px solid #fecaca;
    display: flex; align-items: center; gap: 12px; justify-content: center;
  }
  .rb-pnr-icon { font-size: 28px; }
  .rb-pnr-result { border-radius: var(--rb-radius); overflow: hidden; border: 1px solid #86efac; }
  .rb-pnr-header {
    background: var(--rb-green-lt); padding: 14px 20px;
    display: flex; align-items: center;
    font-weight: 600; color: var(--rb-green);
    border-bottom: 1px solid #bbf7d0;
  }
  .rb-pnr-number { font-family: monospace; font-size: 13px; }
  .rb-info-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 0; border-bottom: 1px solid var(--rb-border); font-size: 14px;
  }
  .rb-info-row.last { border-bottom: none; }

  /* ── My Bookings ───────────────────────────────── */
  .rb-booking-card {
    background: var(--rb-surface); border: 1px solid var(--rb-border);
    border-radius: var(--rb-radius); padding: 18px 20px;
    box-shadow: var(--rb-shadow);
  }
  .rb-booking-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
  .rb-booking-price { font-size: 20px; font-weight: 800; color: var(--rb-accent); }
  .rb-booking-route { font-size: 14px; margin-bottom: 10px; display: flex; align-items: center; flex-wrap: wrap; gap: 2px; }
  .rb-booking-meta { display: flex; gap: 16px; font-size: 12px; color: var(--rb-text-2); flex-wrap: wrap; }
  .rb-status-badge {
    font-size: 11px; font-weight: 600; padding: 2px 8px;
    border-radius: 50px; background: var(--rb-green-lt); color: var(--rb-green);
    border: 1px solid #bbf7d0;
  }

  /* ── Admin ─────────────────────────────────────── */
  .rb-stat-card {
    background: var(--rb-surface); border: 1px solid var(--rb-border);
    border-radius: var(--rb-radius); padding: 20px 16px; text-align: center;
    box-shadow: var(--rb-shadow);
  }
  .rb-stat-icon  { font-size: 24px; color: var(--rb-accent); }
  .rb-stat-value { font-size: 28px; font-weight: 800; margin: 8px 0 4px; letter-spacing: -1px; }
  .rb-stat-label { font-size: 12px; color: var(--rb-text-2); }
  .rb-tabs { display: flex; border-bottom: 2px solid var(--rb-border); }
  .rb-tab {
    background: none; border: none; border-bottom: 2px solid transparent;
    margin-bottom: -2px; padding: 10px 18px; font-size: 14px; font-weight: 500;
    cursor: pointer; color: var(--rb-text-2); transition: all .15s;
  }
  .rb-tab:hover { color: var(--rb-text); }
  .rb-tab.active { color: var(--rb-accent); border-bottom-color: var(--rb-accent); font-weight: 700; }
  .rb-admin-train-row {
    background: var(--rb-surface); border: 1px solid var(--rb-border);
    border-radius: var(--rb-radius-sm); padding: 14px 18px;
    display: flex; justify-content: space-between; align-items: center;
    gap: 12px; flex-wrap: wrap;
  }

  /* ── Locked / Empty ────────────────────────────── */
  .rb-locked { text-align: center; padding: 80px 20px; color: var(--rb-text-2); }
  .rb-locked-icon { font-size: 48px; color: var(--rb-text-3); margin-bottom: 16px; display: block; }
  .rb-empty { text-align: center; padding: 60px 20px; color: var(--rb-text-2); }
  .rb-empty-icon { font-size: 40px; color: var(--rb-text-3); display: block; margin-bottom: 12px; }

  /* ── Utility ───────────────────────────────────── */
  .rb-text-muted  { color: var(--rb-text-2); }
  .rb-accent-text { color: var(--rb-accent); }

  /* ── Footer ────────────────────────────────────── */
  .rb-footer {
    text-align: center; padding: 20px;
    border-top: 1px solid var(--rb-border);
    font-size: 13px; color: var(--rb-text-3);
    background: var(--rb-surface);
  }
`;
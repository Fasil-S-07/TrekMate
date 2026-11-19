import { useEffect, useMemo, useState } from "react";
import { Mountain, MapPin, Clock3, Users, ArrowRight, Search, Menu, X, Compass, ShieldCheck, Footprints, CalendarDays } from "lucide-react";
import { api } from "./api";
import Dashboard from "./Dashboard.jsx";

const demoTreks = [
  { _id: "demo-1", name: "Kudremukh Peak", location: "Chikkamagaluru, Karnataka", durationDays: 2, difficulty: "Moderate", price: 2499, capacity: 12, description: "Walk through rolling grasslands, shola forests and misty mountain ridges.", imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85" },
  { _id: "demo-2", name: "Triund Trail", location: "McLeod Ganj, Himachal Pradesh", durationDays: 2, difficulty: "Easy", price: 3199, capacity: 16, description: "A rewarding ridge walk with sweeping views of the Dhauladhar mountains.", imageUrl: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85" },
  { _id: "demo-3", name: "Valley of Flowers", location: "Chamoli, Uttarakhand", durationDays: 5, difficulty: "Hard", price: 8999, capacity: 10, description: "Explore a high-altitude valley known for its seasonal alpine blooms.", imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85" }
];

function App() {
  const [treks, setTreks] = useState(demoTreks);
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("trekmate-user")); } catch { return null; }
  });
  const [modal, setModal] = useState(null);
  const [selectedTrek, setSelectedTrek] = useState(null);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState(null);

  useEffect(() => { if (view) document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth", block: "start" }); }, [view]);

  useEffect(() => {
    api("/treks").then(data => { if (Array.isArray(data) && data.length) setTreks(data); }).catch(() => {});
  }, []);

  const filtered = useMemo(() => treks.filter(t => {
    const matchesText = `${t.name} ${t.location}`.toLowerCase().includes(query.toLowerCase());
    return matchesText && (difficulty === "All" || t.difficulty === difficulty);
  }), [treks, query, difficulty]);

  async function submitAuth(event) {
    event.preventDefault();
    setLoading(true);
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      if (modal === "register") await api("/auth/register", { method: "POST", body: JSON.stringify(payload) });
      const result = await api("/auth/login", { method: "POST", body: JSON.stringify({ email: payload.email, password: payload.password }) });
      localStorage.setItem("trekmate-token", result.token);
      localStorage.setItem("trekmate-user", JSON.stringify(result.user));
      setUser(result.user); setModal(null); setNotice(`Welcome, ${result.user.name}!`);
    } catch (error) { setNotice(error.message); }
    finally { setLoading(false); }
  }

  async function bookTrek(event) {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      await api("/bookings", { method: "POST", body: JSON.stringify({ trekId: selectedTrek._id, travelDate: payload.travelDate, participants: Number(payload.participants) }) });
      setNotice("Your booking request was created successfully.");
      setSelectedTrek(null);
    } catch (error) { setNotice(error.message); }
  }

  function signOut() {
    localStorage.removeItem("trekmate-token"); localStorage.removeItem("trekmate-user");
    setUser(null); setNotice("You have signed out.");
  }

  return <div className="app-shell">
    <header className="navbar">
      <a className="brand" href="#"><span className="brand-mark"><Mountain size={22}/></span><span>TREK<span className="brand-light">MATE</span></span></a>
      <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X/> : <Menu/>}</button>
      <nav className={menuOpen ? "nav-links open" : "nav-links"}>
        <a href="#explore" onClick={() => setMenuOpen(false)}>Explore treks</a><a href="#why" onClick={() => setMenuOpen(false)}>Why TrekMate</a><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>{user && <button className="nav-dashboard-link" onClick={() => { setView("bookings"); setMenuOpen(false); }}>My bookings</button>}{user?.role === "admin" && <button className="nav-dashboard-link" onClick={() => { setView("admin"); setMenuOpen(false); }}>Admin</button>}
      </nav>
      <div className="nav-actions">
        {user ? <><span className="welcome">Hi, {user.name.split(" ")[0]}</span><button className="btn btn-outline small" onClick={signOut}>Sign out</button></> : <><button className="btn btn-ghost" onClick={() => setModal("login")}>Log in</button><button className="btn btn-primary small" onClick={() => setModal("register")}>Join now <ArrowRight size={15}/></button></>}
      </div>
    </header>

    <main>
      <section className="hero">
        <div className="hero-image"></div><div className="hero-shade"></div>
        <div className="hero-content">
          <div className="eyebrow"><span className="eyebrow-line"></span> FIND YOUR NEXT ADVENTURE</div>
          <h1>The mountains<br/>are calling<span className="accent-dot">.</span></h1>
          <p>Discover unforgettable trails, meet the outdoors, and make every step count. Your next great story starts here.</p>
          <div className="hero-buttons"><a className="btn btn-primary" href="#explore">Explore treks <ArrowRight size={17}/></a><a className="btn btn-glass" href="#why">Discover TrekMate</a></div>
          <div className="hero-stats"><div><strong>12+</strong><span>Curated trails</span></div><div><strong>3 levels</strong><span>For every adventurer</span></div><div><strong>1 goal</strong><span>More time outdoors</span></div></div>
        </div>
        <div className="hero-note"><span className="note-icon"><Compass size={18}/></span><span><b>Find your own path</b><small>Adventure begins here</small></span></div>
      </section>

      <section className="section explore-section" id="explore">
        <div className="section-heading"><div><div className="eyebrow dark"><span className="eyebrow-line"></span> THE GREAT OUTDOORS</div><h2>Choose your next <em>trail.</em></h2><p>From gentle nature walks to challenging summit climbs, there is a path waiting for you.</p></div><div className="trail-count"><b>{filtered.length.toString().padStart(2,"0")}</b><span>TRAILS TO EXPLORE</span></div></div>
        <div className="filters"><label className="search-box"><Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by trek or location"/></label><select value={difficulty} onChange={e => setDifficulty(e.target.value)} aria-label="Filter by difficulty"><option>All</option><option>Easy</option><option>Moderate</option><option>Hard</option></select></div>
        <div className="trek-grid">{filtered.map((trek, index) => <article className="trek-card" key={trek._id}><div className="trek-photo" style={{backgroundImage:`url("${trek.imageUrl || demoTreks[index % demoTreks.length].imageUrl}")`}}><span className={`difficulty ${trek.difficulty.toLowerCase()}`}>{trek.difficulty}</span><span className="photo-index">0{index+1}</span></div><div className="trek-info"><div className="trek-location"><MapPin size={14}/>{trek.location}</div><h3>{trek.name}</h3><p>{trek.description}</p><div className="trek-meta"><span><Clock3 size={15}/>{trek.durationDays} days</span><span><Users size={15}/>{trek.capacity} spots</span></div><div className="trek-bottom"><div><small>STARTING FROM</small><strong>₹{Number(trek.price).toLocaleString("en-IN")}<small> / person</small></strong></div><button className="round-arrow" onClick={() => { setSelectedTrek(trek); if (!user) setNotice("Please log in or register to book a trek."); }} aria-label={`Book ${trek.name}`}><ArrowRight size={19}/></button></div></div></article>)}</div>
        {filtered.length === 0 && <div className="empty-state">No treks match your search. Try another location or difficulty.</div>}
      </section>

      <section className="why-section" id="why"><div className="why-inner"><div className="eyebrow"><span className="eyebrow-line"></span> MORE THAN A JOURNEY</div><h2>Make memories.<br/><em>Not just miles.</em></h2><p className="why-copy">TrekMate brings your trekking plans together in one place. Discover trails, understand the challenge, and make a booking when you are ready.</p><div className="feature-grid"><div className="feature"><span><Compass/></span><h3>Find your trail</h3><p>Explore trek options by location and difficulty level.</p></div><div className="feature"><span><ShieldCheck/></span><h3>Plan with clarity</h3><p>Review duration, group capacity and listed prices before booking.</p></div><div className="feature"><span><Footprints/></span><h3>One step at a time</h3><p>Keep your adventure plans organised in one place.</p></div></div></div></section>
      <section className="contact-section" id="contact"><div><div className="eyebrow dark"><span className="eyebrow-line"></span> READY TO GO?</div><h2>Your next adventure<br/>is out there.</h2></div><a className="btn btn-primary" href="#explore">Find a trek <ArrowRight size={17}/></a></section>
    {view && <Dashboard view={view} user={user} onClose={() => setView(null)} onNotice={setNotice} />}
    </main>
    <footer><a className="brand footer-brand" href="#"><span className="brand-mark"><Mountain size={20}/></span>TREK<span className="brand-light">MATE</span></a><span>Explore responsibly. Leave only footprints.</span><span>© {new Date().getFullYear()} TrekMate Student Project</span></footer>

    {notice && <div className="toast" role="status">{notice}<button onClick={() => setNotice("")} aria-label="Dismiss notice"><X size={16}/></button></div>}
    {modal && <div className="modal-backdrop" onClick={() => setModal(null)}><div className="modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setModal(null)} aria-label="Close"><X/></button><div className="modal-icon"><Mountain/></div><h2>{modal === "login" ? "Welcome back" : "Join the journey"}</h2><p>{modal === "login" ? "Log in to continue planning your next trek." : "Create an account to start exploring."}</p><form onSubmit={submitAuth}>{modal === "register" && <label>Full name<input name="name" required minLength="2" placeholder="Your name"/></label>}<label>Email address<input name="email" required type="email" placeholder="you@example.com"/></label><label>Password<input name="password" required type="password" minLength="8" placeholder="At least 8 characters"/></label><button className="btn btn-primary full" disabled={loading}>{loading ? "Please wait..." : modal === "login" ? "Log in" : "Create account"} <ArrowRight size={16}/></button></form><button className="switch-auth" onClick={() => setModal(modal === "login" ? "register" : "login")}>{modal === "login" ? "New to TrekMate? Create an account" : "Already registered? Log in"}</button></div></div>}

    {selectedTrek && <div className="modal-backdrop" onClick={() => setSelectedTrek(null)}><div className="modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setSelectedTrek(null)} aria-label="Close"><X/></button><div className="modal-icon"><CalendarDays/></div><h2>Book {selectedTrek.name}</h2><p>Choose a date and group size to request your booking.</p>{user ? <form onSubmit={bookTrek}><label>Travel date<input name="travelDate" type="date" min={new Date(Date.now()+86400000).toISOString().slice(0,10)} required/></label><label>Participants<input name="participants" type="number" min="1" max={selectedTrek.capacity} defaultValue="1" required/></label><button className="btn btn-primary full">Request booking <ArrowRight size={16}/></button></form> : <button className="btn btn-primary full" onClick={() => {setSelectedTrek(null);setModal("login");}}>Log in to book <ArrowRight size={16}/></button>}</div></div>}
  </div>;
}
export default App;

import { useEffect, useState } from "react";
import { api } from "./api";
import { ArrowLeft, RefreshCw, Plus, Archive, CalendarDays } from "lucide-react";

export default function Dashboard({ view, user, onClose, onNotice }) {
  const [bookings, setBookings] = useState([]);
  const [treks, setTreks] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      if (view === "bookings") setBookings(await api("/bookings/mine"));
      if (view === "admin") {
        const [t, b] = await Promise.all([api("/admin/treks"), api("/admin/bookings")]);
        setTreks(t); setAllBookings(b);
      }
    } catch (error) { onNotice(error.message); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, [view]);

  async function addTrek(event) {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget).entries());
    const payload = {
      ...form,
      durationDays: Number(form.durationDays),
      price: Number(form.price),
      capacity: Number(form.capacity)
    };
    try {
      await api("/admin/treks", { method: "POST", body: JSON.stringify(payload) });
      event.currentTarget.reset();
      onNotice("Trek added successfully.");
      load();
    } catch (error) { onNotice(error.message); }
  }

  async function archiveTrek(id) {
    try {
      await api(`/admin/treks/${id}`, { method: "DELETE" });
      onNotice("Trek archived."); load();
    } catch (error) { onNotice(error.message); }
  }

  async function setBookingStatus(id, status) {
    try {
      await api(`/admin/bookings/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      onNotice("Booking status updated."); load();
    } catch (error) { onNotice(error.message); }
  }

  return <section className="dashboard-section" id="dashboard">
    <div className="dashboard-heading">
      <div><div className="eyebrow dark"><span className="eyebrow-line"></span> YOUR TREKMATE SPACE</div>
        <h2>{view === "admin" ? "Admin dashboard" : "My bookings"}</h2>
        <p>{view === "admin" ? "Manage trek listings and review customer reservations." : "Your upcoming adventures and booking history."}</p>
      </div>
      <div className="dashboard-actions"><button className="btn btn-outline small" onClick={load}><RefreshCw size={14}/> Refresh</button><button className="btn btn-ghost small" onClick={onClose}><ArrowLeft size={14}/> Back to explore</button></div>
    </div>
    {loading ? <p className="dashboard-empty">Loading dashboard…</p> : view === "bookings" ?
      <div className="booking-list">{bookings.length ? bookings.map(item => <article className="booking-row" key={item._id}>
        <div><strong>{item.trek?.name || "Trek"}</strong><span>{item.trek?.location || "Location unavailable"}</span></div>
        <div><small>TRAVEL DATE</small><b>{new Date(item.travelDate).toLocaleDateString()}</b></div>
        <div><small>PEOPLE</small><b>{item.participants}</b></div>
        <div><small>TOTAL</small><b>₹{Number(item.totalPrice).toLocaleString("en-IN")}</b></div>
        <span className={`booking-status ${item.status.toLowerCase()}`}>{item.status}</span>
      </article>) : <p className="dashboard-empty">No bookings yet. Explore the treks above to plan your first trip.</p>}</div>
    : <div className="admin-layout">
      <div className="admin-card"><h3><Plus size={17}/> Add a trek</h3><form className="admin-form" onSubmit={addTrek}>
        <label>Trek name<input name="name" required placeholder="e.g. Nandi Hills sunrise trek"/></label>
        <label>Location<input name="location" required placeholder="City, State"/></label>
        <label className="wide">Description<textarea name="description" required rows="3" placeholder="Describe the trail and experience"/></label>
        <label>Duration (days)<input name="durationDays" type="number" min="1" required/></label>
        <label>Difficulty<select name="difficulty"><option>Easy</option><option>Moderate</option><option>Hard</option></select></label>
        <label>Price (₹)<input name="price" type="number" min="0" required/></label>
        <label>Capacity<input name="capacity" type="number" min="1" required/></label>
        <label className="wide">Image URL (optional)<input name="imageUrl" type="url" placeholder="https://…"/></label>
        <button className="btn btn-primary"><Plus size={15}/> Save trek</button>
      </form></div>
      <div className="admin-card"><h3><Archive size={17}/> Trek listings</h3>{treks.map(t => <div className="admin-list-row" key={t._id}><span><b>{t.name}</b><small>{t.location} · {t.difficulty}</small></span><button className="text-action" onClick={() => archiveTrek(t._id)}>Archive</button></div>)}</div>
      <div className="admin-card wide-card"><h3><CalendarDays size={17}/> Customer bookings</h3>{allBookings.length ? allBookings.map(b => <div className="admin-list-row" key={b._id}><span><b>{b.user?.name || "Customer"} — {b.trek?.name || "Trek"}</b><small>{b.user?.email || ""} · {new Date(b.travelDate).toLocaleDateString()} · {b.participants} participant(s)</small></span><select aria-label="Booking status" value={b.status} onChange={e => setBookingStatus(b._id, e.target.value)}><option>Pending</option><option>Confirmed</option><option>Cancelled</option></select></div>) : <p className="dashboard-empty">No bookings have been submitted.</p>}</div>
    </div>}
  </section>;
}

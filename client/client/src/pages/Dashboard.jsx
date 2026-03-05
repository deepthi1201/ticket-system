import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --surface: #111118;
    --surface2: #1a1a24;
    --border: rgba(255,255,255,0.07);
    --accent: #6c63ff;
    --accent2: #ff6584;
    --accent3: #43e97b;
    --text: #f0f0f5;
    --muted: #6b6b80;
    --open: #fbbf24;
    --progress: #6c63ff;
    --closed: #43e97b;
    --low: #6b6b80;
    --medium: #38bdf8;
    --high: #fb923c;
    --urgent: #f43f5e;
  }

  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }

  .layout { display: flex; min-height: 100vh; }

  /* SIDEBAR */
  .sidebar {
    width: 240px;
    min-height: 100vh;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    padding: 32px 20px;
    position: sticky;
    top: 0;
    height: 100vh;
  }

  .logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 20px;
    color: var(--text);
    margin-bottom: 40px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .logo-dot {
    width: 10px; height: 10px;
    background: var(--accent);
    border-radius: 50%;
    box-shadow: 0 0 12px var(--accent);
  }

  .nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }

  .nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 14px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.2s;
    border: none; background: none; text-align: left; width: 100%;
  }

  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: rgba(108,99,255,0.15); color: var(--accent); }

  .nav-icon { font-size: 16px; width: 20px; text-align: center; }

  .logout-btn {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 14px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    color: var(--accent2);
    cursor: pointer;
    border: 1px solid rgba(255,101,132,0.2);
    background: rgba(255,101,132,0.05);
    transition: all 0.2s;
    width: 100%;
    margin-top: 20px;
  }
  .logout-btn:hover { background: rgba(255,101,132,0.15); }

  /* MAIN */
  .main { flex: 1; padding: 40px 48px; overflow-y: auto; }

  .page-header {
    display: flex; align-items: flex-end; justify-content: space-between;
    margin-bottom: 36px;
  }

  .page-title {
    font-family: 'Syne', sans-serif;
    font-size: 32px;
    font-weight: 800;
    color: var(--text);
    line-height: 1;
  }

  .page-sub { font-size: 14px; color: var(--muted); margin-top: 6px; }

  /* STATS ROW */
  .stats-row { display: flex; gap: 16px; margin-bottom: 32px; }

  .stat-card {
    flex: 1;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 20px 24px;
    transition: transform 0.2s;
  }
  .stat-card:hover { transform: translateY(-2px); }

  .stat-label { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }
  .stat-value { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; }
  .stat-value.open { color: var(--open); }
  .stat-value.progress { color: var(--progress); }
  .stat-value.closed { color: var(--closed); }
  .stat-value.total { color: var(--text); }

  /* TWO COL */
  .two-col { display: flex; gap: 24px; align-items: flex-start; }

  /* CREATE FORM */
  .create-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 28px;
    width: 340px;
    flex-shrink: 0;
    position: sticky;
    top: 40px;
  }

  .card-title {
    font-family: 'Syne', sans-serif;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 20px;
    color: var(--text);
  }

  .field { margin-bottom: 14px; }
  .field label { display: block; font-size: 12px; color: var(--muted); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.06em; }

  .input {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 14px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
  }
  .input:focus { border-color: var(--accent); }
  .input::placeholder { color: var(--muted); }

  .select {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 14px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b6b80' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
  }
  .select:focus { border-color: var(--accent); }
  .select option { background: #1a1a24; }

  .priority-badge {
    font-size: 11px; font-weight: 700;
    padding: 3px 10px; border-radius: 20px;
    letter-spacing: 0.06em; text-transform: uppercase;
  }
  .priority-badge.LOW { background: rgba(107,107,128,0.2); color: var(--low); }
  .priority-badge.MEDIUM { background: rgba(56,189,248,0.15); color: var(--medium); }
  .priority-badge.HIGH { background: rgba(251,146,60,0.15); color: var(--high); }
  .priority-badge.URGENT { background: rgba(244,63,94,0.15); color: var(--urgent); animation: pulse 1.5s infinite; }

  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }

  .btn-primary {
    width: 100%;
    padding: 12px;
    background: var(--accent);
    color: white;
    border: none;
    border-radius: 8px;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.02em;
  }
  .btn-primary:hover { background: #8078ff; box-shadow: 0 0 20px rgba(108,99,255,0.4); }

  /* TICKET LIST */
  .ticket-section { flex: 1; min-width: 0; }

  .toolbar {
    display: flex; gap: 12px; align-items: center; margin-bottom: 20px; flex-wrap: wrap;
  }

  .search-wrap { position: relative; flex: 1; min-width: 200px; }
  .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--muted); font-size: 14px; }

  .search-input {
    width: 100%;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 9px 14px 9px 36px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
  }
  .search-input:focus { border-color: var(--accent); }
  .search-input::placeholder { color: var(--muted); }

  .filters { display: flex; gap: 6px; }

  .filter-btn {
    padding: 7px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--muted);
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .filter-btn:hover { color: var(--text); border-color: rgba(255,255,255,0.2); }
  .filter-btn.active { background: var(--accent); color: white; border-color: var(--accent); }

  /* TICKET CARD */
  .ticket-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 22px 24px;
    margin-bottom: 14px;
    transition: all 0.25s;
    position: relative;
    overflow: hidden;
  }
  .ticket-card::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    border-radius: 3px 0 0 3px;
  }
  .ticket-card.OPEN::before { background: var(--open); }
  .ticket-card.IN_PROGRESS::before { background: var(--progress); }
  .ticket-card.CLOSED::before { background: var(--closed); }
  .ticket-card:hover { border-color: rgba(255,255,255,0.14); transform: translateX(3px); }

  .ticket-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }

  .ticket-title {
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: var(--text);
  }

  .status-badge {
    font-size: 11px;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 20px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    flex-shrink: 0;
  }
  .status-badge.OPEN { background: rgba(251,191,36,0.15); color: var(--open); }
  .status-badge.IN_PROGRESS { background: rgba(108,99,255,0.15); color: var(--progress); }
  .status-badge.CLOSED { background: rgba(67,233,123,0.15); color: var(--closed); }

  .ticket-desc { font-size: 13px; color: var(--muted); margin-bottom: 16px; line-height: 1.5; }

  .ticket-actions { display: flex; gap: 8px; margin-bottom: 16px; }

  .btn-action {
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .btn-start { background: rgba(108,99,255,0.15); color: var(--accent); }
  .btn-start:hover { background: rgba(108,99,255,0.3); }
  .btn-close { background: rgba(67,233,123,0.12); color: var(--closed); }
  .btn-close:hover { background: rgba(67,233,123,0.25); }
  .btn-delete { background: rgba(255,101,132,0.1); color: var(--accent2); }
  .btn-delete:hover { background: rgba(255,101,132,0.22); }

  /* COMMENTS */
  .comments-section { border-top: 1px solid var(--border); padding-top: 14px; }
  .comments-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; font-weight: 600; }

  .comment-item {
    background: var(--surface2);
    border-radius: 6px;
    padding: 8px 12px;
    font-size: 13px;
    color: #b0b0c0;
    margin-bottom: 6px;
    border-left: 2px solid var(--accent);
  }

  .comment-row { display: flex; gap: 8px; margin-top: 10px; }

  .comment-input {
    flex: 1;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 8px 12px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    outline: none;
    transition: border-color 0.2s;
  }
  .comment-input:focus { border-color: var(--accent); }
  .comment-input::placeholder { color: var(--muted); }

  .btn-send {
    padding: 8px 16px;
    background: var(--accent);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    font-family: 'Syne', sans-serif;
    transition: all 0.2s;
  }
  .btn-send:hover { background: #8078ff; }

  .empty {
    text-align: center; padding: 60px 20px;
    color: var(--muted); font-size: 14px;
  }
  .empty-icon { font-size: 36px; margin-bottom: 12px; }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .ticket-card { animation: fadeIn 0.3s ease both; }
`;

function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});

  const token = localStorage.getItem("token");
  const socket = io("http://localhost:5000");
  const api = axios.create({
    baseURL: "https://ticket-system-ashen-pi.vercel.app/",
    headers: { Authorization: `Bearer ${token}` }
  });

  const logout = () => { localStorage.removeItem("token"); window.location.reload(); };

  const fetchTickets = async () => {
    const res = await api.get("/tickets");
    setTickets(res.data);
    res.data.forEach((t) => fetchComments(t.id));
  };

  const fetchComments = async (ticketId) => {
    const res = await api.get(`/comments/${ticketId}`);
    setComments((prev) => ({ ...prev, [ticketId]: res.data }));
  };

  const createTicket = async () => {
    if (!title || !description) return;
    await api.post("/tickets", { title, description, priority });
    setTitle(""); setDescription(""); setPriority("MEDIUM");
    fetchTickets();
  };

  const deleteTicket = async (id) => { await api.delete(`/tickets/${id}`); fetchTickets(); };
  const updateStatus = async (id, status) => { await api.put(`/tickets/${id}`, { status }); fetchTickets(); };

  const addComment = async (ticketId) => {
    if (!newComment[ticketId]) return;
    await api.post(`/comments/${ticketId}`, { message: newComment[ticketId] });
    setNewComment({ ...newComment, [ticketId]: "" });
    fetchComments(ticketId);
  };

  useEffect(() => {
    fetchTickets();

    socket.on("ticketUpdated", () => {
      fetchTickets();
    });

    return () => socket.off("ticketUpdated");
  }, []);

  useEffect(() => {
    let temp = tickets;
    if (filter !== "ALL") temp = temp.filter((t) => t.status === filter);
    if (search) temp = temp.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));
    setFilteredTickets(temp);
  }, [tickets, filter, search]);

  const counts = {
    total: tickets.length,
    open: tickets.filter(t => t.status === "OPEN").length,
    progress: tickets.filter(t => t.status === "IN_PROGRESS").length,
    closed: tickets.filter(t => t.status === "CLOSED").length,
  };

  return (
    <>
      <style>{styles}</style>
      <div className="layout">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="logo">
            <span className="logo-dot" />
            Support Desk
          </div>

          <nav className="nav">
            <button className="nav-item active">
              <span className="nav-icon">⊞</span> Dashboard
            </button>
            <button className="nav-item">
              <span className="nav-icon">＋</span> New Ticket
            </button>
            <button className="nav-item">
              <span className="nav-icon">◈</span> My Tickets
            </button>
          </nav>

          <button className="logout-btn" onClick={logout}>
            <span>↩</span> Logout
          </button>
        </aside>

        {/* MAIN */}
        <main className="main">
          <div className="page-header">
            <div>
              <h1 className="page-title">Ticket Dashboard</h1>
              <p className="page-sub">Manage and track all your support tickets</p>
            </div>
          </div>

          {/* STATS */}
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-label">Total</div>
              <div className="stat-value total">{counts.total}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Open</div>
              <div className="stat-value open">{counts.open}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">In Progress</div>
              <div className="stat-value progress">{counts.progress}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Closed</div>
              <div className="stat-value closed">{counts.closed}</div>
            </div>
          </div>

          <div className="two-col">
            {/* CREATE FORM */}
            <div className="create-card">
              <div className="card-title">Create Ticket</div>

              <div className="field">
                <label>Title</label>
                <input className="input" placeholder="Brief summary..." value={title} onChange={e => setTitle(e.target.value)} />
              </div>

              <div className="field">
                <label>Description</label>
                <input className="input" placeholder="Describe the issue..." value={description} onChange={e => setDescription(e.target.value)} />
              </div>

              <div className="field">
                <label>Priority</label>
                <select className="select" value={priority} onChange={e => setPriority(e.target.value)}>
                  <option value="LOW">🔵 Low</option>
                  <option value="MEDIUM">🟦 Medium</option>
                  <option value="HIGH">🟠 High</option>
                  <option value="URGENT">🔴 Urgent</option>
                </select>
              </div>

              <button className="btn-primary" onClick={createTicket}>+ Create Ticket</button>
            </div>

            {/* TICKET LIST */}
            <div className="ticket-section">
              <div className="toolbar">
                <div className="search-wrap">
                  <span className="search-icon">⌕</span>
                  <input className="search-input" placeholder="Search tickets..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="filters">
                  {["ALL","OPEN","IN_PROGRESS","CLOSED"].map(f => (
                    <button key={f} className={`filter-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
                      {f === "ALL" ? "All" : f === "IN_PROGRESS" ? "In Progress" : f.charAt(0) + f.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "16px" }}>
                {filteredTickets.length} ticket{filteredTickets.length !== 1 ? "s" : ""}
              </p>

              {filteredTickets.length === 0 ? (
                <div className="empty">
                  <div className="empty-icon">◎</div>
                  No tickets found
                </div>
              ) : (
                filteredTickets.map((ticket, i) => (
                  <div key={ticket.id} className={`ticket-card ${ticket.status}`} style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="ticket-top">
                      <div className="ticket-title">{ticket.title}</div>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        {ticket.priority && (
                          <span className={`priority-badge ${ticket.priority}`}>{ticket.priority}</span>
                        )}
                        <span className={`status-badge ${ticket.status}`}>
                          {ticket.status === "IN_PROGRESS" ? "In Progress" : ticket.status.charAt(0) + ticket.status.slice(1).toLowerCase()}
                        </span>
                      </div>
                    </div>

                    <p className="ticket-desc">{ticket.description}</p>

                    <div className="ticket-actions">
                      <button className="btn-action btn-start" onClick={() => updateStatus(ticket.id, "IN_PROGRESS")}>▶ Start</button>
                      <button className="btn-action btn-close" onClick={() => updateStatus(ticket.id, "CLOSED")}>✓ Close</button>
                      <button className="btn-action btn-delete" onClick={() => deleteTicket(ticket.id)}>✕ Delete</button>
                    </div>

                    <div className="comments-section">
                      <div className="comments-label">Comments ({(comments[ticket.id] || []).length})</div>

                      {(comments[ticket.id] || []).map(c => (
                        <div key={c.id} className="comment-item">{c.message}</div>
                      ))}

                      <div className="comment-row">
                        <input
                          className="comment-input"
                          placeholder="Add a comment..."
                          value={newComment[ticket.id] || ""}
                          onChange={e => setNewComment({ ...newComment, [ticket.id]: e.target.value })}
                          onKeyDown={e => e.key === "Enter" && addComment(ticket.id)}
                        />
                        <button className="btn-send" onClick={() => addComment(ticket.id)}>Send</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default Dashboard;
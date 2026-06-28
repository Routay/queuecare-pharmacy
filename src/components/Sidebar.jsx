import { Pill, LayoutDashboard, Settings, LogOut } from 'lucide-react'

export default function Sidebar({ user, onLogout }) {
  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-logo">
        <Pill size={28} />
        <div>
          <h1>QueueCare</h1>
          <span>Pharmacie</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button className="nav-item active" id="nav-dashboard">
          <LayoutDashboard size={20} />
          Tableau de Bord
        </button>
        <button className="nav-item" id="nav-settings">
          <Settings size={20} />
          Paramètres
        </button>
      </nav>

      <div className="sidebar-footer" style={{ marginTop: 'auto' }}>
        <button className="nav-item btn-logout" onClick={onLogout} style={{ color: 'hsl(var(--color-danger))' }}>
          <LogOut size={20} />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}

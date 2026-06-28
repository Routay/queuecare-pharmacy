import { Pill, LayoutDashboard, Settings, LogOut, FileText } from 'lucide-react'

export default function Sidebar({ user, onLogout, activeTab, onTabChange }) {
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
        <button 
          className={`nav-item ${activeTab === 'stock' ? 'active' : ''}`}
          onClick={() => onTabChange('stock')}
        >
          <LayoutDashboard size={20} />
          Tableau de Bord
        </button>
        <button 
          className={`nav-item ${activeTab === 'prescriptions' ? 'active' : ''}`}
          onClick={() => onTabChange('prescriptions')}
        >
          <FileText size={20} />
          Ordonnances
        </button>
        <button className="nav-item">
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

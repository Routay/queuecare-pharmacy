import { useState, useEffect, useCallback } from 'react'
import { Search, Plus, LogOut, Bell } from 'lucide-react'
import Sidebar from './components/Sidebar'
import StatCards from './components/StatCards'
import StockTable from './components/StockTable'
import AddMedicineModal from './components/AddMedicineModal'
import LoginScreen from './components/LoginScreen'

// Configuration centralisée
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const PHARMACY_ID = 1;

function App() {
  const [token, setToken] = useState(localStorage.getItem('queuecare_pharmacy_token'))
  const [user, setUser] = useState(null)
  
  const [pharmacy, setPharmacy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Vérifier le token au chargement
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const res = await fetch(`${API_URL}/auth/me?token=${token}`)
        if (res.ok) {
          const userData = await res.json()
          setUser(userData)
        } else {
          handleLogout()
        }
      } catch (err) {
        console.error("Token verification failed", err)
        handleLogout()
      }
    }
    verifyToken()
  }, [token])

  const handleLogin = (newToken, userData) => {
    setToken(newToken)
    setUser(userData)
    localStorage.setItem('queuecare_pharmacy_token', newToken)
  }

  const handleLogout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('queuecare_pharmacy_token')
    if (token) {
      fetch(`${API_URL}/auth/logout?token=${token}`, { method: 'POST' }).catch(e => console.error(e))
    }
  }

  const fetchPharmacyData = useCallback(async () => {
    if (!token) return;
    try {
      setError(null);
      const res = await fetch(`${API_URL}/pharmacies/`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const myPharmacy = data.find(p => p.id === PHARMACY_ID);
      if (!myPharmacy) throw new Error('Pharmacie introuvable dans la base.');
      setPharmacy(myPharmacy);
    } catch (err) {
      console.error("Erreur de récupération des données:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchPharmacyData();
    }
  }, [fetchPharmacyData, token]);

  const updateStock = async (medicineName, inStock) => {
    try {
      const res = await fetch(`${API_URL}/pharmacies/${PHARMACY_ID}/stock`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: medicineName, inStock })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await fetchPharmacyData();
    } catch (err) {
      console.error("Erreur lors de la mise à jour:", err);
    }
  };

  const deleteMedicine = async (medicineName) => {
    if (!window.confirm(`Supprimer « ${medicineName} » de l'inventaire ?`)) return;
    try {
      const res = await fetch(`${API_URL}/pharmacies/${PHARMACY_ID}/stock/${encodeURIComponent(medicineName)}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await fetchPharmacyData();
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
    }
  };

  const handleAddMedicine = async (name, inStock) => {
    await updateStock(name, inStock);
    setShowAddModal(false);
  };

  // --- Render ---

  if (!token) {
    return <LoginScreen onLogin={handleLogin} />
  }

  if (loading) {
    return (
      <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-spinner" />
        <p className="text-muted" style={{ marginTop: '16px' }}>Connexion au serveur…</p>
      </div>
    );
  }

  if (error || !pharmacy) {
    return (
      <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <p className="text-danger" style={{ fontSize: '1.1rem' }}>⚠️ {error || 'Pharmacie introuvable'}</p>
        <button className="btn btn-primary" onClick={() => { setLoading(true); fetchPharmacyData(); }}>Réessayer</button>
        <button className="btn btn-secondary" onClick={handleLogout}>Déconnexion</button>
      </div>
    );
  }

  const stock = pharmacy.stock || [];
  const outOfStockItems = stock.filter(item => !item.inStock);
  const filteredStock = stock.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      <Sidebar user={user} onLogout={handleLogout} />

      <main className="main-content">
        <header className="page-header">
          <div className="header-info">
            <h1 className="page-title">{pharmacy.name}</h1>
            <p className="page-subtitle">{pharmacy.address} • Gestion des stocks</p>
          </div>
          <div className="header-actions">
            {/* Notification Bell */}
            <div className="notification-wrapper" style={{ position: 'relative', marginRight: '1rem' }}>
              <button 
                className="btn-icon" 
                onClick={() => setShowNotifications(!showNotifications)}
                title="Alertes de stock"
                style={{ position: 'relative', background: 'transparent', border: 'none', cursor: 'pointer', color: 'hsl(var(--text-primary))' }}
              >
                <Bell size={24} />
                {outOfStockItems.length > 0 && (
                  <span className="notification-badge" style={{
                    position: 'absolute', top: -5, right: -5, 
                    background: 'hsl(var(--color-danger))', color: 'white', 
                    borderRadius: '50%', padding: '2px 6px', fontSize: '10px', fontWeight: 'bold'
                  }}>
                    {outOfStockItems.length}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="glass-panel" style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: '12px',
                  width: '320px', zIndex: 50, padding: '1rem'
                }}>
                  <h4 style={{ marginBottom: '1rem', color: 'hsl(var(--color-danger))', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Alertes de Stock ({outOfStockItems.length})
                  </h4>
                  {outOfStockItems.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {outOfStockItems.map((item, idx) => (
                        <li key={idx} style={{ padding: '10px', background: 'hsl(var(--color-danger)/0.1)', border: '1px solid hsl(var(--color-danger)/0.2)', borderRadius: '8px', fontSize: '0.85rem' }}>
                          <strong>{item.name}</strong> est actuellement en rupture de stock.
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))' }}>Aucune rupture de stock signalée.</p>
                  )}
                </div>
              )}
            </div>

            <div className="user-profile">
               <span className="user-avatar">{user?.avatar || 'PH'}</span>
               <div className="user-info">
                 <span className="user-name">{user?.fullName || 'Pharmacien'}</span>
                 <span className="user-role">{user?.role || 'Utilisateur'}</span>
               </div>
            </div>
            <button className="btn-icon btn-logout" onClick={handleLogout} title="Déconnexion" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'hsl(var(--text-muted))', marginLeft: '1rem' }}>
              <LogOut size={24} />
            </button>
          </div>
        </header>

        <StatCards stock={stock} />

        {/* Barre d'actions : Recherche + Ajout */}
        <div className="glass-panel action-bar" id="action-bar">
          <div className="search-wrapper">
            <Search size={20} className="search-icon text-muted" />
            <input
              type="text"
              className="input-field"
              placeholder="Rechercher un médicament…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              id="search-medicine"
            />
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)} id="btn-add-medicine">
            <Plus size={18} />
            Ajouter un Médicament
          </button>
        </div>

        <StockTable
          stock={filteredStock}
          onToggleStock={updateStock}
          onDelete={deleteMedicine}
        />
      </main>

      {showAddModal && (
        <AddMedicineModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddMedicine}
        />
      )}
    </div>
  )
}

export default App

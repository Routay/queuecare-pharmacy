import { useState, useEffect, useCallback } from 'react'
import { Search, Plus, LogOut, Bell, History, Download, AlertCircle, AlertTriangle } from 'lucide-react'
import Sidebar from './components/Sidebar'
import StatCards from './components/StatCards'
import StockTable from './components/StockTable'
import AddMedicineModal from './components/AddMedicineModal'
import TransactionHistoryModal from './components/TransactionHistoryModal'
import LoginScreen from './components/LoginScreen'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

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
  const [showHistoryModal, setShowHistoryModal] = useState(false);
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

  const updateStock = async (medicineData) => {
    try {
      const res = await fetch(`${API_URL}/pharmacies/${PHARMACY_ID}/stock`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medicineData)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await fetchPharmacyData();
    } catch (err) {
      console.error("Erreur lors de la mise à jour:", err);
    }
  };

  const logTransaction = async (medicine, type, quantity) => {
    try {
      await fetch(`${API_URL}/pharmacies/${PHARMACY_ID}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicine,
          type,
          quantity,
          user: user?.fullName || 'Utilisateur'
        })
      });
    } catch (err) {
      console.error("Erreur log transaction:", err);
    }
  };

  const handleUpdateQuantity = async (item, newQuantity, type) => {
    const diff = Math.abs(newQuantity - item.quantity);
    if (diff > 0 && type) {
      await logTransaction(item.name, type, diff);
    }
    await updateStock({ ...item, quantity: newQuantity });
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

  const handleAddMedicine = async (newMedicine) => {
    await updateStock(newMedicine);
    await logTransaction(newMedicine.name, 'ENTREE', newMedicine.quantity);
    setShowAddModal(false);
  };

  const handleExportPDF = () => {
    if (!pharmacy) return;
    const doc = new jsPDF()
    
    doc.setFontSize(18)
    doc.setTextColor(33, 37, 41)
    doc.text(`Inventaire - ${pharmacy.name}`, 14, 22)
    
    doc.setFontSize(11)
    doc.setTextColor(100)
    doc.text(`Généré le : ${new Date().toLocaleString('fr-FR')}`, 14, 30)

    const tableColumn = ["Médicament", "Catégorie", "Qté", "Seuil", "Péremption"]
    const tableRows = []

    const stockList = pharmacy.stock || [];
    stockList.forEach(entry => {
      const rowData = [
        entry.name,
        entry.category || 'Général',
        entry.quantity.toString(),
        entry.threshold.toString(),
        entry.expirationDate !== '2099-12-31' ? entry.expirationDate : 'N/A'
      ]
      tableRows.push(rowData)
    })

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [34, 197, 94] },
      styles: { fontSize: 9 }
    })

    doc.save(`Inventaire_${pharmacy.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`)
  }

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
  
  const isExpiringSoon = (dateString) => {
    if (!dateString || dateString === '2099-12-31') return false;
    const exp = new Date(dateString);
    const now = new Date();
    const diff = exp - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days <= 60 && days > 0;
  };
  const isExpired = (dateString) => {
    if (!dateString || dateString === '2099-12-31') return false;
    return new Date(dateString) < new Date();
  };

  const alertItems = stock.filter(item => 
    item.quantity <= item.threshold || 
    isExpiringSoon(item.expirationDate) || 
    isExpired(item.expirationDate)
  );

  const filteredStock = stock.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="app-container">
      <Sidebar user={user} onLogout={handleLogout} />

      <main className="main-content">
        <header className="page-header">
          <div className="header-info">
            <h1 className="page-title">{pharmacy.name}</h1>
            <p className="page-subtitle">{pharmacy.address} • ERP Pharmaceutique</p>
          </div>
          <div className="header-actions">
            
            <button 
              className="btn-icon" 
              onClick={() => setShowHistoryModal(true)}
              title="Historique des mouvements"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'hsl(var(--text-primary))' }}
            >
              <History size={24} />
            </button>

            <button 
              className="btn-icon" 
              onClick={handleExportPDF}
              title="Exporter l'inventaire (PDF)"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'hsl(var(--text-primary))' }}
            >
              <Download size={24} />
            </button>

            {/* Notification Bell */}
            <div className="notification-wrapper" style={{ position: 'relative', marginRight: '1rem' }}>
              <button 
                className="btn-icon" 
                onClick={() => setShowNotifications(!showNotifications)}
                title="Alertes de stock"
                style={{ position: 'relative', background: 'transparent', border: 'none', cursor: 'pointer', color: 'hsl(var(--text-primary))' }}
              >
                <Bell size={24} />
                {alertItems.length > 0 && (
                  <span className="notification-badge" style={{
                    position: 'absolute', top: -5, right: -5, 
                    background: 'hsl(var(--color-danger))', color: 'white', 
                    borderRadius: '50%', padding: '2px 6px', fontSize: '10px', fontWeight: 'bold'
                  }}>
                    {alertItems.length}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="glass-panel" style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: '16px',
                  width: '360px', zIndex: 1000, padding: '1.25rem',
                  background: 'hsl(var(--bg-elevated) / 0.98)',
                  boxShadow: '0 24px 60px hsla(0,0%,0%,0.6)',
                  border: '1px solid hsl(var(--border-color))'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid hsl(var(--border-color)/0.5)', paddingBottom: '0.75rem' }}>
                    <h4 style={{ color: 'hsl(var(--color-danger))', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontSize: '0.95rem' }}>
                      <AlertCircle size={18} />
                      Alertes ({alertItems.length})
                    </h4>
                  </div>
                  {alertItems.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '350px', overflowY: 'auto', paddingRight: '4px' }}>
                      {alertItems.map((item, idx) => {
                        const isOut = item.quantity === 0;
                        const isExpiredItem = isExpired(item.expirationDate);
                        const isWarning = item.quantity > 0 && item.quantity <= item.threshold;
                        
                        let Icon = AlertTriangle;
                        let colorVar = '--color-warning';
                        if (isOut || isExpiredItem) {
                          Icon = AlertCircle;
                          colorVar = '--color-danger';
                        }
                        
                        return (
                          <li key={idx} style={{ 
                            padding: '12px', 
                            background: `hsl(var(${colorVar})/0.1)`, 
                            borderLeft: `4px solid hsl(var(${colorVar}))`, 
                            borderRadius: '0 8px 8px 0', 
                            fontSize: '0.85rem',
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'flex-start',
                            transition: 'all 0.2s'
                          }}>
                            <Icon size={16} style={{ color: `hsl(var(${colorVar}))`, flexShrink: 0, marginTop: '2px' }} />
                            <div style={{ color: 'hsl(var(--text-secondary))', lineHeight: '1.4' }}>
                              <strong style={{ color: 'hsl(var(--text-primary))', display: 'block', marginBottom: '4px', fontSize: '0.9rem' }}>{item.name}</strong> 
                              {isOut && <span>⚠️ Ce produit est <strong>en rupture totale</strong>. Un réapprovisionnement urgent est requis.</span>}
                              {isWarning && <span>Attention, le stock est <strong>critiquement bas</strong> (il ne reste que {item.quantity} unités).</span>}
                              {isExpiredItem && <span>❌ Ce produit est <strong>périmé</strong> depuis le {item.expirationDate}. À retirer du rayon.</span>}
                              {!isExpiredItem && isExpiringSoon(item.expirationDate) && <span>⏳ Ce produit arrive à <strong>péremption prochainement</strong> ({item.expirationDate}).</span>}
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'hsl(var(--text-muted))' }}>
                      <AlertCircle size={32} style={{ opacity: 0.2, margin: '0 auto 10px' }} />
                      <p style={{ fontSize: '0.85rem', margin: 0 }}>Aucune alerte critique.</p>
                    </div>
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
              placeholder="Rechercher par nom ou catégorie…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              id="search-medicine"
            />
          </div>
              <button className="btn-premium" onClick={() => setShowAddModal(true)}>
                <Plus size={18} />
                Nouvelle Entrée
              </button>
        </div>

        <StockTable
          stock={filteredStock}
          onUpdateQuantity={handleUpdateQuantity}
          onDelete={deleteMedicine}
        />
      </main>

      {showAddModal && (
        <AddMedicineModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddMedicine}
        />
      )}

      {showHistoryModal && (
        <TransactionHistoryModal
          onClose={() => setShowHistoryModal(false)}
          transactions={pharmacy.transactions || []}
        />
      )}
    </div>
  )
}

export default App


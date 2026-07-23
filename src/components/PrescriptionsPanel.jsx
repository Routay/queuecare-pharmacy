import { useState, useEffect } from 'react'
import { FileText, CheckCircle, Package, User } from 'lucide-react'

export default function PrescriptionsPanel({ user, pharmacyId = 1, onStockUpdate }) {
  const [prescriptions, setPrescriptions] = useState([])
  const [activeTab, setActiveTab] = useState('pending')
  const [isLoading, setIsLoading] = useState(true)
  const [processingId, setProcessingId] = useState(null)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)

  const fetchPrescriptions = async () => {
    try {
      setIsLoading(true)
      let url = activeTab === 'ordered' 
        ? `${import.meta.env.VITE_API_URL}/consultations/prescriptions/pharmacy/${pharmacyId}?status=ordered`
        : `${import.meta.env.VITE_API_URL}/consultations/prescriptions?status=pending`

      const res = await fetch(url)
      if (!res.ok) throw new Error("Erreur de récupération des ordonnances")
      const data = await res.json()
      
      setPrescriptions(data.data || data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPrescriptions()
    const interval = setInterval(fetchPrescriptions, 10000)
    return () => clearInterval(interval)
  }, [activeTab])

  const handleDeliver = async (prescription) => {
    setProcessingId(prescription.id)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/consultations/prescriptions/${prescription.id}/deliver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pharmacyId: pharmacyId,
          pharmacistName: user?.fullName || 'Pharmacien'
        })
      })
      
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.detail || "Erreur lors de la délivrance")
      }
      
      setToast("Ordonnance délivrée avec succès ! Le stock a été mis à jour.")
      setTimeout(() => setToast(null), 3000)
      
      // Update local list
      setPrescriptions(prev => prev.filter(p => p.id !== prescription.id))
      
      // Notify parent to refresh stock if needed
      if (onStockUpdate) onStockUpdate()
    } catch (err) {
      setError(err.message)
      setTimeout(() => setError(null), 5000)
    } finally {
      setProcessingId(null)
    }
  }

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleTimeString('fr-FR', {
      hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short'
    })
  }

  if (isLoading && prescriptions.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'hsl(var(--text-muted))' }}>
        <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
        <p>Chargement des ordonnances...</p>
      </div>
    )
  }

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h2>Gestion des Ordonnances</h2>
        <p>Gérez les prescriptions médicales et les commandes des patients.</p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button 
            className={`btn ${activeTab === 'pending' ? 'btn-primary' : ''}`}
            style={activeTab !== 'pending' ? { background: 'hsl(var(--bg-primary))', color: 'hsl(var(--text-primary))' } : {}}
            onClick={() => setActiveTab('pending')}
          >
            Toutes les ordonnances
          </button>
          <button 
            className={`btn ${activeTab === 'ordered' ? 'btn-primary' : ''}`}
            style={activeTab !== 'ordered' ? { background: 'hsl(var(--bg-primary))', color: 'hsl(var(--text-primary))' } : {}}
            onClick={() => setActiveTab('ordered')}
          >
            Commandes Reçues
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner" style={{ background: 'hsl(var(--color-danger)/0.1)', color: 'hsl(var(--color-danger))', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {toast && (
        <div className="success-toast" style={{ position: 'fixed', bottom: '20px', right: '20px', background: 'hsl(var(--color-success))', color: 'white', padding: '1rem 1.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', animation: 'slideIn 0.3s ease-out' }}>
          <CheckCircle size={20} />
          {toast}
        </div>
      )}

      {prescriptions.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'hsl(var(--text-muted))', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <FileText size={48} style={{ opacity: 0.2 }} />
          <h3>Aucune ordonnance en attente</h3>
          <p>Toutes les prescriptions ont été traitées.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {prescriptions.map(prescription => (
            <div key={prescription.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid hsl(var(--border-color)/0.5)', paddingBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem', color: 'hsl(var(--text-primary))', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={18} color="hsl(var(--color-primary))" />
                    Patient : {prescription.ticketId.split('-').pop()}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(var(--text-secondary))', fontSize: '0.85rem' }}>
                    <User size={14} /> Dr. {prescription.doctorName}
                  </div>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', background: 'hsl(var(--bg-primary)/0.5)', padding: '4px 8px', borderRadius: '12px' }}>
                  {formatDate(prescription.date)}
                </span>
              </div>
              
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 0.5rem', color: 'hsl(var(--text-secondary))', fontSize: '0.9rem' }}>Médicaments prescrits :</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {prescription.medicines.map((med, idx) => (
                    <li key={idx} style={{ background: 'hsl(var(--bg-primary)/0.3)', padding: '0.75rem', borderRadius: '8px', border: '1px solid hsl(var(--border-color)/0.3)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <strong style={{ color: 'hsl(var(--text-primary))' }}>{med.name}</strong>
                        <span style={{ background: 'hsl(var(--color-primary)/0.1)', color: 'hsl(var(--color-primary))', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                          x{med.quantity}
                        </span>
                      </div>
                      {med.dosage && <div style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))' }}>Posologie: {med.dosage}</div>}
                    </li>
                  ))}
                </ul>
              </div>

              {prescription.notes && (
                <div style={{ padding: '0.75rem', background: 'hsl(var(--color-warning)/0.05)', borderLeft: '3px solid hsl(var(--color-warning))', borderRadius: '0 8px 8px 0', fontSize: '0.85rem', color: 'hsl(var(--text-secondary))' }}>
                  <strong>Notes :</strong> {prescription.notes}
                </div>
              )}

              {prescription.status === 'ordered' && (
                <div style={{ padding: '0.75rem', background: 'hsl(var(--color-primary)/0.05)', borderLeft: '3px solid hsl(var(--color-primary))', borderRadius: '0 8px 8px 0', fontSize: '0.85rem', color: 'hsl(var(--text-primary))', marginTop: '0.5rem' }}>
                  <strong>Commande Patient :</strong><br/>
                  Mode: {prescription.deliveryMethod === 'delivery' ? 'Livraison à domicile' : 'Retrait sur place'}
                  {prescription.deliveryAddress && <div>Adresse: {prescription.deliveryAddress}</div>}
                </div>
              )}

              <button 
                className="btn btn-primary" 
                onClick={() => handleDeliver(prescription)}
                disabled={processingId === prescription.id}
                style={{ width: '100%', marginTop: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
              >
                {processingId === prescription.id ? 'Traitement...' : (
                  <>
                    <Package size={18} /> Délivrer l'ordonnance
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

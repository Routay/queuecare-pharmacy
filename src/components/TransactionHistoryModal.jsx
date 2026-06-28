import { X, ArrowDownRight, ArrowUpRight } from 'lucide-react'

export default function TransactionHistoryModal({ onClose, transactions }) {
  return (
    <div className="modal-overlay" onClick={onClose} id="transaction-modal">
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: '95%', width: '1200px' }}>
        <div className="modal-header">
          <h3>Historique des Mouvements</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        {(!transactions || transactions.length === 0) ? (
          <div className="empty-queue" style={{ margin: '2rem 0' }}>
            <p>Aucun mouvement enregistré pour le moment.</p>
          </div>
        ) : (
          <div className="history-table-wrapper glass-panel-solid" style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '1rem' }}>
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Médicament</th>
                  <th>Type</th>
                  <th>Qté</th>
                  <th>Utilisateur</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice().reverse().map((t, idx) => (
                  <tr key={idx}>
                    <td style={{ fontSize: '0.85rem' }}>
                      {new Date(t.date).toLocaleString('fr-FR', { 
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td><strong>{t.medicine}</strong></td>
                    <td>
                      {t.type === 'ENTREE' ? (
                        <span style={{ color: 'hsl(var(--color-success))', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                          <ArrowDownRight size={14} /> Entrée
                        </span>
                      ) : (
                        <span style={{ color: 'hsl(var(--color-warning))', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                          <ArrowUpRight size={14} /> Sortie
                        </span>
                      )}
                    </td>
                    <td>{t.quantity}</td>
                    <td style={{ fontSize: '0.85rem', opacity: 0.8 }}>{t.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

import { Trash2, Plus, Minus, AlertTriangle, AlertCircle, Clock } from 'lucide-react'

export default function StockTable({ stock, onUpdateQuantity, onDelete }) {
  if (stock.length === 0) {
    return (
      <div className="glass-panel empty-queue">
        <p>Aucun médicament trouvé.</p>
      </div>
    )
  }

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

  return (
    <div className="history-table-wrapper glass-panel-solid" style={{ overflowX: 'auto' }}>
      <table className="history-table" id="stock-table">
        <thead>
          <tr>
            <th>Médicament</th>
            <th>Catégorie</th>
            <th>Stock</th>
            <th>Seuil</th>
            <th>Péremption</th>
            <th>Statut</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stock.map((item, idx) => {
            const stockWarning = item.quantity <= item.threshold && item.quantity > 0;
            const stockOut = item.quantity === 0;
            const expiring = isExpiringSoon(item.expirationDate);
            const expired = isExpired(item.expirationDate);

            return (
              <tr key={idx}>
                <td>
                  <strong style={{ color: 'hsl(var(--text-primary))' }}>{item.name}</strong>
                </td>
                <td>
                  <span className="history-dept-badge" style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                    {item.category || 'Général'}
                  </span>
                </td>
                <td>
                  <span style={{ 
                    fontWeight: 'bold', 
                    color: stockOut ? 'hsl(var(--color-danger))' : stockWarning ? 'hsl(var(--color-warning))' : 'inherit' 
                  }}>
                    {item.quantity}
                  </span>
                </td>
                <td>{item.threshold}</td>
                <td>
                  <span style={{ 
                    color: expired ? 'hsl(var(--color-danger))' : expiring ? 'hsl(var(--color-warning))' : 'inherit',
                    display: 'flex', alignItems: 'center', gap: '4px'
                  }}>
                    {item.expirationDate !== '2099-12-31' ? item.expirationDate : 'N/A'}
                    {(expiring || expired) && <Clock size={14} />}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {stockOut && (
                      <span className="wait-badge long" style={{ fontSize: '0.7rem' }}>
                        <AlertCircle size={12} style={{ marginRight: '4px' }}/> Rupture
                      </span>
                    )}
                    {stockWarning && (
                      <span className="wait-badge medium" style={{ fontSize: '0.7rem' }}>
                        <AlertTriangle size={12} style={{ marginRight: '4px' }}/> Bas
                      </span>
                    )}
                    {expired && (
                      <span className="wait-badge long" style={{ fontSize: '0.7rem' }}>Expiré</span>
                    )}
                    {!stockOut && !stockWarning && !expired && (
                      <span className="wait-badge short" style={{ fontSize: '0.7rem' }}>OK</span>
                    )}
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button
                      className="call-next-btn"
                      style={{ padding: '0.3rem', fontSize: '0.8rem' }}
                      onClick={() => onUpdateQuantity(item, item.quantity - 1, 'SORTIE')}
                      disabled={item.quantity <= 0}
                      title="Retirer 1"
                    >
                      <Minus size={16} />
                    </button>
                    <button
                      className="call-next-btn"
                      style={{ padding: '0.3rem', fontSize: '0.8rem' }}
                      onClick={() => onUpdateQuantity(item, item.quantity + 1, 'ENTREE')}
                      title="Ajouter 1"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      className="call-next-btn"
                      style={{ 
                        padding: '0.3rem', 
                        background: 'transparent',
                        border: '1px solid hsl(var(--color-danger) / 0.3)',
                        color: 'hsl(var(--color-danger))',
                        boxShadow: 'none',
                        marginLeft: '0.5rem'
                      }}
                      onClick={() => onDelete(item.name)}
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

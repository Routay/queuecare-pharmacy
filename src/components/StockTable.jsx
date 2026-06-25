import { Trash2 } from 'lucide-react'

export default function StockTable({ stock, onToggleStock, onDelete }) {
  if (stock.length === 0) {
    return (
      <div className="glass-panel empty-queue">
        <p>Aucun médicament trouvé.</p>
      </div>
    )
  }

  return (
    <div className="patient-list" id="stock-table">
      {stock.map((item, idx) => (
        <div key={idx} className={`patient-card glass-panel-solid ${!item.inStock ? 'called' : ''}`} style={{ marginBottom: '0.5rem' }}>
          <div className="patient-info">
            <h4 className="patient-ticket" style={{ fontSize: '1.05rem' }}>{item.name}</h4>
            <div className={`medicine-status ${item.inStock ? 'in-stock' : 'out-of-stock'}`}>
              <div className={`medicine-dot ${item.inStock ? 'in-stock' : 'out-of-stock'}`}></div>
              {item.inStock ? 'En Stock' : 'Rupture'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              className="call-next-btn"
              style={{ 
                padding: '0.5rem 1rem', 
                fontSize: '0.8rem', 
                background: item.inStock ? 'transparent' : 'linear-gradient(135deg, hsl(var(--color-primary)), hsl(var(--color-primary-light)))',
                border: item.inStock ? '1px solid hsl(var(--border-color))' : 'none',
                color: item.inStock ? 'hsl(var(--text-primary))' : 'white',
                boxShadow: item.inStock ? 'none' : '0 4px 16px var(--glow-primary)'
              }}
              onClick={() => onToggleStock(item.name, !item.inStock)}
              id={`toggle-${idx}`}
            >
              {item.inStock ? 'Marquer Rupture' : 'Marquer En Stock'}
            </button>
            <button
              className="call-next-btn"
              style={{ 
                padding: '0.5rem', 
                background: 'transparent',
                border: '1px solid hsl(var(--color-danger) / 0.3)',
                color: 'hsl(var(--color-danger))',
                boxShadow: 'none'
              }}
              onClick={() => onDelete(item.name)}
              title="Supprimer"
              id={`delete-${idx}`}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

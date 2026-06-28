import { Pill, AlertCircle, AlertTriangle } from 'lucide-react'

export default function StatCards({ stock }) {
  const inStockCount = stock.filter(i => i.quantity > i.threshold).length;
  const warningCount = stock.filter(i => i.quantity <= i.threshold && i.quantity > 0).length;
  const outOfStockCount = stock.filter(i => i.quantity === 0).length;

  return (
    <div className="stats-grid">
      <div className="stat-card glass-panel primary" id="stat-total">
        <div className="stat-icon primary">
          <Pill size={20} />
        </div>
        <div className="stat-value">{stock.length}</div>
        <div className="stat-label">Total Références</div>
      </div>
      
      <div className="stat-card glass-panel accent" id="stat-in-stock">
        <div className="stat-icon accent">
          <Pill size={20} />
        </div>
        <div className="stat-value">{inStockCount}</div>
        <div className="stat-label">Stock Suffisant</div>
      </div>

      <div className={`stat-card glass-panel ${warningCount > 0 ? 'warning' : ''}`} id="stat-warning-stock">
        <div className={`stat-icon ${warningCount > 0 ? 'warning' : ''}`}>
          <AlertTriangle size={20} />
        </div>
        <div className="stat-value">{warningCount}</div>
        <div className="stat-label">Stock Faible</div>
      </div>
      
      <div className={`stat-card glass-panel ${outOfStockCount > 0 ? 'danger' : ''}`} id="stat-out-of-stock">
        <div className={`stat-icon ${outOfStockCount > 0 ? 'danger' : ''}`}>
          <AlertCircle size={20} />
        </div>
        <div className="stat-value">{outOfStockCount}</div>
        <div className="stat-label">Ruptures</div>
      </div>
    </div>
  )
}

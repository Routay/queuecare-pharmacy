import { Pill, AlertCircle } from 'lucide-react'

export default function StatCards({ stock }) {
  const inStockCount = stock.filter(i => i.inStock).length;
  const outOfStockCount = stock.length - inStockCount;

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
        <div className="stat-label">En Stock</div>
      </div>
      
      <div className={`stat-card glass-panel ${outOfStockCount > 0 ? 'warning' : ''}`} id="stat-out-of-stock">
        <div className={`stat-icon ${outOfStockCount > 0 ? 'warning' : ''}`}>
          <AlertCircle size={20} />
        </div>
        <div className="stat-value">{outOfStockCount}</div>
        <div className="stat-label">Ruptures de stock</div>
      </div>
    </div>
  )
}

import { X } from 'lucide-react'
import { useState } from 'react'

export default function AddMedicineModal({ onClose, onAdd }) {
  const [name, setName] = useState('');
  const [inStock, setInStock] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name, inStock);
  };

  return (
    <div className="modal-overlay" onClick={onClose} id="add-medicine-modal">
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Ajouter un médicament</h3>
          <button className="modal-close" onClick={onClose} id="modal-close-btn">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="medicine-name">Nom du médicament</label>
            <input
              type="text"
              className="input-field"
              id="medicine-name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="ex: Paracétamol 500mg"
              autoFocus
              required
            />
          </div>
          <div className="input-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '12px', marginTop: '20px' }}>
            <input
              type="checkbox"
              id="medicine-instock"
              checked={inStock}
              onChange={e => setInStock(e.target.checked)}
              style={{ width: '18px', height: '18px' }}
            />
            <label htmlFor="medicine-instock" style={{ margin: 0, fontSize: '1rem', color: 'hsl(var(--color-text))' }}>
              Actuellement en stock
            </label>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn btn-primary" id="add-medicine-submit">Ajouter</button>
          </div>
        </form>
      </div>
    </div>
  )
}

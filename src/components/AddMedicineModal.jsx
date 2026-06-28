import { X } from 'lucide-react'
import { useState } from 'react'

export default function AddMedicineModal({ onClose, onAdd }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Général');
  const [quantity, setQuantity] = useState(0);
  const [threshold, setThreshold] = useState(10);
  const [expirationDate, setExpirationDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      name,
      category,
      quantity: parseInt(quantity, 10) || 0,
      threshold: parseInt(threshold, 10) || 0,
      expirationDate: expirationDate || '2099-12-31'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose} id="add-medicine-modal">
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h3>Ajouter un médicament</h3>
          <button className="modal-close" onClick={onClose} id="modal-close-btn">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
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

          <div className="input-group">
            <label htmlFor="medicine-category">Catégorie</label>
            <select
              className="input-field"
              id="medicine-category"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="Général">Général</option>
              <option value="Analgésiques">Analgésiques</option>
              <option value="Antibiotiques">Antibiotiques</option>
              <option value="Antipaludiques">Antipaludiques</option>
              <option value="Vitamines">Vitamines</option>
              <option value="Sirop">Sirop</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="input-group" style={{ flex: 1 }}>
              <label htmlFor="medicine-qty">Quantité initiale</label>
              <input
                type="number"
                min="0"
                className="input-field"
                id="medicine-qty"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                required
              />
            </div>
            <div className="input-group" style={{ flex: 1 }}>
              <label htmlFor="medicine-threshold">Seuil d'alerte</label>
              <input
                type="number"
                min="0"
                className="input-field"
                id="medicine-threshold"
                value={threshold}
                onChange={e => setThreshold(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="medicine-exp">Date de péremption</label>
            <input
              type="date"
              className="input-field"
              id="medicine-exp"
              value={expirationDate}
              onChange={e => setExpirationDate(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn btn-primary" id="add-medicine-submit">Ajouter</button>
          </div>
        </form>
      </div>
    </div>
  )
}

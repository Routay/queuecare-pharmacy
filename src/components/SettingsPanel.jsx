import { useState } from 'react'
import { Save, Shield, Bell, Key, Store } from 'lucide-react'

export default function SettingsPanel({ pharmacy }) {
  const [activeSection, setActiveSection] = useState('general');
  const [saved, setSaved] = useState(false);

  // Mock form state
  const [formData, setFormData] = useState({
    name: pharmacy?.name || '',
    address: pharmacy?.address || '',
    email: 'contact@pharmacie.com',
    phone: '+221 77 123 45 67',
    notifications: true,
    autoOrder: false,
    alertThreshold: 20
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="settings-panel" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Paramètres de la Pharmacie</h2>
        <p style={{ color: 'hsl(var(--text-muted))' }}>Gérez vos préférences, vos alertes et les informations de votre officine.</p>
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        {/* Navigation verticale */}
        <div className="glass-panel" style={{ width: '250px', padding: '16px' }}>
          <button 
            onClick={() => setActiveSection('general')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', 
              background: activeSection === 'general' ? 'hsla(var(--color-primary)/0.1)' : 'transparent',
              color: activeSection === 'general' ? 'hsl(var(--color-primary))' : 'hsl(var(--text-secondary))',
              border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: '500', transition: 'all 0.2s'
            }}
          >
            <Store size={18} /> Informations
          </button>
          <button 
            onClick={() => setActiveSection('alerts')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', 
              background: activeSection === 'alerts' ? 'hsla(var(--color-primary)/0.1)' : 'transparent',
              color: activeSection === 'alerts' ? 'hsl(var(--color-primary))' : 'hsl(var(--text-secondary))',
              border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: '500', transition: 'all 0.2s'
            }}
          >
            <Bell size={18} /> Alertes & Stock
          </button>
          <button 
            onClick={() => setActiveSection('security')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', 
              background: activeSection === 'security' ? 'hsla(var(--color-primary)/0.1)' : 'transparent',
              color: activeSection === 'security' ? 'hsl(var(--color-primary))' : 'hsl(var(--text-secondary))',
              border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: '500', transition: 'all 0.2s'
            }}
          >
            <Shield size={18} /> Sécurité
          </button>
        </div>

        {/* Contenu principal */}
        <div className="glass-panel" style={{ flex: 1, padding: '32px' }}>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {activeSection === 'general' && (
              <div style={{ animation: 'fadeIn 0.2s ease' }}>
                <h3 style={{ marginBottom: '20px', borderBottom: '1px solid hsl(var(--border-color)/0.5)', paddingBottom: '12px' }}>
                  Informations de l'officine
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label className="form-label">Nom de la Pharmacie</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Adresse</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      value={formData.address} 
                      onChange={e => setFormData({...formData, address: e.target.value})} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email de contact</label>
                    <input 
                      type="email" 
                      className="input-field" 
                      value={formData.email} 
                      onChange={e => setFormData({...formData, email: e.target.value})} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Téléphone</label>
                    <input 
                      type="tel" 
                      className="input-field" 
                      value={formData.phone} 
                      onChange={e => setFormData({...formData, phone: e.target.value})} 
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'alerts' && (
              <div style={{ animation: 'fadeIn 0.2s ease' }}>
                <h3 style={{ marginBottom: '20px', borderBottom: '1px solid hsl(var(--border-color)/0.5)', paddingBottom: '12px' }}>
                  Configuration des alertes
                </h3>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'hsl(var(--bg-elevated))', borderRadius: '8px', marginBottom: '16px' }}>
                  <div>
                    <strong style={{ display: 'block', marginBottom: '4px' }}>Notifications Push</strong>
                    <span style={{ fontSize: '0.9rem', color: 'hsl(var(--text-muted))' }}>Recevoir une alerte lors d'une rupture de stock imminente.</span>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={formData.notifications} 
                      onChange={e => setFormData({...formData, notifications: e.target.checked})} 
                      style={{ width: '20px', height: '20px' }} 
                    />
                  </label>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'hsl(var(--bg-elevated))', borderRadius: '8px', marginBottom: '16px' }}>
                  <div>
                    <strong style={{ display: 'block', marginBottom: '4px' }}>Seuil d'alerte global par défaut</strong>
                    <span style={{ fontSize: '0.9rem', color: 'hsl(var(--text-muted))' }}>S'applique aux nouveaux produits sans seuil défini.</span>
                  </div>
                  <input 
                    type="number" 
                    className="input-field" 
                    style={{ width: '100px' }} 
                    value={formData.alertThreshold}
                    onChange={e => setFormData({...formData, alertThreshold: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div style={{ animation: 'fadeIn 0.2s ease' }}>
                <h3 style={{ marginBottom: '20px', borderBottom: '1px solid hsl(var(--border-color)/0.5)', paddingBottom: '12px' }}>
                  Sécurité du compte
                </h3>
                
                <div style={{ padding: '16px', background: 'hsl(var(--bg-elevated))', borderRadius: '8px', marginBottom: '16px' }}>
                  <strong style={{ display: 'block', marginBottom: '8px' }}>Changer de mot de passe</strong>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <button type="button" className="btn-secondary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Key size={16} /> Envoyer le lien de réinitialisation
                    </button>
                    <span style={{ fontSize: '0.9rem', color: 'hsl(var(--text-muted))' }}>Un email sera envoyé à {formData.email}.</span>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px', borderTop: '1px solid hsl(var(--border-color)/0.5)', paddingTop: '24px' }}>
              <button type="submit" className="btn-premium" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Save size={18} />
                {saved ? 'Enregistré !' : 'Enregistrer les modifications'}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  )
}

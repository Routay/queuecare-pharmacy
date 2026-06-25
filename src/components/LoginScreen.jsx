import { useState } from 'react'
import { Pill, Lock, ArrowRight, AlertCircle, Loader2, Store } from 'lucide-react'

const API_URL = 'http://127.0.0.1:8000'

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password })
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.detail || 'Identifiants incorrects.')
        return
      }

      const data = await res.json()
      onLogin(data.token, data.user)
    } catch (err) {
      setError('Impossible de contacter le serveur. Vérifiez que le backend est actif.')
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-screen" id="login-screen">
      {/* Animated background particles */}
      <div className="login-bg-effects">
        <div className="login-orb orb-1"></div>
        <div className="login-orb orb-2"></div>
        <div className="login-orb orb-3"></div>
        <div className="login-grid-pattern"></div>
      </div>

      <div className="login-card" id="login-card">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">
            <Pill size={32} />
          </div>
          <h1>QueueCare</h1>
          <span className="login-subtitle">Portail Pharmacie</span>
        </div>

        {/* Welcome text */}
        <div className="login-welcome">
          <h2>Bienvenue</h2>
          <p>Connectez-vous pour gérer votre inventaire</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="login-error" id="login-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <Store size={18} className="login-field-icon" />
            <input
              id="login-username"
              type="text"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
            />
          </div>

          <div className="login-field">
            <Lock size={18} className="login-field-icon" />
            <input
              id="login-password"
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className={`login-btn ${isLoading ? 'loading' : ''}`}
            id="login-submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="spin-icon" />
                Connexion en cours...
              </>
            ) : (
              <>
                Se connecter
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="login-hint">
          <p>Identifiants de démonstration :</p>
          <div className="login-credentials">
            <button
              type="button"
              className="credential-chip"
              onClick={() => { setUsername('pharm.guigon'); setPassword('pharmacie2026') }}
            >
              <span className="credential-avatar">PH</span>
              Pharm. Guigon
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="login-footer">
        <p>QueueCare SN © 2026 — Système de gestion de files d'attente médicales</p>
      </div>
    </div>
  )
}

/**
 * Tests — LoginScreen (Portail Pharmacie)
 * ═══════════════════════════════════════
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginScreen from '../components/LoginScreen'

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('LoginScreen (Pharmacie)', () => {
  const mockOnLogin = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('affiche le formulaire de connexion pharmacie', () => {
    render(<LoginScreen onLogin={mockOnLogin} />)
    expect(screen.getByPlaceholderText("Nom d'utilisateur")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Mot de passe")).toBeInTheDocument()
    expect(screen.getByText('Portail Pharmacie')).toBeInTheDocument()
  })

  it('affiche une erreur si les champs sont vides', () => {
    render(<LoginScreen onLogin={mockOnLogin} />)
    fireEvent.click(screen.getByText('Se connecter'))
    expect(screen.getByText('Veuillez remplir tous les champs.')).toBeInTheDocument()
  })

  it('appelle l\'API et onLogin en cas de succès', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        token: 'pharm-token-123',
        user: { id: 'pharm-001', fullName: 'Pharmacie Guigon', role: 'Pharmacien' }
      })
    })

    render(<LoginScreen onLogin={mockOnLogin} />)
    fireEvent.change(screen.getByPlaceholderText("Nom d'utilisateur"), { target: { value: 'pharm.guigon' } })
    fireEvent.change(screen.getByPlaceholderText("Mot de passe"), { target: { value: 'pharmacie2026' } })
    fireEvent.click(screen.getByText('Se connecter'))

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalled()
    })
  })

  it('affiche les identifiants de démonstration pharmacie', () => {
    render(<LoginScreen onLogin={mockOnLogin} />)
    expect(screen.getByText('Pharm. Guigon')).toBeInTheDocument()
  })

  it('remplit les champs avec les identifiants de démonstration', () => {
    render(<LoginScreen onLogin={mockOnLogin} />)
    fireEvent.click(screen.getByText('Pharm. Guigon'))
    expect(screen.getByPlaceholderText("Nom d'utilisateur").value).toBe('pharm.guigon')
    expect(screen.getByPlaceholderText("Mot de passe").value).toBe('pharmacie2026')
  })

  it('gère les erreurs réseau', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    render(<LoginScreen onLogin={mockOnLogin} />)
    fireEvent.change(screen.getByPlaceholderText("Nom d'utilisateur"), { target: { value: 'test' } })
    fireEvent.change(screen.getByPlaceholderText("Mot de passe"), { target: { value: 'test' } })
    fireEvent.click(screen.getByText('Se connecter'))

    await waitFor(() => {
      expect(screen.getByText(/Impossible de contacter/)).toBeInTheDocument()
    })
  })
})

/**
 * Tests — PrescriptionsPanel (Portail Pharmacie)
 * ═══════════════════════════════════════════════
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PrescriptionsPanel from '../components/PrescriptionsPanel'

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('PrescriptionsPanel', () => {
  const defaultProps = {
    user: { fullName: 'Pharmacien Test', role: 'Pharmacien' },
    pharmacyId: 1,
    onStockUpdate: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllTimers()
  })

  it('affiche un spinner de chargement initialement', () => {
    mockFetch.mockImplementation(() => new Promise(() => {}))
    render(<PrescriptionsPanel {...defaultProps} />)
    expect(screen.getByText('Chargement des ordonnances...')).toBeInTheDocument()
  })

  it('affiche "Aucune ordonnance" quand la liste est vide', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([])
    })

    render(<PrescriptionsPanel {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('Aucune ordonnance en attente')).toBeInTheDocument()
    })
  })

  it('affiche les ordonnances en attente', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([
        {
          id: 'presc-001',
          ticketId: 'ticket-abc-123',
          doctorName: 'Dr. Test',
          date: '2026-07-20T10:00:00',
          notes: 'Fièvre et toux',
          status: 'pending',
          medicines: [
            { name: 'Paracétamol 500mg', quantity: 2, dosage: '1 matin et soir' }
          ]
        }
      ])
    })

    render(<PrescriptionsPanel {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText(/123/)).toBeInTheDocument() // ticket ID suffix
    })
    expect(screen.getByText(/Paracétamol 500mg/)).toBeInTheDocument()
    expect(screen.getByText(/Délivrer l'ordonnance/i)).toBeInTheDocument()
  })

  it('affiche les notes du médecin', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([
        {
          id: 'presc-002',
          ticketId: 'ticket-def-456',
          doctorName: 'Dr. Notes',
          date: '2026-07-20T11:00:00',
          notes: 'Traitement urgent',
          status: 'pending',
          medicines: [{ name: 'Med', quantity: 1, dosage: '1x/jour' }]
        }
      ])
    })

    render(<PrescriptionsPanel {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('Traitement urgent')).toBeInTheDocument()
    })
  })

  it('appelle l\'API de délivrance au clic', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([
        {
          id: 'presc-003',
          ticketId: 'ticket-ghi-789',
          doctorName: 'Dr. Deliver',
          date: '2026-07-20T12:00:00',
          notes: '',
          status: 'pending',
          medicines: [{ name: 'Med X', quantity: 1, dosage: '1x' }]
        }
      ])
    })

    render(<PrescriptionsPanel {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText(/Délivrer l'ordonnance/i)).toBeInTheDocument()
    })

    // Mock the deliver endpoint
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Ordonnance délivrée' })
    })

    fireEvent.click(screen.getByText(/Délivrer l'ordonnance/i))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/consultations/prescriptions/presc-003/deliver'),
        expect.objectContaining({ method: 'POST' })
      )
    })
  })
})

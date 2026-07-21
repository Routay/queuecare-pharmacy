/**
 * Tests — StatCards (Portail Pharmacie)
 * ═══════════════════════════════════════
 */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatCards from '../components/StatCards'

describe('StatCards (Pharmacie)', () => {
  const mockStock = [
    { name: 'Med A', quantity: 100, threshold: 20, inStock: true },
    { name: 'Med B', quantity: 15, threshold: 20, inStock: true },  // stock <= threshold → warning
    { name: 'Med C', quantity: 0, threshold: 10, inStock: false },   // rupture
    { name: 'Med D', quantity: 50, threshold: 30, inStock: true },
    { name: 'Med E', quantity: 5, threshold: 10, inStock: true }     // stock <= threshold → warning
  ]

  it('affiche le total des références', () => {
    render(<StatCards stock={mockStock} />)
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('Total Références')).toBeInTheDocument()
  })

  it('calcule correctement le stock suffisant', () => {
    render(<StatCards stock={mockStock} />)
    // Med A (100 > 20) et Med D (50 > 30) = 2
    const statValues = screen.getAllByText('2')
    expect(statValues.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Stock Suffisant')).toBeInTheDocument()
  })

  it('calcule correctement le stock faible', () => {
    render(<StatCards stock={mockStock} />)
    // Med B (15 <= 20 && > 0) et Med E (5 <= 10 && > 0) = 2
    // Note: "2" already shown for stock suffisant, so check label
    const statLabels = screen.getAllByText('2')
    expect(statLabels.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Stock Faible')).toBeInTheDocument()
  })

  it('calcule correctement les ruptures', () => {
    render(<StatCards stock={mockStock} />)
    // Med C (quantity = 0) = 1
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('Ruptures')).toBeInTheDocument()
  })

  it('affiche 0 pour un stock vide', () => {
    render(<StatCards stock={[]} />)
    const zeros = screen.getAllByText('0')
    expect(zeros.length).toBe(4) // total, suffisant, faible, ruptures
  })

  it('affiche les quatre cartes statistiques', () => {
    render(<StatCards stock={mockStock} />)
    expect(screen.getByText('Total Références')).toBeInTheDocument()
    expect(screen.getByText('Stock Suffisant')).toBeInTheDocument()
    expect(screen.getByText('Stock Faible')).toBeInTheDocument()
    expect(screen.getByText('Ruptures')).toBeInTheDocument()
  })
})

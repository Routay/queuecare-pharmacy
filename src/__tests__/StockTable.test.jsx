/**
 * Tests — StockTable (Portail Pharmacie)
 * ═══════════════════════════════════════
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import StockTable from '../components/StockTable'

describe('StockTable', () => {
  const mockStock = [
    { name: 'Paracétamol 500mg', category: 'Analgésiques', quantity: 150, threshold: 50, expirationDate: '2028-06-30', inStock: true },
    { name: 'Amoxicilline 1g', category: 'Antibiotiques', quantity: 12, threshold: 20, expirationDate: '2026-08-15', inStock: true },
    { name: 'Artemether', category: 'Antipaludiques', quantity: 0, threshold: 10, expirationDate: '2026-10-01', inStock: false }
  ]

  const defaultProps = {
    stock: mockStock,
    onUpdateQuantity: vi.fn(),
    onDelete: vi.fn()
  }

  it('affiche le message vide quand le stock est vide', () => {
    render(<StockTable stock={[]} onUpdateQuantity={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Aucun médicament trouvé.')).toBeInTheDocument()
  })

  it('affiche le tableau avec tous les médicaments', () => {
    render(<StockTable {...defaultProps} />)
    expect(screen.getByText('Paracétamol 500mg')).toBeInTheDocument()
    expect(screen.getByText('Amoxicilline 1g')).toBeInTheDocument()
    expect(screen.getByText('Artemether')).toBeInTheDocument()
  })

  it('affiche les en-têtes du tableau', () => {
    render(<StockTable {...defaultProps} />)
    expect(screen.getByText('Médicament')).toBeInTheDocument()
    expect(screen.getByText('Catégorie')).toBeInTheDocument()
    expect(screen.getByText('Stock')).toBeInTheDocument()
    expect(screen.getByText('Seuil')).toBeInTheDocument()
    expect(screen.getByText('Péremption')).toBeInTheDocument()
    expect(screen.getByText('Statut')).toBeInTheDocument()
  })

  it('affiche le badge "Rupture" pour stock = 0', () => {
    render(<StockTable {...defaultProps} />)
    expect(screen.getByText('Rupture')).toBeInTheDocument()
  })

  it('affiche le badge "Bas" pour stock faible', () => {
    render(<StockTable {...defaultProps} />)
    expect(screen.getByText('Bas')).toBeInTheDocument()
  })

  it('affiche le badge "OK" pour stock suffisant', () => {
    render(<StockTable {...defaultProps} />)
    expect(screen.getByText('OK')).toBeInTheDocument()
  })

  it('appelle onUpdateQuantity au clic sur +', () => {
    render(<StockTable {...defaultProps} />)
    // Le premier bouton + correspond au premier médicament (Paracétamol)
    const addButtons = screen.getAllByTitle('Ajouter 1')
    fireEvent.click(addButtons[0])
    expect(defaultProps.onUpdateQuantity).toHaveBeenCalledWith(
      mockStock[0], 151, 'ENTREE'
    )
  })

  it('appelle onUpdateQuantity au clic sur -', () => {
    render(<StockTable {...defaultProps} />)
    const removeButtons = screen.getAllByTitle('Retirer 1')
    fireEvent.click(removeButtons[0])
    expect(defaultProps.onUpdateQuantity).toHaveBeenCalledWith(
      mockStock[0], 149, 'SORTIE'
    )
  })

  it('désactive le bouton - quand la quantité est 0', () => {
    render(<StockTable {...defaultProps} />)
    const removeButtons = screen.getAllByTitle('Retirer 1')
    // Le 3e médicament (Artemether) a quantité = 0
    expect(removeButtons[2]).toBeDisabled()
  })

  it('appelle onDelete au clic sur supprimer', () => {
    render(<StockTable {...defaultProps} />)
    const deleteButtons = screen.getAllByTitle('Supprimer')
    fireEvent.click(deleteButtons[0])
    expect(defaultProps.onDelete).toHaveBeenCalledWith('Paracétamol 500mg')
  })
})

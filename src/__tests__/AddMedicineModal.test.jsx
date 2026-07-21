/**
 * Tests — AddMedicineModal (Portail Pharmacie)
 * ═══════════════════════════════════════════
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AddMedicineModal from '../components/AddMedicineModal'

describe('AddMedicineModal', () => {
  const defaultProps = {
    onClose: vi.fn(),
    onAdd: vi.fn()
  }

  it('affiche le titre "Ajouter un médicament"', () => {
    render(<AddMedicineModal {...defaultProps} />)
    expect(screen.getByText('Ajouter un médicament')).toBeInTheDocument()
  })

  it('affiche tous les champs du formulaire', () => {
    render(<AddMedicineModal {...defaultProps} />)
    expect(screen.getByLabelText('Nom du médicament')).toBeInTheDocument()
    expect(screen.getByLabelText('Catégorie')).toBeInTheDocument()
    expect(screen.getByLabelText('Quantité initiale')).toBeInTheDocument()
    expect(screen.getByLabelText("Seuil d'alerte")).toBeInTheDocument()
    expect(screen.getByLabelText('Date de péremption')).toBeInTheDocument()
  })

  it('appelle onClose au clic sur Annuler', () => {
    render(<AddMedicineModal {...defaultProps} />)
    fireEvent.click(screen.getByText('Annuler'))
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('appelle onClose au clic sur le bouton X', () => {
    render(<AddMedicineModal {...defaultProps} />)
    const closeBtn = document.getElementById('modal-close-btn')
    fireEvent.click(closeBtn)
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('soumet le formulaire avec les données correctes', () => {
    render(<AddMedicineModal {...defaultProps} />)
    
    fireEvent.change(screen.getByLabelText('Nom du médicament'), { target: { value: 'Ibuprofène 400mg' } })
    fireEvent.change(screen.getByLabelText('Catégorie'), { target: { value: 'Analgésiques' } })
    fireEvent.change(screen.getByLabelText('Quantité initiale'), { target: { value: '100' } })
    fireEvent.change(screen.getByLabelText("Seuil d'alerte"), { target: { value: '20' } })
    fireEvent.change(screen.getByLabelText('Date de péremption'), { target: { value: '2028-12-31' } })
    
    fireEvent.click(screen.getByText('Ajouter'))
    
    expect(defaultProps.onAdd).toHaveBeenCalledWith({
      name: 'Ibuprofène 400mg',
      category: 'Analgésiques',
      quantity: 100,
      threshold: 20,
      expirationDate: '2028-12-31'
    })
  })

  it('ne soumet pas si le nom est vide', () => {
    render(<AddMedicineModal {...defaultProps} />)
    
    const form = screen.getByText('Ajouter un médicament').closest('.modal-content').querySelector('form');
    fireEvent.change(screen.getByLabelText('Quantité initiale'), { target: { value: '50' } });
    
    // Simulate invalid form submission
    fireEvent.submit(form);
    
    // onAdd ne doit pas être appelé
    expect(defaultProps.onAdd).not.toHaveBeenCalled()
  })

  it('utilise la date de péremption par défaut si non renseignée', () => {
    render(<AddMedicineModal {...defaultProps} />)
    
    fireEvent.change(screen.getByLabelText('Nom du médicament'), { target: { value: 'Test Med' } })
    fireEvent.click(screen.getByText('Ajouter'))
    
    expect(defaultProps.onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ expirationDate: '2099-12-31' })
    )
  })

  it('a la catégorie "Général" par défaut', () => {
    render(<AddMedicineModal {...defaultProps} />)
    expect(screen.getByLabelText('Catégorie').value).toBe('Général')
  })
})

import { X, Rocket } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function EvolutionModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        <div className="modal-icon"><Rocket size={48} /></div>
        <h2>Funcionalidade em evolução</h2>
        <p>Este recurso está previsto para uma próxima atualização do Brigada360.</p>
        <button className="btn btn-primary" onClick={onClose}>Entendi</button>
      </div>
    </div>
  );
}

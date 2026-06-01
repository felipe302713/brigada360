import { useState, type ReactNode } from 'react';
import { EvolutionBadge } from './EvolutionBadge';
import { EvolutionModal } from './EvolutionModal';

interface Props {
  icon: ReactNode;
  nome: string;
  descricao: string;
}

export function EvolutionCard({ icon, nome, descricao }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="evolution-card" onClick={() => setOpen(true)}>
        <div className="evolution-card__icon">{icon}</div>
        <div className="evolution-card__info">
          <h4>{nome}</h4>
          <p>{descricao}</p>
        </div>
        <EvolutionBadge />
      </div>
      <EvolutionModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

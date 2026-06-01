import { useState } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../components/Toast';
import { RotateCcw, AlertTriangle } from 'lucide-react';

export function ConfiguracoesPage() {
  const { toast } = useToast();
  const [confirming, setConfirming] = useState(false);

  const handleRestore = async () => {
    try {
      await api.post('/usuarios?action=restore-demo');
      toast('Dados de demonstração restaurados');
      setConfirming(false);
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Erro', 'error');
    }
  };

  return (
    <div>
      <div className="page-header"><h1>Configurações</h1></div>

      <div className="card" style={{ maxWidth: 600 }}>
        <h3 style={{ marginBottom: 16 }}>Dados de Demonstração</h3>
        <p style={{ fontSize: '0.875rem', color: '#757575', marginBottom: 20 }}>
          Restaurar todos os dados ao estado inicial de demonstração. Esta ação vai substituir os dados atuais pelos dados fictícios originais.
        </p>
        {!confirming ? (
          <button className="btn btn-danger" onClick={() => setConfirming(true)}>
            <RotateCcw size={16} /> Restaurar dados de demonstração
          </button>
        ) : (
          <div className="alert-card alert-card--critico">
            <AlertTriangle size={20} />
            <div>
              <strong>Tem certeza?</strong>
              <p style={{ fontSize: '0.8125rem', marginTop: 4 }}>Esta ação irá substituir todos os dados atuais. Não pode ser desfeita.</p>
              <div className="confirm-actions" style={{ marginTop: 12, justifyContent: 'flex-start' }}>
                <button className="btn btn-danger" onClick={handleRestore}>Sim, restaurar</button>
                <button className="btn btn-secondary" onClick={() => setConfirming(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

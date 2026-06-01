import { EvolutionCard } from '../../components/EvolutionCard';
import {
  MessageCircle, QrCode, Bell, CalendarDays, BookOpen,
  Building, Cake, BarChart3, Camera, PenTool, Send,
  Wrench, FileText
} from 'lucide-react';

const ETAPA2 = [
  { icon: <QrCode size={22} />, nome: 'Leitura de QR Code pela câmera', descricao: 'Consulte equipamentos escaneando o código' },
  { icon: <MessageCircle size={22} />, nome: 'Chat interno', descricao: 'Comunicação entre a equipe em tempo real' },
  { icon: <Send size={22} />, nome: 'Grupos de conversa por posto', descricao: 'Canais organizados por local de trabalho' },
  { icon: <MessageCircle size={22} />, nome: 'Mensagens diretas', descricao: 'Mensagens privadas entre profissionais' },
  { icon: <Bell size={22} />, nome: 'Central de notificações', descricao: 'Alertas centralizados do sistema' },
  { icon: <Bell size={22} />, nome: 'Alertas automáticos de vencimento', descricao: 'Notificações quando equipamentos vencem' },
  { icon: <Camera size={22} />, nome: 'Upload de fotos nas inspeções', descricao: 'Registre fotos durante inspeções' },
  { icon: <Camera size={22} />, nome: 'Upload de fotos nas ocorrências', descricao: 'Anexe evidências fotográficas' },
  { icon: <FileText size={22} />, nome: 'Anexos no chat', descricao: 'Envie documentos na conversa' },
  { icon: <CalendarDays size={22} />, nome: 'Calendário 12x36 avançado', descricao: 'Gestão completa de escalas' },
  { icon: <Send size={22} />, nome: 'Comunicados para equipes', descricao: 'Envie comunicados oficiais' },
  { icon: <Wrench size={22} />, nome: 'Solicitação de manutenção', descricao: 'Abra chamados de manutenção' },
  { icon: <PenTool size={22} />, nome: 'Assinatura digital', descricao: 'Assinatura do responsável pela ronda' },
];

const ETAPA3 = [
  { icon: <BookOpen size={22} />, nome: 'Cartilha digital de segurança', descricao: 'Material educativo para a equipe' },
  { icon: <Building size={22} />, nome: 'Informações do edifício', descricao: 'Dados detalhados da edificação' },
  { icon: <Building size={22} />, nome: 'Inteligência predial', descricao: 'Indicadores de água, incêndio e estacionamento' },
  { icon: <Building size={22} />, nome: 'Mapeamento de riscos', descricao: 'Mapa avançado de riscos por setor' },
  { icon: <Cake size={22} />, nome: 'Aniversariantes do mês', descricao: 'Datas comemorativas da equipe' },
  { icon: <BarChart3 size={22} />, nome: 'Relatórios avançados', descricao: 'Relatórios detalhados e exportação PDF' },
  { icon: <BarChart3 size={22} />, nome: 'Gráficos históricos', descricao: 'Visualizações de tendências ao longo do tempo' },
  { icon: <Building size={22} />, nome: 'Gestão de múltiplos edifícios', descricao: 'Controle vários edifícios e empresas' },
];

export function EvolucoesPage() {
  return (
    <div>
      <div className="page-header"><h1>Próximas Evoluções</h1></div>

      <h2 style={{ marginBottom: 12 }}>Etapa 2 — Comunicação e Automação</h2>
      <div className="evolution-grid">
        {ETAPA2.map((item, i) => <EvolutionCard key={i} {...item} />)}
      </div>

      <h2 style={{ marginTop: 32, marginBottom: 12 }}>Etapa 3 — Inteligência Predial</h2>
      <div className="evolution-grid">
        {ETAPA3.map((item, i) => <EvolutionCard key={i} {...item} />)}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { Calendar } from '../components/ui/calendar';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { CalendarDays, ChevronLeft, ChevronRight, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { parseBackendDate, formatSafe } from '../utils/dateFormatter';
import api from '../services/api';

interface Agendamento {
  id: number;
  dataAgendada: string;
  horaAgendada: string;
  status: string;
  cliente: { nome: string };
  servico: { nome: string; preco: number; tempoDuracaoEstimado: number };
}

export function AgendaBarbeiro() {
  const { userId, token } = useAuth();
  const location = useLocation();
  const [dataSelecionada, setDataSelecionada] = useState<Date>(() => {
    if (location.state && location.state.date) {
      return new Date(location.state.date);
    }
    return new Date();
  });
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [horariosDoDia, setHorariosDoDia] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. Missão 1: Gerador Dinâmico de Horários (30 em 30 min)
  const gerarHorarios = (inicio: string, fim: string) => {
    const slots: string[] = [];
    let [h, m] = inicio.split(':').map(Number);
    const [hFim, mFim] = fim.split(':').map(Number);

    while (h < hFim || (h === hFim && m < mFim)) {
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      m += 30;
      if (m >= 60) {
        h++;
        m = 0;
      }
    }
    return slots;
  };

  useEffect(() => {
    const fetchDados = async () => {
      setLoading(true);
      try {
        // Busca Agendamentos
        const resAgendamentos = await fetch(`http://localhost:8080/api/agendamentos/barbeiro/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataAg = await resAgendamentos.json();
        const agendamentosDodia = dataAg.filter((ag: Agendamento) => {
          const parsedDate = parseBackendDate(ag.dataAgendada);
          return parsedDate ? isSameDay(parsedDate, dataSelecionada) : false;
        });
        setAgendamentos(agendamentosDodia);

        // 2. Missão 2: Busca da Disponibilidade para o dia selecionado
        try {
          const resDisp = await api.get(`/disponibilidades/barbeiro/${userId}`);
          const listaDisp = Array.isArray(resDisp.data) ? resDisp.data : resDisp.data.content || [];
          
          const dispHoje = listaDisp.find((d: any) => {
            const dateObj = parseBackendDate(d.dataTrabalho);
            return dateObj && isSameDay(dateObj, dataSelecionada);
          });

          if (dispHoje) {
            setHorariosDoDia(gerarHorarios(dispHoje.horarioInicio, dispHoje.horarioFim));
          } else {
            // Fallback: 08:00 às 20:00 se não houver disponibilidade cadastrada
            setHorariosDoDia(gerarHorarios('08:00', '20:00'));
          }
        } catch (err) {
          console.error('Erro ao buscar disponibilidades, usando fallback:', err);
          setHorariosDoDia(gerarHorarios('08:00', '20:00'));
        }

      } catch (error) {
        toast.error('Erro ao carregar dados da agenda');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, [dataSelecionada, userId, token]);

  const handleConcluir = async (id: number) => {
    try {
      // Usando API service para aproveitar o Token configurado no interceptor.
      // Assumindo endpoint padrão REST ou customizado.
      await api.patch(`/agendamentos/${id}/status`, { status: 'CONCLUIDO' });
      
      setAgendamentos((prev) => 
        prev.map(ag => ag.id === id ? { ...ag, status: 'CONCLUIDO' } : ag)
      );
      toast.success('Agendamento marcado como concluído!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao concluir o agendamento.');
    }
  };

  const handleCancelar = async (id: number) => {
    const toastId = toast.loading('Cancelando agendamento...');
    try {
      await api.delete(`/agendamentos/${id}`);
      
      setAgendamentos((prev) => 
        prev.map(ag => ag.id === id ? { ...ag, status: 'CANCELADO' } : ag)
      );
      toast.success('Agendamento cancelado com sucesso!', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Erro ao cancelar o agendamento.', { id: toastId });
    }
  };

  const irParaHoje = () => setDataSelecionada(new Date());
  const irParaAmanha = () => {
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    setDataSelecionada(amanha);
  };

  const isHoje = (data: Date) => {
    const hoje = new Date();
    return data.toDateString() === hoje.toDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'AGENDADO':
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400';
      case 'CONCLUIDO':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'CANCELADO':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'AGENDADO':
        return 'Agendado';
      case 'CONCLUIDO':
        return 'Concluído';
      case 'CANCELADO':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const calcularHorarioFim = (inicio: string, duracao: number): string => {
    const [hora, minuto] = inicio.split(':').map(Number);
    const totalMinutos = hora * 60 + minuto + duracao;
    const novaHora = Math.floor(totalMinutos / 60);
    const novoMinuto = totalMinutos % 60;
    return `${String(novaHora).padStart(2, '0')}:${String(novoMinuto).padStart(2, '0')}`;
  };

  const receita = agendamentos
    .filter(ag => ag.status === 'AGENDADO' || ag.status === 'CONCLUIDO')
    .reduce((acc, ag) => acc + ag.servico.preco, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Minha Agenda
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Gerencie seus atendimentos e horários disponíveis
          </p>
        </div>

        {/* Seletor de Data */}
        <Card className="p-6 mb-6 shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant={isHoje(dataSelecionada) ? 'default' : 'outline'}
              onClick={irParaHoje}
              className={
                isHoje(dataSelecionada)
                  ? 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700'
                  : ''
              }
            >
              Hoje
            </Button>
            <Button variant="outline" onClick={irParaAmanha}>
              Amanhã
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {formatSafe(dataSelecionada, "dd 'de' MMMM 'de' yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dataSelecionada}
                  onSelect={(date) => date && setDataSelecionada(date)}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
        </Card>

        {/* Estatísticas do Dia */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-6 shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {agendamentos.length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Agendamentos
            </div>
          </Card>
          <Card className="p-6 shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              09:00 - 17:30
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Horário de Trabalho
            </div>
          </Card>
          <Card className="p-6 shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
              R$ {receita.toFixed(2)}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Receita Estimada
            </div>
          </Card>
        </div>

        {/* Timeline de Horários */}
        <Card className="p-6 shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
            Timeline do Dia
          </h2>
          
          {loading ? (
            <p className="text-slate-600 dark:text-slate-400">Carregando...</p>
          ) : (
            <div className="space-y-2">
              {horariosDoDia.map((horario) => {
                // Lógica de busca definitiva: Consideramos o horário ocupado se houver qualquer registro
                // Aceitamos 'AGENDADO', 'CONCLUIDO' e 'CANCELADO' na grade.
                const agendamento = agendamentos.find(
                  (a) => a.horaAgendada.startsWith(horario) && ['AGENDADO', 'CONCLUIDO', 'CANCELADO'].includes(a.status)
                );

                if (agendamento) {
                  const horarioFim = calcularHorarioFim(agendamento.horaAgendada, agendamento.servico.tempoDuracaoEstimado);
                  const isConcluido = agendamento.status === 'CONCLUIDO';
                  const isCancelado = agendamento.status === 'CANCELADO';

                  return (
                    <div
                      key={horario}
                      className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                        isConcluido 
                          ? 'bg-emerald-50 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/30' 
                          : isCancelado
                          ? 'bg-red-50 dark:bg-red-950/10 border-red-200 dark:border-red-900/30 opacity-70'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'
                      }`}
                    >
                      <div className="flex flex-col items-center min-w-[60px]">
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          {agendamento.horaAgendada.substring(0, 5)}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {horarioFim}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <User className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                              <span className={`font-medium ${isConcluido || isCancelado ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
                                {agendamento.cliente.nome}
                              </span>
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              {agendamento.servico.nome}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {/* Os botões de ação SÓ aparecem para agendamentos pendentes */}
                            {agendamento.status === 'AGENDADO' && (
                              <>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                                  onClick={() => handleConcluir(agendamento.id)}
                                  title="Concluir Atendimento"
                                >
                                  <CheckCircle className="h-5 w-5" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                                  onClick={() => handleCancelar(agendamento.id)}
                                  title="Cancelar Agendamento"
                                >
                                  <XCircle className="h-5 w-5" />
                                </Button>
                              </>
                            )}
                            <Badge className={getStatusColor(agendamento.status)}>
                              {getStatusLabel(agendamento.status)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={horario}
                    className="flex items-center gap-4 p-3 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  >
                    <div className="text-sm text-slate-400 dark:text-slate-600 min-w-[60px]">
                      {horario}
                    </div>
                    <div className="text-sm text-slate-400 dark:text-slate-600">
                      Disponível
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

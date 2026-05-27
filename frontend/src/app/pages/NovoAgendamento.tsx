import { useState, useEffect, useMemo } from 'react';
import { Calendar } from '../components/ui/calendar';
import { Card } from '../components/ui/card';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Check, Clock, DollarSign, Loader2, Scissors, User } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { format, isSameDay } from 'date-fns';
import { parseBackendDate } from '../utils/dateFormatter';

interface Barbeiro {
  id: number;
  nome: string;
  email: string;
}

interface Servico {
  id: number;
  nome: string;
  preco: number;
  tempoDuracaoEstimado: number;
}

interface Agendamento {
  id: number;
  dataAgendada: string;
  horaAgendada: string;
  status: string;
}

interface Disponibilidade {
  id: number;
  dataTrabalho: string;
  horarioInicio: string;
  horarioFim: string;
}

export function NovoAgendamento() {
  const { userId, token } = useAuth();
  // ... rest of state ...

  // Helper para converter "HH:mm" ou "HH:mm:ss" em minutos totais
  const timeToMinutes = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const isHorarioOcupado = (horarioSlot: string, agendamentos: Agendamento[]) => {
    const slotMinutos = timeToMinutes(horarioSlot);

    return agendamentos.some((a) => {
      const statusValidos = ['AGENDADO', 'CONCLUIDO'];
      if (!statusValidos.includes(a.status.toUpperCase())) return false;

      const inicioMinutos = timeToMinutes(a.horaAgendada);
      // HU4: Usa a duração do serviço ou 30min como fallback
      const duracao = 30; // Fallback padrão caso não venha no objeto (ajustado abaixo)
      
      // Tentativa de pegar a duração real se o objeto agendamento trouxer o serviço
      const duracaoReal = (a as any).servico?.tempoDuracaoEstimado || duracao;
      const fimMinutos = inicioMinutos + duracaoReal;

      return slotMinutos >= inicioMinutos && slotMinutos < fimMinutos;
    });
  };

  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [barbeiro, setBarbeiro] = useState<string>('');
  const [servico, setServico] = useState<string>('');
  const [data, setData] = useState<Date | undefined>(new Date());
  const [horario, setHorario] = useState<string>('');
  
  const [agendamentosOcupados, setAgendamentosOcupados] = useState<Agendamento[]>([]);
  const [disponibilidadeDia, setDisponibilidadeDia] = useState<Disponibilidade | null>(null);
  
  const [loadingBarbeiros, setLoadingBarbeiros] = useState(true);
  const [loadingServicos, setLoadingServicos] = useState(true);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [confirmando, setConfirmando] = useState(false);

  // 1. Fetch inicial de barbeiros e serviços
  useEffect(() => {
    const fetchBarbeiros = async () => {
      try {
        const response = await api.get('/barbeiros');
        setBarbeiros(response.data.content || []);
      } catch (error) {
        toast.error('Erro ao carregar barbeiros');
      } finally {
        setLoadingBarbeiros(false);
      }
    };

    const fetchServicos = async () => {
      try {
        const response = await api.get('/servicos');
        setServicos(response.data.content || []);
      } catch (error) {
        toast.error('Erro ao carregar serviços');
      } finally {
        setLoadingServicos(false);
      }
    };

    fetchBarbeiros();
    fetchServicos();
  }, []);

  // 2. Missão 1: Buscar Disponibilidade e Agendamentos ao trocar Barbeiro ou Data
  useEffect(() => {
    const carregarDadosDoDia = async () => {
      if (!barbeiro || !data) return;

      setLoadingHorarios(true);
      setHorario(''); // Resetar seleção de horário
      
      try {
        const dataFormatada = format(data, 'dd/MM/yyyy');
        
        // Buscar agendamentos do barbeiro no dia (porta 8081 via api.ts configurado)
        const resAgendamentos = await api.get(`/agendamentos/barbeiro/${barbeiro}/data`, {
          params: { data: dataFormatada }
        });
        setAgendamentosOcupados(resAgendamentos.data || []);

        // Buscar disponibilidade do barbeiro (simulando busca por data ou padrão comercial)
        try {
          const resDisp = await api.get(`/disponibilidades/barbeiro/${barbeiro}`);
          const lista = Array.isArray(resDisp.data) ? resDisp.data : resDisp.data.content || [];
          
          // Encontrar disponibilidade específica para o dia selecionado
          const disp = lista.find((d: Disponibilidade) => {
            const dateObj = parseBackendDate(d.dataTrabalho);
            return dateObj && isSameDay(dateObj, data);
          });
          
          setDisponibilidadeDia(disp || null);
        } catch {
          setDisponibilidadeDia(null);
        }

      } catch (error) {
        console.error('Erro ao carregar horários:', error);
        toast.error('Erro ao carregar horários disponíveis');
      } finally {
        setLoadingHorarios(false);
      }
    };

    carregarDadosDoDia();
  }, [barbeiro, data]);

  // 3. Missão 2: Gerador Dinâmico de Horários (30 em 30 min)
  const horariosGerados = useMemo(() => {
    const inicio = disponibilidadeDia?.horarioInicio || '08:00:00';
    const fim = disponibilidadeDia?.horarioFim || '20:00:00';
    
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
  }, [disponibilidadeDia]);

  const servicoSelecionado = servicos.find(s => s.id === Number(servico));
  const barbeiroSelecionado = barbeiros.find(b => b.id === Number(barbeiro));

  const handleConfirmar = async () => {
    if (!barbeiro || !servico || !data || !horario) {
      toast.error('Preencha todos os campos');
      return;
    }

    setConfirmando(true);

    try {
      const dataFormatada = format(data, 'dd/MM/yyyy');
      
      const agendamentoData = {
        clienteId: userId,
        barbeiroId: Number(barbeiro),
        servicoId: Number(servico),
        dataAgendada: dataFormatada,
        horaAgendada: `${horario}:00`,
      };

      await api.post('/agendamentos', agendamentoData);

      toast.success('Agendamento confirmado!', {
        description: `${servicoSelecionado?.nome} com ${barbeiroSelecionado?.nome} às ${horario}`,
      });

      // Reset form
      setBarbeiro('');
      setServico('');
      setData(new Date());
      setHorario('');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao agendar';
      toast.error('Erro ao agendar', { description: message });
    } finally {
      setConfirmando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Novo Agendamento
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Escolha seu barbeiro, serviço e horário preferido
          </p>
        </div>

        <div className="grid gap-6">
          {/* Barbeiro */}
          <Card className="p-6 shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                <Scissors className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1">
                <Label htmlFor="barbeiro" className="text-base font-medium mb-2 block">
                  Escolha seu Barbeiro
                </Label>
                <Select value={barbeiro} onValueChange={setBarbeiro} disabled={loadingBarbeiros}>
                  <SelectTrigger id="barbeiro" className="w-full h-11">
                    <SelectValue placeholder={loadingBarbeiros ? "Carregando..." : "Selecione um barbeiro"} />
                  </SelectTrigger>
                  <SelectContent>
                    {barbeiros.map((b) => (
                      <SelectItem key={b.id} value={String(b.id)}>
                        {b.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Serviço */}
          <Card className="p-6 shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1">
                <Label htmlFor="servico" className="text-base font-medium mb-2 block">
                  Escolha o Serviço
                </Label>
                <Select value={servico} onValueChange={setServico} disabled={loadingServicos}>
                  <SelectTrigger id="servico" className="w-full h-11">
                    <SelectValue placeholder={loadingServicos ? "Carregando..." : "Selecione um serviço"} />
                  </SelectTrigger>
                  <SelectContent>
                    {servicos.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        <div className="flex items-center gap-2">
                          <span>{s.nome}</span>
                          <span className="text-slate-500 text-sm">
                            • {s.tempoDuracaoEstimado}min • R$ {s.preco.toFixed(2)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {servicoSelecionado && (
                  <div className="mt-3 flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <Clock className="h-4 w-4" />
                      <span>{servicoSelecionado.tempoDuracaoEstimado}min</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <DollarSign className="h-4 w-4" />
                      <span>R$ {servicoSelecionado.preco.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Data e Horário */}
          <Card className="p-6 shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <Label className="text-base font-medium mb-4 block">
              Selecione a Data
            </Label>
            <div className="flex justify-center mb-6">
              <Calendar
                mode="single"
                selected={data}
                onSelect={setData}
                locale={ptBR}
                className="rounded-lg border border-slate-200 dark:border-slate-800"
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </div>

            <div className="flex items-center justify-between mb-3">
              <Label className="text-base font-medium block">
                Horários Disponíveis
              </Label>
              {loadingHorarios && <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />}
            </div>

            {!barbeiro ? (
              <div className="text-center py-8 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl">
                <p className="text-slate-500 text-sm italic">Selecione um barbeiro para ver os horários</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {horariosGerados.map((h) => {
                  // Nova lógica de bloqueio por duração
                  const ocupado = isHorarioOcupado(h, agendamentosOcupados);

                  return (
                    <Button
                      key={h}
                      disabled={ocupado || loadingHorarios}
                      variant={horario === h ? 'default' : 'outline'}
                      className={`h-11 transition-all ${
                        horario === h
                          ? 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 scale-105 shadow-md'
                          : ocupado
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50 dark:bg-slate-800/50 dark:text-slate-600'
                          : 'hover:border-indigo-400 hover:text-indigo-600'
                      }`}
                      onClick={() => setHorario(h)}
                    >
                      {horario === h && <Check className="h-4 w-4 mr-1" />}
                      {h}
                    </Button>
                  );
                })}
              </div>
            )}
            
            {!loadingHorarios && barbeiro && horariosGerados.length === 0 && (
              <p className="text-center text-red-500 text-sm mt-4">Nenhuma disponibilidade encontrada para este barbeiro na data selecionada.</p>
            )}
          </Card>

          {/* Resumo e Confirmação */}
          {barbeiro && servico && data && horario && (
            <Card className="p-6 shadow-sm border-slate-200 dark:border-slate-800 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-slate-900">
              <h3 className="font-semibold mb-4 text-slate-900 dark:text-white">
                Resumo do Agendamento
              </h3>
              <div className="space-y-2 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Barbeiro:</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {barbeiroSelecionado?.nome}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Serviço:</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {servicoSelecionado?.nome}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Data:</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {format(data, 'dd/MM/yyyy')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Horário:</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {horario}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Total:</span>
                  <span className="font-bold text-lg text-slate-900 dark:text-white">
                    R$ {servicoSelecionado?.preco.toFixed(2)}
                  </span>
                </div>
              </div>
              <Button
                onClick={handleConfirmar}
                disabled={confirmando}
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-base font-medium shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
              >
                {confirmando ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Confirmando...
                  </>
                ) : (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Confirmar Agendamento
                  </>
                )}
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
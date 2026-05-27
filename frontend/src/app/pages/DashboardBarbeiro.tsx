import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CalendarCheck, TrendingUp, Users, Scissors, Clock, DollarSign, Calendar, Loader2 } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts';
import { formatSafe, parseBackendDate } from '../utils/dateFormatter';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { isSameDay, startOfWeek, addDays, format, isWithinInterval, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Agendamento {
  id: number;
  dataAgendada: string;
  horaAgendada: string;
  status: 'AGENDADO' | 'CONCLUIDO' | 'CANCELADO';
  cliente: { nome: string };
  servico: { nome: string; preco: number };
}

export function DashboardBarbeiro() {
  const navigate = useNavigate();
  const { userId, loading: authLoading } = useAuth();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDados = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        // O endpoint retorna os agendamentos do barbeiro
        const response = await api.get(`/agendamentos/barbeiro/${userId}`);
        
        // Verifica se a resposta é paginada (comum no Spring) ou array puro
        const data = Array.isArray(response.data) ? response.data : response.data.content || [];
        setAgendamentos(data);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchDados();
    }
  }, [userId, authLoading]);

  // Cálculos dinâmicos baseados nos dados reais
  const stats = useMemo(() => {
    const hoje = new Date();
    const agendamentosHoje = agendamentos.filter(a => {
      const data = parseBackendDate(a.dataAgendada);
      return data && isSameDay(data, hoje);
    });

    const isConcluido = (s: string) => s.toUpperCase().replace('Í', 'I').includes('CONCLUI');
    const isAgendado = (s: string) => s.toUpperCase().includes('AGENDA');

    const ganhosHoje = agendamentosHoje
      .filter(a => isConcluido(a.status) || isAgendado(a.status))
      .reduce((acc, a) => acc + (a.servico?.preco || 0), 0);

    const atendidosHoje = agendamentosHoje.filter(a => isConcluido(a.status)).length;

    // Próximos 3 clientes (hoje, ainda não atendidos)
    const proximos = agendamentosHoje
      .filter(a => isAgendado(a.status))
      .sort((a, b) => a.horaAgendada.localeCompare(b.horaAgendada))
      .slice(0, 3);

    // Dados para o Gráfico da Semana (Segunda a Domingo)
    const inicioSemana = startOfWeek(hoje, { weekStartsOn: 1 }); // Começa na Segunda
    const fimSemana = endOfWeek(hoje, { weekStartsOn: 1 });

    const diasSemana = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    const graficoData = diasSemana.map((label, index) => {
      const diaReferencia = addDays(inicioSemana, index);
      const ganhosDia = agendamentos
        .filter(a => {
          const data = parseBackendDate(a.dataAgendada);
          return data && isSameDay(data, diaReferencia) && (isConcluido(a.status) || isAgendado(a.status));
        })
        .reduce((acc, a) => acc + (a.servico?.preco || 0), 0);

      return { 
        dia: label, 
        valor: ganhosDia,
        dataCompleta: format(diaReferencia, "EEEE, dd/MM/yyyy", { locale: ptBR }),
        dataObj: diaReferencia
      };
    });

    const totalSemana = graficoData.reduce((acc, item) => acc + item.valor, 0);

    return {
      ganhosHoje,
      atendidosHoje,
      totalHoje: agendamentosHoje.length,
      proximos,
      graficoData,
      totalSemana
    };
  }, [agendamentos]);

  if (loading || authLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
        <p className="text-slate-600 dark:text-slate-400 font-medium">Carregando métricas reais...</p>
      </div>
    );
  }

  const dataHoje = new Date();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Olá, Barbeiro! 👋
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Aqui está o resumo do seu dia, {formatSafe(dataHoje, "EEEE, dd 'de' MMMM")}.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-3 py-1 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-medium">
              <Calendar className="w-3.5 h-3.5 mr-2 text-indigo-500" />
              {formatSafe(dataHoje, 'dd/MM/yyyy')}
            </Badge>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 relative overflow-hidden shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 group hover:border-indigo-500/50 transition-colors">
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Ganhos de Hoje</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                  R$ {stats.ganhosHoje.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 relative z-10">
              <span className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3 h-3 mr-1" />
                Tempo Real
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Dados baseados no banco</span>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
          </Card>

          <Card className="p-6 relative overflow-hidden shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 group hover:border-indigo-500/50 transition-colors">
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Agendamentos</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                  {stats.totalHoje}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center">
                <CalendarCheck className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 relative z-10">
              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-full">
                {stats.totalHoje - stats.atendidosHoje} pendentes
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">para o restante do dia</span>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors" />
          </Card>

          <Card className="p-6 relative overflow-hidden shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 group hover:border-indigo-500/50 transition-colors">
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Clientes Atendidos</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                  {stats.atendidosHoje}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center">
                <Users className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 relative z-10">
              <span className="text-xs text-slate-500 dark:text-slate-400">Progresso de Hoje: {stats.totalHoje > 0 ? Math.round((stats.atendidosHoje / stats.totalHoje) * 100) : 0}%</span>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors" />
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart Section */}
          <Card className="lg:col-span-2 p-6 shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Projeção de Ganhos</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Desempenho financeiro da semana atual</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">Total da Semana</p>
                <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                  R$ {stats.totalSemana.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.graficoData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-100 dark:stroke-slate-800" />
                  <XAxis 
                    dataKey="dia" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    tickFormatter={(value) => `R$${value}`}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(99, 102, 241, 0.05)', radius: 8 }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-lg shadow-xl">
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 capitalize">{data.dataCompleta}</p>
                            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                              R$ {payload[0].value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                            <p className="text-[10px] text-indigo-500 mt-2 font-medium">Clique para ver a agenda</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="valor" 
                    radius={[6, 6, 0, 0]} 
                    barSize={32}
                    onClick={(data) => navigate('/agenda', { state: { date: data.dataObj } })}
                    className="cursor-pointer transition-opacity hover:opacity-80"
                  >
                    {stats.graficoData.map((entry, index) => {
                      const isHojeDia = format(dataHoje, 'EEE', { locale: ptBR }).startsWith(entry.dia);
                      return (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={isHojeDia ? '#6366F1' : '#cbd5e1'} 
                          className={isHojeDia ? 'fill-indigo-500' : 'fill-slate-300 dark:fill-slate-700'}
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Sidebar: Next Clients */}
          <div className="space-y-6">
            <Card className="p-6 shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Próximos Clientes</h2>
                <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 hover:bg-indigo-100 border-none">
                  Hoje
                </Badge>
              </div>

              <div className="space-y-4">
                {stats.proximos.length > 0 ? (
                  stats.proximos.map((cliente) => (
                    <div
                      key={cliente.id}
                      onClick={() => navigate('/agenda', { state: { date: parseBackendDate(cliente.dataAgendada) } })}
                      className="group flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors">
                          <Scissors className="h-4 w-4 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-[120px]">
                            {cliente.cliente.nome}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {cliente.servico.nome}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                          <Clock className="h-3 w-3" />
                          {cliente.horaAgendada.substring(0, 5)}
                        </div>
                        <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                          R$ {cliente.servico.preco.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-slate-500">Sem mais agendamentos para hoje.</p>
                  </div>
                )}
              </div>
              

            </Card>

            <Card className="p-6 bg-gradient-to-br from-indigo-600 to-indigo-800 border-none shadow-lg shadow-indigo-200 dark:shadow-none">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold text-white">Metas e Insights</h3>
              </div>
              <p className="text-indigo-100 text-sm mb-4">Seu dia está {stats.totalHoje > 5 ? 'bastante movimentado!' : 'tranquilo por enquanto.'}</p>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-white h-full rounded-full transition-all duration-500" 
                  style={{ width: `${stats.totalHoje > 0 ? (stats.atendidosHoje / stats.totalHoje) * 100 : 0}%` }} 
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

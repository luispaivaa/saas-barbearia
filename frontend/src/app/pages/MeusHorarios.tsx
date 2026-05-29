import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Calendar, Clock, MapPin, Scissors, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { formatDateLong, getDateSortValue } from '../utils/dateFormatter';
import { agendamentoService } from '../services/agendamentoService';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';

interface Agendamento {
  id: number;
  dataAgendada: string;
  horaAgendada: string;
  status: string;
  cliente: { nome: string };
  barbeiro: { nome: string };
  servico: { nome: string; preco: number };
}

export function MeusHorarios() {
  const { userId, token } = useAuth();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgendamentos = async () => {
      try {
        const response = await agendamentoService.listarPorCliente(userId);
        setAgendamentos(response.data);
      } catch (error) {
        toast.error('Erro ao carregar agendamentos');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgendamentos();
  }, [userId, token]);

  const handleCancelar = async (id: number) => {
    try {
      await agendamentoService.cancelar(id);

      setAgendamentos(agendamentos.filter(ag => ag.id !== id));
      toast.success('Agendamento cancelado com sucesso');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error('Erro ao cancelar', { description: message });
    }
  };

  const agendamentosAtivos = agendamentos.filter(ag => ag.status === 'AGENDADO');
  const agendamentosCancelados = agendamentos.filter(ag => ag.status === 'CANCELADO');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Meus Agendamentos
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Visualize e gerencie seus agendamentos
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Card className="p-6 shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
              {agendamentosAtivos.length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Agendamentos Ativos
            </div>
          </Card>
          <Card className="p-6 shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
              R$ {agendamentosAtivos.reduce((acc, ag) => acc + ag.servico.preco, 0).toFixed(2)}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Total a Pagar
            </div>
          </Card>
        </div>

        {/* Próximos Agendamentos */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Próximos Agendamentos
          </h2>

          {agendamentosAtivos.length === 0 ? (
            <Card className="p-12 text-center shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <Calendar className="h-12 w-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                Você não tem agendamentos confirmados
              </p>
              <Button className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700">
                Fazer Novo Agendamento
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {agendamentosAtivos
                .sort((a, b) => getDateSortValue(a.dataAgendada) - getDateSortValue(b.dataAgendada))
                .map((ag) => (
                  <Card
                    key={ag.id}
                    className="p-6 shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        {/* Barbeiro e Serviço */}
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                            <Scissors className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                              {ag.servico.nome}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              com {ag.barbeiro.nome}
                            </p>
                          </div>
                        </div>

                        {/* Data e Horário */}
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                            <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                            <span className="capitalize">{formatDateLong(ag.dataAgendada)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                            <Clock className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                            <span>{ag.horaAgendada}</span>
                          </div>
                        </div>

                        {/* Preço */}
                        <div className="flex items-center gap-2">
                          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            R$ {ag.servico.preco.toFixed(2)}
                          </Badge>
                          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            Confirmado
                          </Badge>
                        </div>
                      </div>

                      {/* Ação de Cancelar */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/30 border-red-200 dark:border-red-900/30"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Cancelar
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancelar agendamento?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Voltar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleCancelar(ag.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Confirmar Cancelamento
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </Card>
                ))}
            </div>
          )}
        </div>

        {/* Agendamentos Cancelados */}
        {agendamentosCancelados.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Cancelados
            </h2>
            <div className="space-y-3">
              {agendamentosCancelados.map((ag) => (
                <Card
                  key={ag.id}
                  className="p-4 shadow-sm border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 opacity-60"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white line-through">
                        {ag.servico.nome} - {formatDateLong(ag.dataAgendada)} às {ag.horaAgendada}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        com {ag.barbeiro.nome}
                      </p>
                    </div>
                    <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                      Cancelado
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

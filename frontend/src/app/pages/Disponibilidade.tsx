// Test comment
import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Calendar, Clock, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { formatDateShort, getDateSortValue } from '../utils/dateFormatter';
import api from '../services/api';

interface Disponibilidade {
  id: number;
  dataTrabalho: string;
  horarioInicio: string;
  horarioFim: string;
  ativo: boolean;
}

export function Disponibilidade() {
  const { userId, token } = useAuth();
  const [disponibilidades, setDisponibilidades] = useState<Disponibilidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [adicionando, setAdicionando] = useState(false);

  const [novaData, setNovaData] = useState('');
  const [novoInicio, setNovoInicio] = useState('');
  const [novoFim, setNovoFim] = useState('');

  // Fetch disponibilidades
  useEffect(() => {
    const fetchDisponibilidades = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/disponibilidades/barbeiro/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Erro ao buscar disponibilidades');
        const data = await response.json();
        setDisponibilidades(data);
      } catch (error) {
        toast.error('Erro ao carregar disponibilidades');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDisponibilidades();
  }, [userId, token]);

  const handleAdicionar = async () => {
    if (!novaData || !novoInicio || !novoFim) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (novoInicio >= novoFim) {
      toast.error('Horário de início deve ser anterior ao horário de fim');
      return;
    }

    setAdicionando(true);

    try {
      // Formatar data de yyyy-MM-dd para dd/MM/yyyy
      const [year, month, day] = novaData.split('-');
      const dataFormatada = `${day}/${month}/${year}`;

      const disponibilidadeData = {
        barbeiroId: userId,
        dataTrabalho: dataFormatada,
        horarioInicio: `${novoInicio}:00`,
        horarioFim: `${novoFim}:00`,
      };

      const response = await fetch('http://localhost:8080/api/disponibilidades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(disponibilidadeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao adicionar disponibilidade');
      }

      const novaDisponibilidade = await response.json();
      setDisponibilidades([...disponibilidades, novaDisponibilidade]);
      toast.success('Disponibilidade adicionada!');
      
      // Reset form
      setNovaData('');
      setNovoInicio('');
      setNovoFim('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error('Erro ao adicionar', { description: message });
    } finally {
      setAdicionando(false);
    }
  };

  const handleRemover = async (id: number) => {
    // Estado temporário de carregamento para a UI (se desejar criar um overlay)
    const toastId = toast.loading('Removendo disponibilidade...');
    try {
      await api.delete(`/disponibilidades/${id}`);
      setDisponibilidades((prev) => prev.filter((d) => d.id !== id));
      toast.success('Disponibilidade removida com sucesso!', { id: toastId });
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error('Erro ao remover', { description: message, id: toastId });
    }
  };

  const calcularDuracao = (inicio: string, fim: string) => {
    const [horaIni, minIni] = inicio.split(':').map(Number);
    const [horaFim, minFim] = fim.split(':').map(Number);
    
    const totalMinIni = horaIni * 60 + minIni;
    const totalMinFim = horaFim * 60 + minFim;
    const diferencaMin = totalMinFim - totalMinIni;
    
    const horas = Math.floor(diferencaMin / 60);
    const minutos = diferencaMin % 60;
    
    return minutos > 0 ? `${horas}h ${minutos}min` : `${horas}h`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Minhas Disponibilidades
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Defina seus horários de trabalho para cada dia
          </p>
        </div>

        {/* Formulário de Nova Disponibilidade */}
        <Card className="p-6 mb-8 shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Plus className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Adicionar Nova Disponibilidade
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="data" className="mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-500" />
                Data
              </Label>
              <Input
                id="data"
                type="date"
                value={novaData}
                onChange={(e) => setNovaData(e.target.value)}
                className="h-11"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <Label htmlFor="inicio" className="mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-500" />
                Horário de Início
              </Label>
              <Input
                id="inicio"
                type="time"
                value={novoInicio}
                onChange={(e) => setNovoInicio(e.target.value)}
                className="h-11"
              />
            </div>

            <div>
              <Label htmlFor="fim" className="mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-500" />
                Horário de Fim
              </Label>
              <Input
                id="fim"
                type="time"
                value={novoFim}
                onChange={(e) => setNovoFim(e.target.value)}
                className="h-11"
              />
            </div>
          </div>

          <Button
            onClick={handleAdicionar}
            disabled={adicionando}
            className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            {adicionando ? 'Adicionando...' : 'Adicionar Disponibilidade'}
          </Button>
        </Card>

        {/* Lista de Disponibilidades */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Disponibilidades Cadastradas
          </h2>

          {loading ? (
            <p className="text-slate-600 dark:text-slate-400">Carregando...</p>
          ) : disponibilidades.length === 0 ? (
            <Card className="p-12 text-center shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <Calendar className="h-12 w-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400">
                Nenhuma disponibilidade cadastrada ainda
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {disponibilidades
                .sort((a, b) => getDateSortValue(a.dataTrabalho) - getDateSortValue(b.dataTrabalho))
                .map((disp) => (
                  <Card
                    key={disp.id}
                    className="p-4 shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-6 flex-1">
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                          <span className="font-medium text-slate-900 dark:text-white">
                            {formatDateShort(disp.dataTrabalho)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                          <span className="text-slate-700 dark:text-slate-300">
                            {disp.horarioInicio.substring(0, 5)} - {disp.horarioFim.substring(0, 5)}
                          </span>
                        </div>

                        <div className="hidden sm:block">
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            Duração: {calcularDuracao(disp.horarioInicio, disp.horarioFim)}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemover(disp.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
            </div>
          )}
        </div>

        {/* Dica */}
        <Card className="p-4 mt-6 bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/30">
          <p className="text-sm text-indigo-900 dark:text-indigo-300">
            <strong>Dica:</strong> Configure sua disponibilidade com antecedência para que seus clientes possam agendar horários de forma mais fácil.
          </p>
        </Card>
      </div>
    </div>
  );
}

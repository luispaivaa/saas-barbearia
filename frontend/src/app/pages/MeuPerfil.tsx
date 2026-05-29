import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { User, Mail, Phone, Lock, Camera, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { clienteService } from '../services/clienteService';
import { barbeiroService } from '../services/barbeiroService';

interface ClienteData {
  id: number;
  nome: string;
  email: string;
  telefone: string;
}

export function MeuPerfil() {
  const { userId, token, role, updateUserInfo } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  
  const isBarber = role === 'BARBEIRO';

  const [formData, setFormData] = useState<ClienteData>({
    id: 0,
    nome: '',
    email: '',
    telefone: '',
  });

  const [senhaData, setSenhaData] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarNovaSenha: '',
  });

  // Load user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId || !token) {
        toast.error('Erro ao carregar perfil');
        return;
      }

      try {
        const response = isBarber 
          ? await barbeiroService.obter(userId)
          : await clienteService.obter(userId);

        const data = response.data;
        setFormData({
          id: data.id,
          nome: data.nome,
          email: data.email,
          telefone: data.telefone || '',
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido';
        toast.error(message);
      } finally {
        setLoadingData(false);
      }
    };

    fetchUserData();
  }, [userId, token, isBarber]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSenhaData({
      ...senhaData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBarber) {
      if (!formData.nome || !formData.email || !formData.telefone) {
        toast.error('Preencha todos os campos');
        return;
      }
    } else if (!formData.nome || !formData.telefone) {
      toast.error('Preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      const payload =
        isBarber
          ? {
              nome: formData.nome,
              email: formData.email,
              telefone: formData.telefone,
              descricao: '',
            }
          : {
              ...(formData.nome !== undefined ? { nome: formData.nome } : {}),
              ...(formData.telefone !== undefined ? { telefone: formData.telefone } : {}),
            };

      console.log('Payload atualizar perfil:', payload);

      if (isBarber) {
        await barbeiroService.atualizar(formData.id, payload);
      } else {
        await clienteService.atualizar(formData.id, payload);
      }

      // UX: Atualizar contexto global para mudar nome/email no Header instantaneamente
      updateUserInfo(formData.email);
      
      setEditing(false);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!senhaData.senhaAtual || !senhaData.novaSenha || !senhaData.confirmarNovaSenha) {
      toast.error('Preencha todos os campos de senha');
      return;
    }

    if (senhaData.novaSenha !== senhaData.confirmarNovaSenha) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (senhaData.novaSenha.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      if (isBarber) {
        await barbeiroService.alterarSenha(formData.id, senhaData.senhaAtual, senhaData.novaSenha);
      } else {
        await clienteService.alterarSenha(formData.id, senhaData.senhaAtual, senhaData.novaSenha);
      }

      toast.success('Senha alterada com sucesso!');
      setSenhaData({
        senhaAtual: '',
        novaSenha: '',
        confirmarNovaSenha: '',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white mb-2">
          Meu Perfil
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Gerencie suas informações pessoais e configurações de conta ({role === 'BARBEIRO' ? 'Barbeiro' : 'Cliente'})
        </p>
      </div>

      {loadingData ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-600 dark:text-slate-400">Carregando perfil...</p>
        </div>
      ) : (
        <div className="grid gap-6">
        {/* Profile Information Card */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                Informações pessoais
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Atualize suas informações de perfil
              </p>
            </div>
            {!editing && (
              <Button
                onClick={() => setEditing(true)}
                variant="outline"
                className="border-slate-300 dark:border-slate-700"
              >
                Editar
              </Button>
            )}
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <Avatar className="h-20 w-20 border-4 border-indigo-600 dark:border-indigo-400">
                <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-2xl">
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              {editing && (
                <Button
                  size="icon"
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">
                {formData.nome}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {formData.email}
              </p>
            </div>
          </div>

          <Separator className="my-6 bg-slate-200 dark:bg-slate-800" />

          {/* Form Fields */}
          <form onSubmit={handleSaveProfile} className="space-y-4">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-slate-700 dark:text-slate-300">
                Nome completo
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="nome"
                  name="nome"
                  type="text"
                  value={formData.nome}
                  onChange={handleChange}
                  disabled={!editing}
                  className="pl-10 h-11 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 disabled:opacity-60"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!editing}
                  className="pl-10 h-11 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 disabled:opacity-60"
                />
              </div>
            </div>

            {/* Telefone */}
            <div className="space-y-2">
              <Label htmlFor="telefone" className="text-slate-700 dark:text-slate-300">
                Telefone
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="telefone"
                  name="telefone"
                  type="tel"
                  value={formData.telefone}
                  onChange={handleChange}
                  disabled={!editing}
                  className="pl-10 h-11 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 disabled:opacity-60"
                />
              </div>
            </div>

            {editing && (
              <div className="flex gap-3 mt-6">
                <Button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white"
                  disabled={loading}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? 'Salvando...' : 'Salvar alterações'}
                </Button>
                <Button
                  type="button"
                  onClick={() => setEditing(false)}
                  variant="outline"
                  className="flex-1 border-slate-300 dark:border-slate-700"
                >
                  Cancelar
                </Button>
              </div>
            )}
          </form>
        </Card>

        {/* Change Password Card */}
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
              Alterar senha
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Mantenha sua conta segura com uma senha forte
            </p>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            {/* Senha Atual */}
            <div className="space-y-2">
              <Label htmlFor="senhaAtual" className="text-slate-700 dark:text-slate-300">
                Senha atual
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="senhaAtual"
                  name="senhaAtual"
                  type="password"
                  placeholder="Digite sua senha atual"
                  value={senhaData.senhaAtual}
                  onChange={handleSenhaChange}
                  className="pl-10 h-11 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                />
              </div>
            </div>

            {/* Nova Senha */}
            <div className="space-y-2">
              <Label htmlFor="novaSenha" className="text-slate-700 dark:text-slate-300">
                Nova senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="novaSenha"
                  name="novaSenha"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={senhaData.novaSenha}
                  onChange={handleSenhaChange}
                  className="pl-10 h-11 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                />
              </div>
            </div>

            {/* Confirmar Nova Senha */}
            <div className="space-y-2">
              <Label htmlFor="confirmarNovaSenha" className="text-slate-700 dark:text-slate-300">
                Confirmar nova senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="confirmarNovaSenha"
                  name="confirmarNovaSenha"
                  type="password"
                  placeholder="Digite a senha novamente"
                  value={senhaData.confirmarNovaSenha}
                  onChange={handleSenhaChange}
                  className="pl-10 h-11 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white"
            >
              Alterar senha
            </Button>
          </form>
        </Card>

        {/* Danger Zone Card */}
        <Card className="p-6 border-red-200 dark:border-red-900">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-1">
              Zona de perigo
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Ações irreversíveis relacionadas à sua conta
            </p>
          </div>
          <Button
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
          >
            Excluir conta
          </Button>
        </Card>
      </div>
     )}
   </div>
  );
}

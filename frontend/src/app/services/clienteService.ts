import api from './api';

export const clienteService = {
  async criar(nome: string, email: string, telefone: string, senha: string) {
    return api.post('/clientes', {
      nome,
      email,
      telefone,
      senha,
      aceiteTermosLGPD: true,
    });
  },

  async obter(id: number) {
    return api.get(`/clientes/${id}`);
  },

  async atualizar(id: number, data: any) {
    return api.put(`/clientes/${id}`, data);
  },

  async alterarSenha(id: number, senhaAtual: string, novaSenha: string) {
    return api.post(`/clientes/${id}/alterar-senha`, {
      senhaAtual,
      novaSenha,
    });
  },
};

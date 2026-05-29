import api from './api';

export const barbeiroService = {
  async listar(pageable?: any) {
    return api.get('/barbeiros', { params: pageable });
  },

  async obter(id: number) {
    return api.get(`/barbeiros/${id}`);
  },

  async atualizar(id: number, data: any) {
    return api.put(`/barbeiros/${id}`, data);
  },

  async alterarSenha(id: number, senhaAtual: string, novaSenha: string) {
    return api.post(`/barbeiros/${id}/alterar-senha`, {
      senhaAtual,
      novaSenha,
    });
  },
};

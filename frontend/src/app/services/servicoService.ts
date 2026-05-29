import api from './api';

export const servicoService = {
  async listar() {
    return api.get('/servicos');
  },

  async obter(id: number) {
    return api.get(`/servicos/${id}`);
  },
};

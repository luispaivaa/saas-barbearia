import api from './api';

export const disponibilidadeService = {
  async listarPorBarbeiro(barbeiroId: number) {
    return api.get(`/disponibilidades/barbeiro/${barbeiroId}`);
  },

  async criar(barbeiroId: number, dataTrabalho: string, horarioInicio: string, horarioFim: string) {
    return api.post('/disponibilidades', {
      barbeiroId,
      dataTrabalho,
      horarioInicio,
      horarioFim,
    });
  },

  async deletar(id: number) {
    return api.delete(`/disponibilidades/${id}`);
  },
};

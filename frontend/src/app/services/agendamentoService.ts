import api from './api';

export const agendamentoService = {
  async listarPorCliente(clienteId: number) {
    return api.get(`/agendamentos/cliente/${clienteId}`);
  },

  async listarPorBarbeiro(barbeiroId: number) {
    return api.get(`/agendamentos/barbeiro/${barbeiroId}`);
  },

  async criar(data: any) {
    return api.post('/agendamentos', data);
  },

  async cancelar(id: number) {
    return api.delete(`/agendamentos/${id}`);
  },

  async atualizar(id: number, data: any) {
    return api.put(`/agendamentos/${id}`, data);
  },
};

package com.rpteam.barberstore.service;

import com.rpteam.barberstore.dto.request.AgendamentoRequestDTO;
import com.rpteam.barberstore.dto.response.AgendamentoResponseDTO;
import com.rpteam.barberstore.entity.Agendamento;
import com.rpteam.barberstore.entity.Barbeiro;
import com.rpteam.barberstore.entity.Cliente;
import com.rpteam.barberstore.entity.Servico;
import com.rpteam.barberstore.entity.enums.StatusAgendamento;
import com.rpteam.barberstore.exception.RegraNegocioException;
import com.rpteam.barberstore.mapper.AgendamentoMapper;
import com.rpteam.barberstore.repository.AgendamentoRepository;
import com.rpteam.barberstore.repository.BarbeiroRepository;
import com.rpteam.barberstore.repository.ClienteRepository;
import com.rpteam.barberstore.repository.DisponibilidadeRepository;
import com.rpteam.barberstore.repository.ServicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;
    private final ClienteRepository clienteRepository;
    private final BarbeiroRepository barbeiroRepository;
    private final ServicoRepository servicoRepository;
    private final DisponibilidadeRepository disponibilidadeRepository;
    private final AgendamentoMapper agendamentoMapper;

    /**
     * HU1: Como cliente, gostaria de agendar um serviço para cortar o meu cabelo.
     * HU4: Como barbeiro, gostaria de montar o meu serviço com tempo e valor,
     *      e que a agenda se molde baseado no tempo do serviço.
     */
    @Transactional
    public AgendamentoResponseDTO agendarServico(AgendamentoRequestDTO dto) {
        validarDadosAgendamento(dto);

        Cliente cliente = clienteRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new RegraNegocioException(
                        "Cliente com ID " + dto.getClienteId() + " não encontrado"));

        Barbeiro barbeiro = barbeiroRepository.findById(dto.getBarbeiroId())
                .orElseThrow(() -> new RegraNegocioException(
                        "Barbeiro com ID " + dto.getBarbeiroId() + " não encontrado"));

        Servico servico = servicoRepository.findById(dto.getServicoId())
                .orElseThrow(() -> new RegraNegocioException(
                        "Serviço com ID " + dto.getServicoId() + " não encontrado"));

        // HU4: Calcula horário final baseado no tempo do serviço (em minutos)
        LocalTime horarioFim = dto.getHoraAgendada().plusMinutes(servico.getTempoDuracaoEstimado());

        // Validação 1: Verifica se o Barbeiro trabalha no horário solicitado
        validarAdherenciaRotina(barbeiro.getId(), dto.getDataAgendada(), dto.getHoraAgendada(), horarioFim);

        // Validação 2: Verifica se há conflito com outro agendamento
        validarConflitosAgendamento(barbeiro.getId(), dto.getDataAgendada(), dto.getHoraAgendada(), horarioFim);

        Agendamento agendamento = Agendamento.builder()
                .cliente(cliente)
                .barbeiro(barbeiro)
                .servico(servico)
                .dataAgendada(dto.getDataAgendada())
                .horaAgendada(dto.getHoraAgendada())
                .status(StatusAgendamento.AGENDADO)
                .build();

        Agendamento salvo = agendamentoRepository.save(agendamento);
        return agendamentoMapper.toAgendamentoResponseDTO(salvo);
    }

    @Transactional(readOnly = true)
    public List<AgendamentoResponseDTO> listarAgendamentosPorBarbeiro(Long barbeiroId) {
        validarBarbeiro(barbeiroId);

        return agendamentoRepository.findByBarbeiroId(barbeiroId).stream()
                .map(agendamentoMapper::toAgendamentoResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * HU2: Ver agendamentos do barbeiro filtrando por data específica.
     */
    @Transactional(readOnly = true)
    public List<AgendamentoResponseDTO> listarAgendamentosPorBarbeiroEData(Long barbeiroId, java.time.LocalDate data) {
        validarBarbeiro(barbeiroId);

        return agendamentoRepository.findByBarbeiroIdAndData(barbeiroId, data).stream()
                .map(agendamentoMapper::toAgendamentoResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AgendamentoResponseDTO> buscarPorBarbeiroEData(Long barbeiroId, String data) {
        java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy");
        java.time.LocalDate localDate = java.time.LocalDate.parse(data, formatter);
        return listarAgendamentosPorBarbeiroEData(barbeiroId, localDate);
    }

    @Transactional(readOnly = true)
    public List<AgendamentoResponseDTO> listarAgendamentosCliente(Long clienteId) {
        if (!clienteRepository.existsById(clienteId)) {
            throw new RegraNegocioException("Cliente com ID " + clienteId + " não encontrado");
        }

        return agendamentoRepository.findByClienteId(clienteId).stream()
                .map(agendamentoMapper::toAgendamentoResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AgendamentoResponseDTO obterPorId(Long id) {
        return agendamentoRepository.findById(id)
                .map(agendamentoMapper::toAgendamentoResponseDTO)
                .orElseThrow(() -> new RegraNegocioException(
                        "Agendamento com ID " + id + " não encontrado"));
    }

    @Transactional
    public void cancelarAgendamento(Long id) {
        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new RegraNegocioException(
                        "Agendamento com ID " + id + " não encontrado"));

        agendamento.setStatus(StatusAgendamento.CANCELADO);
        agendamentoRepository.save(agendamento);
    }

    @Transactional
    public AgendamentoResponseDTO concluirAgendamento(Long id) {
        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new RegraNegocioException(
                        "Agendamento com ID " + id + " não encontrado"));

        agendamento.setStatus(StatusAgendamento.CONCLUIDO);
        Agendamento salvo = agendamentoRepository.save(agendamento);
        
        return agendamentoMapper.toAgendamentoResponseDTO(salvo);
    }

    /**
     * Validação 1 (HU4): Verifica se o Barbeiro trabalha nos horários solicitados.
     * O intervalo [horarioInicio, horarioFim) deve estar completamente dentro
     * de alguma Disponibilidade do Barbeiro naquela data.
     */
    private void validarAdherenciaRotina(Long barbeiroId, java.time.LocalDate data,
                                          LocalTime horarioInicio, LocalTime horarioFim) {
        var disponibilidades = disponibilidadeRepository.findByBarbeiroIdAndDataTrabalho(barbeiroId, data);

        boolean temDisponibilidade = disponibilidades.stream()
                .anyMatch(d -> {
                    boolean inicioDentro = !horarioInicio.isBefore(d.getHorarioInicio())
                            && horarioInicio.isBefore(d.getHorarioFim());
                    boolean fimDentro = !horarioFim.isAfter(d.getHorarioFim());
                    return inicioDentro && fimDentro;
                });

        if (!temDisponibilidade) {
            throw new RegraNegocioException(
                    "Barbeiro não trabalha no intervalo de horário solicitado (" + horarioInicio + " a " + horarioFim + ") " +
                    "na data " + data);
        }
    }

    /**
     * Validação 2 (HU4): Verifica se há conflitos de agenda.
     * Um agendamento conflita com outro se seus intervalos se sobrepõem.
     */
    private void validarConflitosAgendamento(Long barbeiroId, java.time.LocalDate data,
                                              LocalTime horarioInicio, LocalTime horarioFim) {
        var agendamentos = agendamentoRepository.findByBarbeiroIdAndData(barbeiroId, data);

        boolean temConflito = agendamentos.stream()
                .filter(a -> a.getStatus() == StatusAgendamento.AGENDADO)
                .anyMatch(a -> {
                    // Calcula o horário final do agendamento existente
                    LocalTime horaFimExistente = a.getHoraAgendada()
                            .plusMinutes(a.getServico().getTempoDuracaoEstimado());

                    // Verifica se há sobreposição de intervalos
                    boolean comeca_antes_de_terminar = horarioInicio.isBefore(horaFimExistente);
                    boolean termina_depois_de_comecar = horarioFim.isAfter(a.getHoraAgendada());

                    return comeca_antes_de_terminar && termina_depois_de_comecar;
                });

        if (temConflito) {
            throw new RegraNegocioException(
                    "Barbeiro já possui um agendamento que conflita com este intervalo (" +
                    horarioInicio + " a " + horarioFim + ") na data " + data);
        }
    }

    private void validarDadosAgendamento(AgendamentoRequestDTO dto) {
        if (dto.getClienteId() == null || dto.getBarbeiroId() == null || dto.getServicoId() == null) {
            throw new RegraNegocioException("IDs de cliente, barbeiro e serviço são obrigatórios");
        }

        if (dto.getDataAgendada() == null || dto.getHoraAgendada() == null) {
            throw new RegraNegocioException("Data e hora do agendamento são obrigatórias");
        }
    }

    private void validarBarbeiro(Long barbeiroId) {
        if (!barbeiroRepository.existsById(barbeiroId)) {
            throw new RegraNegocioException("Barbeiro com ID " + barbeiroId + " não encontrado");
        }
    }

    @Transactional(readOnly = true)
    public String gerarRelatorioCsv() {
        List<Agendamento> agendamentos = agendamentoRepository.findAll();
        StringBuilder csv = new StringBuilder();
        csv.append("ID,Cliente,Barbeiro,Servico,Data,Hora,Status\n");

        for (Agendamento a : agendamentos) {
            csv.append(String.format("%d,%s,%s,%s,%s,%s,%s\n",
                    a.getId(),
                    a.getCliente().getNome(),
                    a.getBarbeiro().getNome(),
                    a.getServico().getNome(),
                    a.getDataAgendada(),
                    a.getHoraAgendada(),
                    a.getStatus()));
        }
        return csv.toString();
    }
}

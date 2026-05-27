package com.rpteam.barberstore.mapper;

import com.rpteam.barberstore.dto.request.AgendamentoRequestDTO;
import com.rpteam.barberstore.dto.response.AgendamentoResponseDTO;
import com.rpteam.barberstore.entity.Agendamento;
import com.rpteam.barberstore.repository.BarbeiroRepository;
import com.rpteam.barberstore.repository.ClienteRepository;
import com.rpteam.barberstore.repository.ServicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AgendamentoMapper {

    private final BarbeiroRepository barbeiroRepository;
    private final ClienteRepository clienteRepository;
    private final ServicoRepository servicoRepository;
    private final BarbeiroMapper barbeiroMapper;
    private final ClienteMapper clienteMapper;
    private final ServicoMapper servicoMapper;

    public Agendamento toAgendamentoEntity(AgendamentoRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        return Agendamento.builder()
                .cliente(clienteRepository.findById(dto.getClienteId()).orElse(null))
                .barbeiro(barbeiroRepository.findById(dto.getBarbeiroId()).orElse(null))
                .servico(servicoRepository.findById(dto.getServicoId()).orElse(null))
                .dataAgendada(dto.getDataAgendada())
                .horaAgendada(dto.getHoraAgendada())
                .build();
    }

    public AgendamentoResponseDTO toAgendamentoResponseDTO(Agendamento entity) {
        if (entity == null) {
            return null;
        }

        return AgendamentoResponseDTO.builder()
                .id(entity.getId())
                .cliente(clienteMapper.toClienteResponseDTO(entity.getCliente()))
                .barbeiro(barbeiroMapper.toBarbeiroResponseDTO(entity.getBarbeiro()))
                .servico(servicoMapper.toServicoResponseDTO(entity.getServico()))
                .dataAgendada(entity.getDataAgendada())
                .horaAgendada(entity.getHoraAgendada())
                .status(entity.getStatus())
                .dataCriacao(entity.getDataCriacao())
                .dataAtualizacao(entity.getDataAtualizacao())
                .build();
    }

    public void updateAgendamentoFromDTO(AgendamentoRequestDTO dto, Agendamento entity) {
        if (dto == null || entity == null) {
            return;
        }

        entity.setDataAgendada(dto.getDataAgendada());
        entity.setHoraAgendada(dto.getHoraAgendada());
    }
}

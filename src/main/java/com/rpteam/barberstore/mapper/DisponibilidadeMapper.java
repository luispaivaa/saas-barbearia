package com.rpteam.barberstore.mapper;

import com.rpteam.barberstore.dto.request.DisponibilidadeRequestDTO;
import com.rpteam.barberstore.dto.response.DisponibilidadeResponseDTO;
import com.rpteam.barberstore.entity.Disponibilidade;
import com.rpteam.barberstore.repository.BarbeiroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DisponibilidadeMapper {

    private final BarbeiroRepository barbeiroRepository;

    public Disponibilidade toDisponibilidadeEntity(DisponibilidadeRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        return Disponibilidade.builder()
                .barbeiro(barbeiroRepository.findById(dto.getBarbeiroId()).orElse(null))
                .dataTrabalho(dto.getDataTrabalho())
                .horarioInicio(dto.getHorarioInicio())
                .horarioFim(dto.getHorarioFim())
                .ativo(true)
                .build();
    }

    public DisponibilidadeResponseDTO toDisponibilidadeResponseDTO(Disponibilidade entity) {
        if (entity == null) {
            return null;
        }

        return DisponibilidadeResponseDTO.builder()
                .id(entity.getId())
                .barbeiroId(entity.getBarbeiro().getId())
                .barbeiroNome(entity.getBarbeiro().getNome())
                .dataTrabalho(entity.getDataTrabalho())
                .horarioInicio(entity.getHorarioInicio())
                .horarioFim(entity.getHorarioFim())
                .dataCriacao(entity.getDataCriacao())
                .dataAtualizacao(entity.getDataAtualizacao())
                .ativo(entity.getAtivo())
                .build();
    }

    public void updateDisponibilidadeFromDTO(DisponibilidadeRequestDTO dto, Disponibilidade entity) {
        if (dto == null || entity == null) {
            return;
        }

        entity.setDataTrabalho(dto.getDataTrabalho());
        entity.setHorarioInicio(dto.getHorarioInicio());
        entity.setHorarioFim(dto.getHorarioFim());
    }
}

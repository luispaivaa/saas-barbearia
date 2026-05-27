package com.rpteam.barberstore.mapper;

import com.rpteam.barberstore.dto.request.ServicoRequestDTO;
import com.rpteam.barberstore.dto.response.ServicoResponseDTO;
import com.rpteam.barberstore.entity.Servico;
import org.springframework.stereotype.Component;

@Component
public class ServicoMapper {

    public Servico toEntity(ServicoRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        return Servico.builder()
                .nome(dto.getNome())
                .preco(dto.getPreco())
                .tempoDuracaoEstimado(dto.getTempoDuracaoEstimado())
                .ativo(true)
                .build();
    }

    public ServicoResponseDTO toResponseDTO(Servico entity) {
        if (entity == null) {
            return null;
        }

        return ServicoResponseDTO.builder()
                .id(entity.getId())
                .nome(entity.getNome())
                .preco(entity.getPreco())
                .tempoDuracaoEstimado(entity.getTempoDuracaoEstimado())
                .dataCriacao(entity.getDataCriacao())
                .dataAtualizacao(entity.getDataAtualizacao())
                .ativo(entity.getAtivo())
                .build();
    }

    public void updateServicoFromDTO(ServicoRequestDTO dto, Servico entity) {
        if (dto == null || entity == null) {
            return;
        }

        entity.setNome(dto.getNome());
        entity.setPreco(dto.getPreco());
        entity.setTempoDuracaoEstimado(dto.getTempoDuracaoEstimado());
    }
}

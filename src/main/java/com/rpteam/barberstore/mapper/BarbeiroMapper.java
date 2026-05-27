package com.rpteam.barberstore.mapper;

import com.rpteam.barberstore.dto.request.BarbeiroRequestDTO;
import com.rpteam.barberstore.dto.response.BarbeiroResponseDTO;
import com.rpteam.barberstore.entity.Barbeiro;
import org.springframework.stereotype.Component;

@Component
public class BarbeiroMapper {

    public Barbeiro toBarbeiroEntity(BarbeiroRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        return Barbeiro.builder()
                .email(dto.getEmail())
                .senhaCriptografada(dto.getSenha())
                .nome(dto.getNome())
                .telefone(dto.getTelefone())
                .descricao(dto.getDescricao())
                .ativo(true)
                .build();
    }

    public BarbeiroResponseDTO toBarbeiroResponseDTO(Barbeiro entity) {
        if (entity == null) {
            return null;
        }

        return BarbeiroResponseDTO.builder()
                .id(entity.getId())
                .email(entity.getEmail())
                .dataCriacao(entity.getDataCriacao())
                .dataAtualizacao(entity.getDataAtualizacao())
                .ativo(entity.getAtivo())
                .nome(entity.getNome())
                .telefone(entity.getTelefone())
                .descricao(entity.getDescricao())
                .classificacaoMedia(entity.getClassificacaoMedia())
                .build();
    }

    public void updateBarbeiroFromDTO(BarbeiroRequestDTO dto, Barbeiro entity) {
        if (dto == null || entity == null) {
            return;
        }

        entity.setEmail(dto.getEmail());
        entity.setNome(dto.getNome());
        entity.setTelefone(dto.getTelefone());
        entity.setDescricao(dto.getDescricao());
    }
}

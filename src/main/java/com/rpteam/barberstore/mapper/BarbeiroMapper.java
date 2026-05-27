package com.rpteam.barberstore.mapper;

import com.rpteam.barberstore.dto.request.BarbeiroRequestDTO;
import com.rpteam.barberstore.dto.response.BarbeiroResponseDTO;
import com.rpteam.barberstore.entity.Barbeiro;
import org.springframework.stereotype.Component;

@Component
public class BarbeiroMapper {

    public Barbeiro toEntity(BarbeiroRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        Barbeiro barbeiro = new Barbeiro();
        barbeiro.setEmail(dto.getEmail());
        barbeiro.setSenhaCriptografada(dto.getSenha());
        barbeiro.setNome(dto.getNome());
        barbeiro.setTelefone(dto.getTelefone());
        barbeiro.setDescricao(dto.getDescricao());
        barbeiro.setAtivo(true);

        return barbeiro;
    }

    public BarbeiroResponseDTO toResponseDTO(Barbeiro entity) {
        if (entity == null) {
            return null;
        }

        BarbeiroResponseDTO dto = new BarbeiroResponseDTO();
        dto.setId(entity.getId());
        dto.setEmail(entity.getEmail());
        dto.setDataCriacao(entity.getDataCriacao());
        dto.setDataAtualizacao(entity.getDataAtualizacao());
        dto.setAtivo(entity.getAtivo());
        dto.setNome(entity.getNome());
        dto.setTelefone(entity.getTelefone());
        dto.setDescricao(entity.getDescricao());
        dto.setClassificacaoMedia(entity.getClassificacaoMedia());

        return dto;
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

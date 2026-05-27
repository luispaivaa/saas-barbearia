package com.rpteam.barberstore.mapper;

import com.rpteam.barberstore.dto.request.ClienteRequestDTO;
import com.rpteam.barberstore.dto.response.ClienteResponseDTO;
import com.rpteam.barberstore.entity.Cliente;
import org.springframework.stereotype.Component;

@Component
public class ClienteMapper {

    public Cliente toClienteEntity(ClienteRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        return Cliente.builder()
                .email(dto.getEmail())
                .senhaCriptografada(dto.getSenha())
                .nome(dto.getNome())
                .telefone(dto.getTelefone())
                .aceiteTermosLGPD(dto.getAceiteTermosLGPD())
                .ativo(true)
                .build();
    }

    public ClienteResponseDTO toClienteResponseDTO(Cliente entity) {
        if (entity == null) {
            return null;
        }

        return ClienteResponseDTO.builder()
                .id(entity.getId())
                .email(entity.getEmail())
                .dataCriacao(entity.getDataCriacao())
                .dataAtualizacao(entity.getDataAtualizacao())
                .ativo(entity.getAtivo())
                .nome(entity.getNome())
                .telefone(entity.getTelefone())
                .aceiteTermosLGPD(entity.getAceiteTermosLGPD())
                .build();
    }

    public void updateClienteFromDTO(ClienteRequestDTO dto, Cliente entity) {
        if (dto == null || entity == null) {
            return;
        }

        entity.setEmail(dto.getEmail());
        entity.setNome(dto.getNome());
        entity.setTelefone(dto.getTelefone());
        entity.setAceiteTermosLGPD(dto.getAceiteTermosLGPD());
    }
}

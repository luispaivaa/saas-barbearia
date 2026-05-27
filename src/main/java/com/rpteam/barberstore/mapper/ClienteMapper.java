package com.rpteam.barberstore.mapper;

import com.rpteam.barberstore.dto.request.ClienteRequestDTO;
import com.rpteam.barberstore.dto.response.ClienteResponseDTO;
import com.rpteam.barberstore.entity.Cliente;
import org.springframework.stereotype.Component;

@Component
public class ClienteMapper {

    public Cliente toEntity(ClienteRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        Cliente cliente = new Cliente();
        cliente.setEmail(dto.getEmail());
        cliente.setSenhaCriptografada(dto.getSenha());
        cliente.setNome(dto.getNome());
        cliente.setTelefone(dto.getTelefone());
        cliente.setAceiteTermosLGPD(dto.getAceiteTermosLGPD());
        cliente.setAtivo(true);

        return cliente;
    }

    public ClienteResponseDTO toResponseDTO(Cliente entity) {
        if (entity == null) {
            return null;
        }

        ClienteResponseDTO dto = new ClienteResponseDTO();
        dto.setId(entity.getId());
        dto.setEmail(entity.getEmail());
        dto.setDataCriacao(entity.getDataCriacao());
        dto.setDataAtualizacao(entity.getDataAtualizacao());
        dto.setAtivo(entity.getAtivo());
        dto.setNome(entity.getNome());
        dto.setTelefone(entity.getTelefone());
        dto.setAceiteTermosLGPD(entity.getAceiteTermosLGPD());

        return dto;
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

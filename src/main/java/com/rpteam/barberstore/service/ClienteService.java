package com.rpteam.barberstore.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.rpteam.barberstore.dto.request.ClienteRequestDTO;
import com.rpteam.barberstore.dto.request.ClienteUpdateDTO;
import com.rpteam.barberstore.dto.response.ClienteResponseDTO;
import com.rpteam.barberstore.entity.Cliente;
import com.rpteam.barberstore.exception.EntityNotFoundException;
import com.rpteam.barberstore.mapper.ClienteMapper;
import com.rpteam.barberstore.repository.ClienteRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final ClienteMapper clienteMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public ClienteResponseDTO criar(ClienteRequestDTO dto) {
        Cliente cliente = clienteMapper.toEntity(dto);
        cliente.setSenhaCriptografada(passwordEncoder.encode(dto.getSenha()));
        cliente.setTipo("CLIENTE");
        cliente.setAtivo(true);

        Cliente saved = clienteRepository.save(cliente);
        return clienteMapper.toResponseDTO(saved);
    }

    public ClienteResponseDTO obterPorId(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado"));
        return clienteMapper.toResponseDTO(cliente);
    }

    public Cliente obterPorEmail(String email) {
        return clienteRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado"));
    }

    public Page<ClienteResponseDTO> listar(Pageable pageable) {
        return clienteRepository.findAllByAtivo(true, pageable)
                .map(clienteMapper::toResponseDTO);
    }

    @Transactional
    public ClienteResponseDTO atualizar(Long id, ClienteUpdateDTO dto) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado"));

        if (dto.getNome() != null) cliente.setNome(dto.getNome());
        if (dto.getTelefone() != null) cliente.setTelefone(dto.getTelefone());

        Cliente updated = clienteRepository.save(cliente);
        return clienteMapper.toResponseDTO(updated);
    }

    @Transactional
    public void deletar(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado"));
        cliente.setAtivo(false);
        clienteRepository.save(cliente);
    }

    @Transactional
    public void alterarSenha(Long id, String senhaAtual, String novaSenha) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado"));

        if (!passwordEncoder.matches(senhaAtual, cliente.getSenhaCriptografada())) {
            throw new IllegalArgumentException("Senha atual incorreta");
        }

        cliente.setSenhaCriptografada(passwordEncoder.encode(novaSenha));
        clienteRepository.save(cliente);
    }
}

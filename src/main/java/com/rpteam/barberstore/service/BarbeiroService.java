package com.rpteam.barberstore.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.rpteam.barberstore.dto.request.BarbeiroRequestDTO;
import com.rpteam.barberstore.dto.response.BarbeiroResponseDTO;
import com.rpteam.barberstore.entity.Barbeiro;
import com.rpteam.barberstore.exception.EntityNotFoundException;
import com.rpteam.barberstore.mapper.BarbeiroMapper;
import com.rpteam.barberstore.repository.BarbeiroRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BarbeiroService {

    private final BarbeiroRepository barbeiroRepository;
    private final BarbeiroMapper barbeiroMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public BarbeiroResponseDTO criar(BarbeiroRequestDTO dto) {
        Barbeiro barbeiro = barbeiroMapper.toEntity(dto);
        barbeiro.setSenhaCriptografada(passwordEncoder.encode(dto.getSenha()));
        barbeiro.setTipo("BARBEIRO");
        barbeiro.setAtivo(true);
        barbeiro.setClassificacaoMedia(0.0);

        Barbeiro saved = barbeiroRepository.save(barbeiro);
        return barbeiroMapper.toResponseDTO(saved);
    }

    public BarbeiroResponseDTO obterPorId(Long id) {
        Barbeiro barbeiro = barbeiroRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Barbeiro não encontrado"));
        return barbeiroMapper.toResponseDTO(barbeiro);
    }

    public Barbeiro obterPorEmail(String email) {
        return barbeiroRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Barbeiro não encontrado"));
    }

    public Page<BarbeiroResponseDTO> listar(Pageable pageable) {
        return barbeiroRepository.findAllByAtivo(true, pageable)
                .map(barbeiroMapper::toResponseDTO);
    }

    @Transactional
    public BarbeiroResponseDTO atualizar(Long id, BarbeiroRequestDTO dto) {
        Barbeiro barbeiro = barbeiroRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Barbeiro não encontrado"));

        if (dto.getNome() != null) barbeiro.setNome(dto.getNome());
        if (dto.getTelefone() != null) barbeiro.setTelefone(dto.getTelefone());
        if (dto.getEmail() != null) barbeiro.setEmail(dto.getEmail());
        if (dto.getDescricao() != null) barbeiro.setDescricao(dto.getDescricao());

        Barbeiro updated = barbeiroRepository.save(barbeiro);
        return barbeiroMapper.toResponseDTO(updated);
    }

    @Transactional
    public void deletar(Long id) {
        Barbeiro barbeiro = barbeiroRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Barbeiro não encontrado"));
        barbeiro.setAtivo(false);
        barbeiroRepository.save(barbeiro);
    }

    @Transactional
    public void alterarSenha(Long id, String senhaAtual, String novaSenha) {
        Barbeiro barbeiro = barbeiroRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Barbeiro não encontrado"));

        if (!passwordEncoder.matches(senhaAtual, barbeiro.getSenhaCriptografada())) {
            throw new IllegalArgumentException("Senha atual incorreta");
        }

        barbeiro.setSenhaCriptografada(passwordEncoder.encode(novaSenha));
        barbeiroRepository.save(barbeiro);
    }
}

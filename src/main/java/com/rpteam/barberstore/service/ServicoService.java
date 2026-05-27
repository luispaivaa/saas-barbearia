package com.rpteam.barberstore.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.rpteam.barberstore.dto.request.ServicoRequestDTO;
import com.rpteam.barberstore.dto.response.ServicoResponseDTO;
import com.rpteam.barberstore.entity.Servico;
import com.rpteam.barberstore.exception.EntityNotFoundException;
import com.rpteam.barberstore.mapper.ServicoMapper;
import com.rpteam.barberstore.repository.ServicoRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServicoService {

    private final ServicoRepository servicoRepository;
    private final ServicoMapper servicoMapper;

    @Transactional
    public ServicoResponseDTO criar(ServicoRequestDTO dto) {
        Servico servico = servicoMapper.toEntity(dto);
        servico.setAtivo(true);
        
        Servico saved = servicoRepository.save(servico);
        return servicoMapper.toResponseDTO(saved);
    }

    public ServicoResponseDTO obterPorId(Long id) {
        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Serviço não encontrado"));
        return servicoMapper.toResponseDTO(servico);
    }

    public Page<ServicoResponseDTO> listar(Pageable pageable) {
        return servicoRepository.findAllByAtivo(true, pageable)
                .map(servicoMapper::toResponseDTO);
    }

    @Transactional
    public ServicoResponseDTO atualizar(Long id, ServicoRequestDTO dto) {
        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Serviço não encontrado"));

        if (dto.getNome() != null) servico.setNome(dto.getNome());
        if (dto.getPreco() != null) servico.setPreco(dto.getPreco());
        if (dto.getTempoDuracaoEstimado() != null) servico.setTempoDuracaoEstimado(dto.getTempoDuracaoEstimado());

        Servico updated = servicoRepository.save(servico);
        return servicoMapper.toResponseDTO(updated);
    }

    @Transactional
    public void deletar(Long id) {
        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Serviço não encontrado"));
        servico.setAtivo(false);
        servicoRepository.save(servico);
    }
}

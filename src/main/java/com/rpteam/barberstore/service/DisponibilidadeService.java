package com.rpteam.barberstore.service;

import com.rpteam.barberstore.dto.request.DisponibilidadeRequestDTO;
import com.rpteam.barberstore.dto.response.DisponibilidadeResponseDTO;
import com.rpteam.barberstore.entity.Barbeiro;
import com.rpteam.barberstore.entity.Disponibilidade;
import com.rpteam.barberstore.exception.RegraNegocioException;
import com.rpteam.barberstore.mapper.DisponibilidadeMapper;
import com.rpteam.barberstore.repository.BarbeiroRepository;
import com.rpteam.barberstore.repository.DisponibilidadeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DisponibilidadeService {

    private final DisponibilidadeRepository disponibilidadeRepository;
    private final BarbeiroRepository barbeiroRepository;
    private final DisponibilidadeMapper disponibilidadeMapper;

    @Transactional
    public DisponibilidadeResponseDTO criar(DisponibilidadeRequestDTO dto) {
        validarDadosDisponibilidade(dto);

        Barbeiro barbeiro = barbeiroRepository.findById(dto.getBarbeiroId())
                .orElseThrow(() -> new RegraNegocioException(
                        "Barbeiro com ID " + dto.getBarbeiroId() + " não encontrado"));

        validarHorarios(dto);

        Disponibilidade disponibilidade = Disponibilidade.builder()
                .barbeiro(barbeiro)
                .dataTrabalho(dto.getDataTrabalho())
                .horarioInicio(dto.getHorarioInicio())
                .horarioFim(dto.getHorarioFim())
                .ativo(true)
                .build();

        Disponibilidade salva = disponibilidadeRepository.save(disponibilidade);
        return disponibilidadeMapper.toDisponibilidadeResponseDTO(salva);
    }

    @Transactional(readOnly = true)
    public DisponibilidadeResponseDTO obterPorId(Long id) {
        return disponibilidadeRepository.findById(id)
                .map(disponibilidadeMapper::toDisponibilidadeResponseDTO)
                .orElseThrow(() -> new RegraNegocioException(
                        "Disponibilidade com ID " + id + " não encontrada"));
    }

    @Transactional(readOnly = true)
    public List<DisponibilidadeResponseDTO> listarPorBarbeiro(Long barbeiroId) {
        validarBarbeiro(barbeiroId);

        return disponibilidadeRepository.findByBarbeiroId(barbeiroId).stream()
                .filter(Disponibilidade::getAtivo)
                .map(disponibilidadeMapper::toDisponibilidadeResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DisponibilidadeResponseDTO> listarPorBarbeiroEData(Long barbeiroId, LocalDate data) {
        validarBarbeiro(barbeiroId);

        return disponibilidadeRepository.findByBarbeiroIdAndDataTrabalho(barbeiroId, data).stream()
                .filter(Disponibilidade::getAtivo)
                .map(disponibilidadeMapper::toDisponibilidadeResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public DisponibilidadeResponseDTO atualizar(Long id, DisponibilidadeRequestDTO dto) {
        Disponibilidade disponibilidade = disponibilidadeRepository.findById(id)
                .orElseThrow(() -> new RegraNegocioException(
                        "Disponibilidade com ID " + id + " não encontrada"));

        validarHorarios(dto);

        disponibilidade.setDataTrabalho(dto.getDataTrabalho());
        disponibilidade.setHorarioInicio(dto.getHorarioInicio());
        disponibilidade.setHorarioFim(dto.getHorarioFim());

        Disponibilidade atualizada = disponibilidadeRepository.save(disponibilidade);
        return disponibilidadeMapper.toDisponibilidadeResponseDTO(atualizada);
    }

    @Transactional
    public void excluir(Long id) {
        Disponibilidade disponibilidade = disponibilidadeRepository.findById(id)
                .orElseThrow(() -> new RegraNegocioException(
                        "Disponibilidade com ID " + id + " não encontrada"));

        disponibilidade.setAtivo(false);
        disponibilidadeRepository.save(disponibilidade);
    }

    private void validarBarbeiro(Long barbeiroId) {
        if (!barbeiroRepository.existsById(barbeiroId)) {
            throw new RegraNegocioException(
                    "Barbeiro com ID " + barbeiroId + " não encontrado");
        }
    }

    private void validarDadosDisponibilidade(DisponibilidadeRequestDTO dto) {
        if (dto.getDataTrabalho() == null) {
            throw new RegraNegocioException("Data de trabalho é obrigatória");
        }

        if (dto.getHorarioInicio() == null || dto.getHorarioFim() == null) {
            throw new RegraNegocioException("Horários de início e fim são obrigatórios");
        }
    }

    private void validarHorarios(DisponibilidadeRequestDTO dto) {
        if (!dto.getHorarioInicio().isBefore(dto.getHorarioFim())) {
            throw new RegraNegocioException(
                    "Horário de início deve ser anterior ao horário de fim");
        }
    }
}

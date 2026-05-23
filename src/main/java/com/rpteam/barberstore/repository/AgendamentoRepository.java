package com.rpteam.barberstore.repository;

import com.rpteam.barberstore.entity.Agendamento;
import com.rpteam.barberstore.entity.enums.StatusAgendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    @Query("SELECT a FROM Agendamento a WHERE a.barbeiro.id = :barbeiroId")
    List<Agendamento> findByBarbeiroId(@Param("barbeiroId") Long barbeiroId);

    @Query("SELECT a FROM Agendamento a WHERE a.cliente.id = :clienteId")
    List<Agendamento> findByClienteId(@Param("clienteId") Long clienteId);

    @Query("SELECT a FROM Agendamento a WHERE a.barbeiro.id = :barbeiroId AND a.dataAgendada = :data")
    List<Agendamento> findByBarbeiroIdAndData(@Param("barbeiroId") Long barbeiroId, @Param("data") LocalDate data);

    @Query("SELECT a FROM Agendamento a WHERE a.cliente.id = :clienteId AND a.status = :status")
    List<Agendamento> findByClienteIdAndStatus(@Param("clienteId") Long clienteId, @Param("status") StatusAgendamento status);
}

package com.rpteam.barberstore.repository;

import com.rpteam.barberstore.entity.Disponibilidade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DisponibilidadeRepository extends JpaRepository<Disponibilidade, Long> {
    
    @Query("SELECT d FROM Disponibilidade d WHERE d.barbeiro.id = :barbeiroId AND d.dataTrabalho = :data")
    List<Disponibilidade> findByBarbeiroIdAndDataTrabalho(@Param("barbeiroId") Long barbeiroId, @Param("data") LocalDate data);

    @Query("SELECT d FROM Disponibilidade d WHERE d.barbeiro.id = :barbeiroId")
    List<Disponibilidade> findByBarbeiroId(@Param("barbeiroId") Long barbeiroId);
}

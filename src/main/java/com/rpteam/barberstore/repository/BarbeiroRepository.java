package com.rpteam.barberstore.repository;

import com.rpteam.barberstore.entity.Barbeiro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BarbeiroRepository extends JpaRepository<Barbeiro, Long> {
    Optional<Barbeiro> findByEmail(String email);

    Optional<Barbeiro> findByNome(String nome);

    boolean existsByEmail(String email);
}

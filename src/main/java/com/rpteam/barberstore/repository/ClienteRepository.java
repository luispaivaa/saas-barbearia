package com.rpteam.barberstore.repository;

import com.rpteam.barberstore.entity.Cliente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Optional<Cliente> findByEmail(String email);

    Optional<Cliente> findByNome(String nome);

    boolean existsByEmail(String email);
    
    Page<Cliente> findAllByAtivo(Boolean ativo, Pageable pageable);
}

package com.rpteam.barberstore.service;

import com.rpteam.barberstore.dto.request.ClienteRequestDTO;
import com.rpteam.barberstore.dto.response.ClienteResponseDTO;
import com.rpteam.barberstore.entity.Cliente;
import com.rpteam.barberstore.exception.EntityNotFoundException;
import com.rpteam.barberstore.mapper.ClienteMapper;
import com.rpteam.barberstore.repository.ClienteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ClienteService - Testes Unitários")
class ClienteServiceTest {

    @Mock
    private ClienteRepository clienteRepository;

    @Mock
    private ClienteMapper clienteMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private ClienteService clienteService;

    private Cliente cliente;
    private ClienteRequestDTO requestDTO;
    private ClienteResponseDTO responseDTO;

    @BeforeEach
    void setUp() {
        cliente = new Cliente();
        cliente.setId(1L);
        cliente.setNome("João Silva");
        cliente.setEmail("joao@email.com");
        cliente.setTelefone("11987654321");
        cliente.setSenhaCriptografada("$2a$10$senhaHash123");
        cliente.setAtivo(true);
        cliente.setTipo("CLIENTE");

        requestDTO = new ClienteRequestDTO();
        requestDTO.setNome("João Silva");
        requestDTO.setEmail("joao@email.com");
        requestDTO.setTelefone("11987654321");
        requestDTO.setSenha("senha123");

        responseDTO = new ClienteResponseDTO();
        responseDTO.setId(1L);
        responseDTO.setNome("João Silva");
        responseDTO.setEmail("joao@email.com");
        responseDTO.setTelefone("11987654321");
    }

    @Test
    @DisplayName("Deve criar um cliente com sucesso")
    void testCriarClienteComSucesso() {
        when(clienteMapper.toEntity(requestDTO)).thenReturn(cliente);
        when(passwordEncoder.encode("senha123")).thenReturn("$2a$10$senhaHashCriptografada");
        when(clienteRepository.save(any(Cliente.class))).thenReturn(cliente);
        when(clienteMapper.toResponseDTO(cliente)).thenReturn(responseDTO);

        ClienteResponseDTO resultado = clienteService.criar(requestDTO);

        assertNotNull(resultado);
        assertEquals("João Silva", resultado.getNome());
        assertEquals("joao@email.com", resultado.getEmail());

        verify(clienteRepository, times(1)).save(any(Cliente.class));
        verify(passwordEncoder, times(1)).encode("senha123");
        verify(clienteMapper, times(1)).toEntity(requestDTO);
        verify(clienteMapper, times(1)).toResponseDTO(cliente);
    }

    @Test
    @DisplayName("Deve buscar cliente por ID com sucesso")
    void testObterPorIdComSucesso() {
        when(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(clienteMapper.toResponseDTO(cliente)).thenReturn(responseDTO);

        ClienteResponseDTO resultado = clienteService.obterPorId(1L);

        assertNotNull(resultado);
        assertEquals("João Silva", resultado.getNome());
        verify(clienteRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Deve lançar exceção ao buscar cliente inexistente")
    void testObterPorIdNaoEncontrado() {
        when(clienteRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> {
            clienteService.obterPorId(999L);
        });

        verify(clienteRepository, times(1)).findById(999L);
    }

    @Test
    @DisplayName("Deve buscar cliente por email com sucesso")
    void testObterPorEmailComSucesso() {
        when(clienteRepository.findByEmail("joao@email.com")).thenReturn(Optional.of(cliente));

        Cliente resultado = clienteService.obterPorEmail("joao@email.com");

        assertNotNull(resultado);
        assertEquals("João Silva", resultado.getNome());
        verify(clienteRepository, times(1)).findByEmail("joao@email.com");
    }

    @Test
    @DisplayName("Deve lançar exceção ao buscar cliente por email inexistente")
    void testObterPorEmailNaoEncontrado() {
        when(clienteRepository.findByEmail("inexistente@email.com")).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> {
            clienteService.obterPorEmail("inexistente@email.com");
        });

        verify(clienteRepository, times(1)).findByEmail("inexistente@email.com");
    }

    @Test
    @DisplayName("Deve deletar cliente com sucesso (soft delete)")
    void testDeletarClienteComSucesso() {
        when(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(clienteRepository.save(any(Cliente.class))).thenReturn(cliente);

        clienteService.deletar(1L);

        verify(clienteRepository, times(1)).findById(1L);
        verify(clienteRepository, times(1)).save(any(Cliente.class));
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar deletar cliente inexistente")
    void testDeletarClienteNaoEncontrado() {
        when(clienteRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> {
            clienteService.deletar(999L);
        });

        verify(clienteRepository, times(1)).findById(999L);
        verify(clienteRepository, never()).save(any(Cliente.class));
    }

    @Test
    @DisplayName("Deve alterar senha do cliente com sucesso")
    void testAlterarSenhaComSucesso() {
        when(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(passwordEncoder.matches("senha123", "$2a$10$senhaHash123")).thenReturn(true);
        when(passwordEncoder.encode("novaSenha456")).thenReturn("$2a$10$novaHashCriptografada");
        when(clienteRepository.save(any(Cliente.class))).thenReturn(cliente);

        assertDoesNotThrow(() -> clienteService.alterarSenha(1L, "senha123", "novaSenha456"));

        verify(clienteRepository, times(1)).findById(1L);
        verify(passwordEncoder, times(1)).matches("senha123", "$2a$10$senhaHash123");
        verify(passwordEncoder, times(1)).encode("novaSenha456");
        verify(clienteRepository, times(1)).save(any(Cliente.class));
    }

    @Test
    @DisplayName("Deve lançar exceção ao alterar senha com senha atual incorreta")
    void testAlterarSenhaComSenhaAtualIncorreta() {
        when(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(passwordEncoder.matches("senhaErrada", "$2a$10$senhaHash123")).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> {
            clienteService.alterarSenha(1L, "senhaErrada", "novaSenha456");
        });

        verify(clienteRepository, times(1)).findById(1L);
        verify(passwordEncoder, times(1)).matches("senhaErrada", "$2a$10$senhaHash123");
        verify(clienteRepository, never()).save(any(Cliente.class));
    }
}
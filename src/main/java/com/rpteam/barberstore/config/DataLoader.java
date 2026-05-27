package com.rpteam.barberstore.config;

import com.rpteam.barberstore.entity.Barbeiro;
import com.rpteam.barberstore.entity.Cliente;
import com.rpteam.barberstore.entity.Disponibilidade;
import com.rpteam.barberstore.entity.Servico;
import com.rpteam.barberstore.repository.BarbeiroRepository;
import com.rpteam.barberstore.repository.ClienteRepository;
import com.rpteam.barberstore.repository.ServicoRepository;
import com.rpteam.barberstore.repository.DisponibilidadeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final BarbeiroRepository barbeiroRepository;
    private final ClienteRepository clienteRepository;
    private final ServicoRepository servicoRepository;
    private final DisponibilidadeRepository disponibilidadeRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (barbeiroRepository.count() == 0 && clienteRepository.count() == 0) {
            carregarDadosTeste();
        }
    }

    private void carregarDadosTeste() {
        // Cria Barbeiro de teste
        Barbeiro barbeiro = new Barbeiro();
        barbeiro.setEmail("carlos.barbeiro@email.com");
        barbeiro.setSenhaCriptografada(passwordEncoder.encode("senha123"));
        barbeiro.setNome("Carlos Silva");
        barbeiro.setTelefone("11987654321");
        barbeiro.setDescricao("Barbeiro experiente com 10 anos de profissão. Especialista em corte moderno e barba.");
        barbeiro.setClassificacaoMedia(4.8);
        barbeiro.setAtivo(true);
        barbeiro.setTipo("BARBEIRO");

        barbeiro = barbeiroRepository.save(barbeiro);

        // Adiciona disponibilidades para o barbeiro (hoje e próximos 7 dias)
        for (int i = 0; i < 7; i++) {
            Disponibilidade disponibilidade = Disponibilidade.builder()
                    .barbeiro(barbeiro)
                    .dataTrabalho(LocalDate.now().plusDays(i))
                    .horarioInicio(LocalTime.of(9, 0))
                    .horarioFim(LocalTime.of(18, 0))
                    .ativo(true)
                    .build();
            disponibilidadeRepository.save(disponibilidade);
        }

        // Cria Cliente de teste
        Cliente cliente = new Cliente();
        cliente.setEmail("joao.silva@email.com");
        cliente.setSenhaCriptografada(passwordEncoder.encode("senha123"));
        cliente.setNome("João Silva");
        cliente.setTelefone("11912345678");
        cliente.setAceiteTermosLGPD(true);
        cliente.setAtivo(true);
        cliente.setTipo("CLIENTE");

        clienteRepository.save(cliente);

        // Cria Serviços de teste
        Servico corte = Servico.builder()
                .nome("Corte Simples")
                .preco(new BigDecimal("30.00"))
                .tempoDuracaoEstimado(30)
                .ativo(true)
                .build();

        Servico corteBarba = Servico.builder()
                .nome("Corte + Barba")
                .preco(new BigDecimal("50.00"))
                .tempoDuracaoEstimado(60)
                .ativo(true)
                .build();

        Servico barbaCompleta = Servico.builder()
                .nome("Barba Completa")
                .preco(new BigDecimal("25.00"))
                .tempoDuracaoEstimado(40)
                .ativo(true)
                .build();

        servicoRepository.save(corte);
        servicoRepository.save(corteBarba);
        servicoRepository.save(barbaCompleta);

        System.out.println("✅ Dados de teste carregados com sucesso!");
        System.out.println("   - Barbeiro: Carlos Silva (carlos.barbeiro@email.com) | senha: senha123");
        System.out.println("   - Cliente: João Silva (joao.silva@email.com) | senha: senha123");
        System.out.println("   - Serviços: 3 criados");
        System.out.println("   - Disponibilidades: 7 dias criados (09:00 - 18:00)");
    }
}



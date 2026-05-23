package com.rpteam.barberstore.config;

import com.rpteam.barberstore.entity.Barbeiro;
import com.rpteam.barberstore.entity.Cliente;
import com.rpteam.barberstore.entity.Servico;
import com.rpteam.barberstore.repository.BarbeiroRepository;
import com.rpteam.barberstore.repository.ClienteRepository;
import com.rpteam.barberstore.repository.ServicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final BarbeiroRepository barbeiroRepository;
    private final ClienteRepository clienteRepository;
    private final ServicoRepository servicoRepository;

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
        barbeiro.setSenhaCriptografada("senha123");
        barbeiro.setNome("Carlos Silva");
        barbeiro.setTelefone("11987654321");
        barbeiro.setDescricao("Barbeiro experiente com 10 anos de profissão. Especialista em corte moderno e barba.");
        barbeiro.setClassificacaoMedia(4.8);
        barbeiro.setAtivo(true);

        barbeiroRepository.save(barbeiro);

        // Cria Cliente de teste
        Cliente cliente = new Cliente();
        cliente.setEmail("joao.silva@email.com");
        cliente.setSenhaCriptografada("senha123");
        cliente.setNome("João Silva");
        cliente.setTelefone("11912345678");
        cliente.setAceiteTermosLGPD(true);
        cliente.setAtivo(true);

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
        System.out.println("   - Barbeiro: Carlos Silva (ID: 1)");
        System.out.println("   - Cliente: João Silva (ID: 1)");
        System.out.println("   - Serviços: 3 criados");
    }
}


1. Modelo de Negócio

O sistema consiste num SAAS (Software as a Service) para agendamento de horários de clientes em barbearias. O objetivo principal é informatizar e automatizar a gestão de marcações. O sistema possuirá duas visões distintas: a visão do Cliente (focada em marcar horários de forma autônoma e visualizar o próprio histórico) e a visão do Barbeiro (painel administrativo com controle total sobre a agenda, serviços e cancelamentos).

1. Requisitos Funcionais (RF)

    RF01 - AUTENTICAR USUÁRIO: O sistema deve fornecer um mecanismo de autenticação (Login) para validar o acesso dos utilizadores à plataforma, com distinção estrita de permissões entre os perfis de Cliente e Barbeiro.

    RF02 - GERENCIAR CLIENTE: O sistema deve permitir o registo, edição e consulta de clientes, guardando dados como nome, telefone e e-mail.

    RF03 - REALIZAR AGENDAMENTO (CLIENTE E BARBEIRO): O sistema deve permitir a criação de um agendamento, associando um Cliente, um Barbeiro, um Serviço, uma Data e uma Hora. O cliente pode agendar para si mesmo, enquanto o barbeiro pode criar agendamentos manualmente para qualquer cliente.

    RF04 - VISUALIZAR AGENDAMENTOS (CLIENTE): O sistema deve permitir que o cliente visualize apenas os seus próprios agendamentos (histórico passado e horários futuros), sem a opção de cancelamento autônomo.

    RF05 - GERENCIAR AGENDAMENTOS (BARBEIRO): O sistema deve permitir exclusivamente ao barbeiro que um agendamento existente seja cancelado ou excluído do sistema.

    RF06 - CONSULTAR AGENDA GLOBAL (BARBEIRO): O sistema deve permitir que o barbeiro consulte a lista de todos os agendamentos marcados para uma determinada data, obtendo uma visão completa de horários livres e ocupados.

    RF07 - GERENCIAR DISPONIBILIDADE E BARBEIRO: O sistema deve permitir cadastrar, editar, inativar e consultar os dados dos barbeiros, além da gestão das datas disponíveis para agendamento e dos blocos de horários (início e fim).

    RF08 - GERENCIAR TIPO DE SERVIÇO: O sistema deve permitir a gestão dos serviços oferecidos, incluindo nome, preço e tempo de duração estimado.

2. Requisitos Não-Funcionais (RNF)

    RNF01 - SEGURANÇA E AUTORIZAÇÃO: Para todos os utilizadores do sistema, a senha deve ser criptografada no banco de dados em 100% dos casos. Além disso, a API do backend deve bloquear tentativas de clientes acessarem rotas exclusivas do barbeiro (ex: retornar erro HTTP 403 Forbidden).

    RNF02 - DESEMPENHO: Para todas as ecrãs do sistema, o tempo de resposta deve ser menor ou igual a 2 segundos em 90% dos casos.

    RNF03 - LEGAL / PRIVACIDADE: O sistema deve garantir a privacidade dos dados pessoais dos clientes (como nome, telefone e e-mail) em conformidade com as diretrizes da Lei Geral de Proteção de Dados (LGPD).

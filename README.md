# SaaS Barbearia

Este projeto é um sistema SaaS para agendamento de horários em barbearias, composto por um backend em Spring Boot e um frontend em React + TypeScript. Ele oferece duas visões principais: cliente e barbeiro.

## Visão geral

O sistema permite que:
- clientes se cadastrem, façam login e visualizem seus agendamentos;
- barbeiros gerenciem a agenda, disponibilidade e serviços oferecidos;
- o backend controle autenticação, autorização e persistência de dados;
- o frontend ofereça telas modernas e responsivas para uso em navegadores.

## Funcionalidades principais

### Cliente
- cadastro de conta com nome, email, telefone e senha;
- login seguro com JWT;
- consulta dos próprios agendamentos;
- visualização de histórico e horários futuros;
- recuperação de senha.

### Barbeiro
- painel administrativo para consulta da agenda global;
- criação e cancelamento de agendamentos;
- gerenciamento de disponibilidade por data e horário;
- cadastro e edição de serviços com preço e duração.

## Arquitetura

### Backend
- Spring Boot 4.x
- Spring Security com JWT
- H2 Database em memória
- API REST com controle de permissões para clientes, barbeiros e administradores

### Frontend
- React + TypeScript
- Vite como bundler
- Tailwind CSS e componentes shadcn/ui
- React Router para navegação
- Axios para consumo da API

## Endpoints importantes

- `POST /api/auth/login` — autenticação
- `POST /api/clientes` — cadastro de cliente
- `POST /api/agendamentos` — criar agendamento
- `GET /api/agendamentos/cliente/{id}` — listar agendamentos de cliente
- `GET /api/agendamentos/barbeiro/{id}` — listar agendamentos de barbeiro
- `GET /api/disponibilidades` — listar disponibilidade
- `GET /api/servicos` — listar serviços

## Requisitos atendidos

O projeto atende aos seguintes requisitos principais descritos em `docs/requisitos.md`:
- autenticação e autorização diferenciada entre cliente e barbeiro;
- criptografia de senha e controle de acesso;
- gestão de clientes, barbeiros, serviços, disponibilidade e agendamentos;
- consulta de agenda global para barbeiros;
- conformidade com LGPD no tratamento de dados pessoais.

## Como executar

### Backend
1. Abra um terminal na pasta raiz do projeto.
2. Execute:
   ```cmd
   compile.bat
   ```
3. Se preferir rodar direto a partir do jar já compilado:
   ```cmd
   java -jar target\barberstore-0.0.1-SNAPSHOT.jar
   ```
4. A API ficará disponível em `http://localhost:8080`.

### Frontend
1. Abra outro terminal em `frontend`.
2. Execute:
   ```cmd
   set PATH=C:\Program Files\nodejs;%PATH%
   npm run dev
   ```
3. A interface ficará disponível em `http://localhost:5173`.

### Execução completa
O arquivo `run-all.bat` também foi criado para:
- compilar o backend;
- iniciar o backend;
- iniciar o frontend;
- abrir o navegador em `http://localhost:5173`.

## Observações

- O backend usa H2 em memória, então os dados são reiniciados a cada execução.
- Para acessar a documentação da API, utilize `http://localhost:8080/swagger-ui.html`.
- O projeto está estruturado para suportar separação clara entre frontend e backend.

## Autores

- Luis Henrique Âncores Paiva 
- Ryan Fernandes Ribeiro

# ✂️ SaaS Barbearia

> Plataforma digital de gestão e agendamento para barbearias — desenvolvida como projeto prático da disciplina de **Análise e Projeto de Sistemas I** no curso de Ciência da Computação do **Centro Universitário de João Pessoa (Unipê)**.

---

## 📋 Sobre o Projeto

O **SaaS Barbearia** resolve o problema da desorganização nos agendamentos feitos por WhatsApp, ligações ou agenda física. A plataforma permite que clientes agendem serviços de forma autônoma e que barbeiros/gestores tenham controle total sobre a agenda, serviços e disponibilidade — tudo em um único lugar.

O sistema possui controle de acesso baseado em perfis **(RBAC)**:

| Perfil | Acesso |
|---|---|
| `CLIENTE` | Cadastro, login, visualização de barbeiros e serviços, agendamento, histórico pessoal |
| `BARBEIRO` | Agenda diária, gerenciamento de disponibilidade, bloqueio de horários, serviços prestados |
| `ADMIN` | Visão geral da barbearia, gestão de profissionais, catálogo de serviços e precificação |

---

## 🛠️ Stack Tecnológico

### Backend
| Item | Tecnologia |
|---|---|
| Linguagem | Java 21 |
| Framework | Spring Boot 4.x |
| Segurança | Spring Security + JWT |
| Banco (dev) | H2 Database (em memória) |
| Banco (prod) | PostgreSQL |
| Build | Maven (`mvnw`) |
| Extras | Lombok, Spring Data JPA, Springdoc OpenAPI (Swagger) |

### Frontend
| Item | Tecnologia |
|---|---|
| Linguagem | TypeScript |
| Framework | React 18 |
| Build Tool | Vite 6 |
| Estilização | Tailwind CSS v4, shadcn/ui, Radix UI |
| Animações | Framer Motion |
| Requisições | Axios |
| Formulários | React Hook Form |
| Ícones | Lucide React |
| Runtime | Node.js v22 |
| Pacotes | npm |

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Java 21 instalado
- Node.js v22 instalado
- npm instalado

### 1. Clone o repositório

```bash
git clone https://github.com/luispaivaa/saas-barbearia.git
cd saas-barbearia
```

### 2. Rodando tudo de uma vez (Linux/Ubuntu)

O projeto possui um script que sobe o backend e o frontend automaticamente:

```bash
chmod +x run-all.sh
./run-all.sh
```

> O script executa o `compile.sh` (que força o uso do Java 21), sobe o backend em um terminal, sobe o frontend em outro e abre o navegador automaticamente.

### 3. Rodando manualmente

**Backend:**
```bash
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
./mvnw spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### 4. Acesse no navegador

| Serviço | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger-ui.html |

---

## 🔌 Endpoints da API REST

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/api/auth/login` | Autenticação e geração do token JWT |
| `POST` | `/api/clientes` | Cadastro de novos clientes |
| `POST` | `/api/agendamentos` | Criação de um novo agendamento |
| `GET` | `/api/agendamentos/cliente/{id}` | Histórico e agendamentos futuros do cliente |
| `GET` | `/api/agendamentos/barbeiro/{id}` | Agenda de um barbeiro específico |
| `GET` | `/api/disponibilidades` | Consulta de horários livres em tempo real |
| `GET` | `/api/servicos` | Listagem do catálogo de serviços |

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────┐
│                   Cliente (Browser)                  │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP + JWT
┌──────────────────────▼──────────────────────────────┐
│           Frontend — React 18 + TypeScript           │
│                   Vite 6 · :5173                     │
└──────────────────────┬──────────────────────────────┘
                       │ REST API
┌──────────────────────▼──────────────────────────────┐
│         Backend — Java 21 + Spring Boot 4.x          │
│           Spring Security (JWT) · :8080              │
└──────────────────────┬──────────────────────────────┘
                       │
          ┌────────────┴────────────┐
          │                         │
┌─────────▼────────┐    ┌──────────▼──────────┐
│  H2 (dev)        │    │  PostgreSQL (prod)   │
│  em memória      │    │  dados persistidos   │
└──────────────────┘    └─────────────────────┘
```

---

## 📁 Estrutura do Repositório

```
saas-barbearia/
├── src/                        # Código-fonte do backend (Spring Boot)
│   └── main/java/...
├── frontend/                   # Código-fonte do frontend (React)
│   ├── src/
│   └── package.json
├── docs/                       # Documentação do projeto
│   ├── SaaS_Barbearia_Documentacao.pdf
│   └── umlDiagrams/
│       ├── useCaseDiagram.png
│       ├── classDiagram.png
│       ├── attDiagram.png
│       └── seqDiagram.png
├── compile.sh                  # Script de compilação (força Java 21)
├── run-all.sh                  # Script para subir o ambiente completo
├── pom.xml                     # Dependências Maven
└── README.md
```

---

## 📐 Diagramas UML

O projeto conta com os seguintes artefatos de modelagem, disponíveis na pasta `/docs`:

- **Diagrama de Casos de Uso** — atores e funcionalidades por perfil
- **Diagrama de Classes** — entidades, atributos, métodos e relacionamentos
- **Diagrama de Atividades** — fluxo de controle pós-autenticação (swimlanes)
- **Diagrama de Sequência** — interação detalhada do caso de uso RF03 (Realizar Agendamento)

---

## 👨‍💻 Autores

| Nome | GitHub |
|---|---|
| Luis Henrique Âncores Paiva | [@luispaivaa](https://github.com/luispaivaa) |
| Ryan Fernandes Ribeiro | [@ryan11ribeiro](https://github.com/ryan11ribeiro) |

---

## 🎓 Informações Acadêmicas

- **Instituição:** Centro Universitário de João Pessoa — Unipê
- **Curso:** Ciência da Computação
- **Disciplina:** Análise e Projeto de Sistemas I
- **Professor:** Ricardo Roberto
- **Período:** 4º — 2026

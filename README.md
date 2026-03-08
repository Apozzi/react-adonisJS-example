# Sistema de Comissionamento (React + AdonisJS)

<p align="left">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/AdonisJS-220052?style=for-the-badge&logo=AdonisJS&logoColor=white" alt="AdonisJS" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</p>

Um Sistema de Comissionamento full-stack robusto, moderno, configurado para o desenvolvimento de aplicações web escaláveis. O projeto integra perfeitamente uma API RESTful de alta performance no backend com uma interface de usuário dinâmica e reativa no frontend.

<img width="1882" height="988" alt="Capturar" src="https://github.com/user-attachments/assets/1200903b-e673-4e96-b05d-a84bbcadf6d0" />

## Decisões Arquiteturais e Técnicas

A arquitetura do projeto foi desenhada visando **produtividade na experiência de desenvolvimento (DX)**, **segurança nativa** e **alta performance** na entrega de requisições. O uso de Node.js no backend aliado ao React no ecossistema Vite permite que ambas as camadas compartilhem a robustez do TypeScript.

### Backend (`/backend`)
*   **Framework**: [AdonisJS v7](https://adonisjs.com/) - Escolhido pela sua arquitetura MVC bem definida, injeção de dependências robusta e ecossistema de pacotes nativos que evitam a fadiga de escolha no ecossistema Node.js. O Adonis dita a melhor forma de se construir as rotas, middlewares e controladores.
*   **Banco de Dados & ORM**: PostgreSQL gerenciado através do **Lucid ORM** (nativo do Adonis), oferecendo um Query Builder seguro, sistema de migrações (`migrations`) e preenchimento de dados iniciais regulares (`seeders`).
*   **Autenticação**: Gerenciamento de sessões e autenticação através do `@adonisjs/auth` e políticas rígidas de segurança com `@adonisjs/shield` (proteção CSRF e headers de segurança).
*   **Validação de Dados**: Validadores de input controlados pelo **VineJS**, que possuem uma performance imbatível frente a validadores mais antigos como Joi/Yup.
*   **Runtime**: Node.js >= 24.

  <img width="1788" height="1096" alt="MVC-Flow-Chart" src="https://github.com/user-attachments/assets/d690a61a-6cd6-46b1-bfed-19a5e331e455" />

### Frontend (`/frontend`)
*   **Ecossistema**: React 19 executado em cima do **Vite**, garantindo inicialização do servidor de desenvolvimento quase instantânea e *Hot Module Replacement* (HMR) performático.
*   **Roteamento**: **React Router v7** para controle completo das rotas do lado do cliente e navegação SPA.
*   **Estilização**: **TailwindCSS 4** integrado com a nova Engine nativa no Vite, para composição de interfaces sem necessidade de sair do arquivo TSX. Ícones providenciados pelo *Lucide-react*.
*   **Comunicação com API**: Integração centralizada de serviços usando Fetch API padronizado com tratamento global de erros e gerenciamento de estado assíncrono.
*   **Visualização de Dados**: Gráficos complexos e customizáveis renderizados dinamicamente pelo **Recharts**.

## Funcionalidades Incluídas

O sistema foi desenhado do zero para atender a todas as demandas centrais de uma operação comercial focada em comissionamento, fornecendo cálculos precisos e visibilidade transparente:

✅ **Login e Autenticação Robusta**: Sistema seguro de login (JWT/Session Control) blindando as rotas da aplicação contra acessos indevidos e garantindo consistência na identificação de cada requisição.

✅ **Cadastro de Usuários**: Módulo de gerenciamento de acesso. Permite aos administradores criar, listar, alterar e excluir outros operadores e gerentes da plataforma com flexibilidade e feedback imediato.

✅ **Cadastro de Vendedores**: Registro completo do time de vendas. Cada vendedor possui configurações individuais de regras de comissão que o sistema respeita assincronamente (ex: comissões de valor Percentual vs valor Fixo).

✅ **Registro Automático de Vendas**: Interface ágil para inserção e vínculo de novas vendas aos seus respectivos vendedores e clientes, mantendo o histórico inalterável do fechamento.

✅ **Cálculo Automático de Comissões**: O coração da aplicação. Ao registrar as vendas, o *backend* atua autonomamente aplicando as regras cadastradas — processando a comissão devida ao Vendedor e calculando instantaneamente as margens ou comissões direcionadas ao Gerente.

✅ **Dashboard Interativo & Relatórios Visuais**: Painel de comando focado na experiência do usuário contendo:
- _Cards_ resumidos de Vendas e Comissões acumulativas.
- Listagem em tempo real das vendas mais recentes no sistema.
- Gráficos renderizados via Recharts evidenciando a Evolução de Vendas, Ranking do time comercial e muito mais.

---

## Como Rodar o Projeto

### Pré-requisitos
*   [Docker](https://www.docker.com/) e Docker Compose instalados (Para a Opção A)
*   [Node.js](https://nodejs.org/) v24+ instalado (Para a Opção B)
*   Banco de dados PostgreSQL (caso rode sem o Docker)

### Passo a Passo

Clone este repositório:
```bash
git clone https://github.com/eanderson/react-adonisJS-boilerplate.git
cd react-adonisJS-boilerplate
```

#### Opção A: Rodar via Docker (Recomendado 🌟)

Esta abordagem irá levantar todos os serviços (Frontend, Backend e o PostgreSQL) de uma vez só. O script contido inicializa a API e roda as migrações/seeds automaticamente.

Dentro da raiz do projeto, apenas execute:
```bash
docker compose up --build
```
> Após a criação dos containeres, o banco de dados levará alguns segundos para iniciar e o backend logo em seguida executará as migrações (criando as tabelas) e populando dados (`node ace db:seed`).

- **Frontend**: Acessível em `http://localhost:5173`
- **Backend API**: Acessível em `http://localhost:3333`

#### Opção B: Ambiente Dev Local (Manual)

Se preferir rodar usando seu próprio banco ou instalando as dependências via Node nativamente em seu SO:

**1. Preparando o Backend:**
```bash
cd backend
npm install
```
Gere a chave de criptografia da aplicação e ajuste os dados do seu PostgreSQL no arquivo `.env`:
```bash
node ace generate:key
```
Execute as migrações para criar as estruturas das tabelas e alimente o banco inicial:
```bash
node ace migration:run
node ace db:seed
```
Por fim, inicie o servidor da API:
```bash
npm run dev
# O Backend rodará em http://localhost:3333
```

**2. Preparando o Frontend:**
Em uma nova aba do seu terminal, volte e entre no diretório do frontend:
```bash
cd frontend
npm install
npm run dev
# O Frontend rodará em http://localhost:5173
```

## Testes Automatizados:
A aplicação backend possoui testes funcionais,
Para rodá-los:
```bash
cd backend
node ace test
```
---


## Swagger
Para acessar a documentação da API:
```
http://localhost:3333/docs
```
---

<img width="1516" height="965" alt="Capturar2" src="https://github.com/user-attachments/assets/1b612da0-6b17-4690-bc24-bffc94c5c6c5" />


## 📁 Estrutura do Projeto

```text
react-adonisJS-boilerplate/
├── backend/                       # API e Lógica de Negócios (AdonisJS)
│   ├── app/
│   │   ├── controllers/           # Controladores das requisições HTTP
│   │   ├── exceptions/            # Tratamento de exceções personalizadas (Exception Handler)
│   │   ├── middleware/            # Interceptadores (Log, Auth, Validação)
│   │   ├── models/                # Modelos ORM (Lucid)
│   │   ├── services/              # Lógica de negócios centralizada e reutilizável
│   │   ├── transformers/          # Formatação e transformação de dados de resposta
│   │   └── validators/            # Esquemas de validação de dados (VineJS)
│   ├── config/                    # Configurações globais (CORS, Banco, Sessões)
│   ├── database/                  
│   │   ├── migrations/            # Versionamento de schema do banco
│   │   └── seeders/               # Dados fictícios/iniciais do banco
│   ├── start/                     # Arquivos críticos de boot (Routes.ts, Env.ts)
│   ├── tests/                     # Testes (Japa Framework)
│   ├── package.json
│   └── Dockerfile                 # Contêiner Dev do node:24 para a API
│
├── frontend/                      # Aplicação Client Side (React)
│   ├── src/
│   │   ├── components/            # Componentes visuais UI/UX (Botões, Modais, Inputs)
│   │   ├── context/               # Gerenciadores de Estado Globais (Context API)
│   │   ├── hooks/                 # Custom React Hooks (Ex: useAsync)
│   │   ├── pages/                 # Telas principais (Login, Dashboard, Usuários)
│   │   ├── services/              # Integrações externas e chamadas HTTP via api client
│   │   ├── utils/                 # Funções auxiliares (Formatadores)
│   │   └── App.tsx                # Gateway de entrada e injetor de roteamento
│   ├── package.json
│   ├── vite.config.ts             # Configuração do Bundler/Server (Tailwind + React)
│   └── Dockerfile                 # Contêiner Dev para o ecossistema vite
│
├── docker-compose.yml             # Orquestrador dos 3 serviços: Web, Api e DB
└── README.md
```

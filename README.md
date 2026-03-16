# 💼 Desafio Técnico Dev Fullstack - Solução

Esta é a solução para o desafio técnico Fullstack (NestJS + NextJS). 

## 🚀 Tecnologias Utilizadas

**Backend:**
- NestJS (Framework)
- Fastify (Web Server)
- Drizzle ORM (Banco de Dados)
- SQLite (Banco Relacional)
- Passport & JWT (Autenticação)
- Swagger (Documentação API)

**Frontend:**
- Next.js (App Router)
- React Hook Form & Zod (Formulários e Validação)
- Tailwind CSS v4 (Estilização Moderna e Responsiva)
- Axios (Cliente HTTP)
- Lucide React (Ícones)
- JS Cookie (Persistência de Sessão)

---

## ⚙️ Como Instalar e Executar

Siga os passos abaixo para rodar o projeto localmente:

### 1. Backend (API)
Navegue até a pasta `api`:
```bash
cd api
```

Instale as dependências:
```bash
npm install
```

O banco de dados SQLite será criado automaticamente. Inicie o servidor em modo de desenvolvimento:
```bash
npm run start:dev
```
A API estará rodando em `http://localhost:3001`. A documentação **Swagger** pode ser acessada em `http://localhost:3001/swagger`.

### 2. Frontend (UI)
Abra um novo terminal e navegue até a pasta `ui`:
```bash
cd ui
```

Instale as dependências:
```bash
npm install
```

Inicie o servidor frontend:
```bash
npm run dev
```
O Frontend estará rodando em `http://localhost:3000`.

---

## 🛠️ Decisões Arquiteturais
- **Backend**: Utilizei o padrão `Package by Feature` nativo do NestJS (separando as funcionalidades por módulos como Auth, Users, Categories, Transactions). O Drizzle ORM foi configurado visando simplicidade com um banco SQLite local (`sqlite.db`).
- **Frontend**: O Contexto de Autenticação (`useAuth`) foi implementado utilizando Cookies (`js-cookie`) e Interceptors no Axios para garantir um fluxo de segurança robusto. A interface foi construída usando *glassmorphism*, gradientes vibrantes e temas escuros (Dark Mode by default) focando na fluidez da experiência do usuário (UX).

## 🗄️ Estrutura do Banco
Utilizamos Drizzle ORM com SQLite. O schema reside em `api/src/database/schema.ts` definindo as tabelas `users`, `categories`, e `transactions` corretamente relacionadas via chaves estrangeiras.

> O banco de dados foi gerado usando o comando `npx drizzle-kit push` para garantir a versão atual do schema.

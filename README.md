# 💼 Desafio Técnico Dev Fullstack - Solução

Esta é a solução para o desafio técnico Fullstack (NestJS + NextJS).

## 🚀 Tecnologias Utilizadas

**Backend:**

- NestJS (Framework)
- Fastify (Web Server)
- Drizzle ORM (Banco de Dados)
- SQLite (Banco Relacional) (Turso no deploy)
- Passport & JWT (Autenticação)
- Swagger (Documentação API)

**Frontend:**

- Next.js (App Router)
- React Hook Form & Zod (Formulários e Validação)
- Tailwind CSS v4 e Shadcn
- Axios (Cliente HTTP)
- Lucide React (Ícones)

---

## ⚙️ Como Instalar e Executar

Siga os passos abaixo para rodar o projeto localmente:

Instale as dependências:

```bash
bun i
#or
npm i
```

Para subir o banco de dados apenas de o seguinte commando:

```bash
bun db:push
#or
npm run db:push
```

A API estará rodando em `http://localhost:3001`. A documentação **Swagger** pode ser acessada em `http://localhost:3001/swagger`.

O Frontend estará rodando em `http://localhost:3000`.

---

## 🛠️ Decisões Arquiteturais

- **Backend**: Utilizei o padrão `Package by Feature` nativo do NestJS (separando as funcionalidades por módulos como Auth, Users, Categories, Transactions). O Drizzle ORM foi configurado visando simplicidade com um banco SQLite local (`sqlite.db`) or Turso em prod.

## 🗄️ Estrutura do Banco

Utilizamos Drizzle ORM com SQLite. O schema reside em `api/src/database/schema.ts` definindo as tabelas `users`, `categories`, `sessions`, e `transactions` corretamente relacionadas via chaves estrangeiras.

> O banco de dados foi gerado usando o comando `npx drizzle-kit push` para garantir a versão atual do schema.

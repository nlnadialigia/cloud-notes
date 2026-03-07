# Arquitetura da Aplicação - AWS Study Project

[![en](https://img.shields.io/badge/lang-en-red.svg)](../README.md)

## 1. Objetivo do Projeto

Este projeto tem como objetivo criar uma aplicação fullstack completa para estudo da AWS utilizando tecnologias modernas do ecossistema JavaScript.

A aplicação permitirá aprender:

- Deploy de aplicações na AWS
- Integração com banco SQL (RDS)
- Integração com banco NoSQL (DynamoDB)
- CI/CD automatizado
- Estruturação de aplicações escaláveis
- Arquitetura moderna fullstack

A aplicação será um **Gerenciador de Tarefas (Task Manager)**.

---

# 2. Stack Tecnológica

## Backend

- Node.js
- NestJS
- Prisma ORM
- PostgreSQL (AWS RDS)
- DynamoDB
- JWT Authentication
- bcrypt
- Swagger

## Frontend

- Next.js (App Router)
- TailwindCSS - paleta rose
- shadcn/ui
- Lucide Icons
- TanStack Query

## Infraestrutura AWS

- AWS RDS (PostgreSQL)
- AWS DynamoDB
- AWS S3
- AWS CloudFront
- AWS EC2 ou ECS
- AWS CloudWatch
- AWS IAM

## CI/CD

- GitHub
- GitHub Actions

---

# 3. Descrição da Aplicação

A aplicação será um **Task Manager** onde usuários podem:

- Criar conta
- Fazer login
- Criar tarefas
- Listar tarefas
- Atualizar tarefas
- Excluir tarefas
- Marcar tarefas como concluídas

Cada tarefa pertence a um usuário autenticado.

---

# 4. Arquitetura de Alto Nível

Fluxo da aplicação:

```
Usuário
  |
  v
Next.js Frontend
  |
  v
API NestJS
  |
  +----> RDS (PostgreSQL)
  |
  +----> DynamoDB
```

Arquivos estáticos do frontend serão hospedados em:

```
S3 + CloudFront
```

Backend rodará em:

```
EC2 ou ECS
```

---

# 5. Organização do Repositório

Estrutura recomendada:

```
task-manager-aws

backend/
frontend/
infra/
docs/
```

---

# 6. Estrutura do Backend (NestJS)

```
backend/src

├── modules
│
│   ├── auth
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   └── jwt.strategy.ts
│   │
│   ├── users
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   │
│   ├── tasks
│   │   ├── tasks.controller.ts
│   │   ├── tasks.service.ts
│   │   ├── tasks.repository.ts
│   │   └── tasks.module.ts
│
├── prisma
│   └── prisma.service.ts
│
├── dynamo
│   └── dynamo.service.ts
│
├── common
│   ├── guards
│   ├── decorators
│   └── dto
│
└── main.ts
```

---

# 7. Estrutura do Frontend (Next.js)

Utilizando **App Router**.

```
frontend/src

app/
│
├── login
│   └── page.tsx
│
├── register
│   └── page.tsx
│
├── dashboard
│   └── page.tsx
│
├── layout.tsx
└── page.tsx

components/

├── ui (shadcn)
├── task
│   ├── task-card.tsx
│   ├── task-form.tsx
│   └── task-list.tsx
│
└── layout
    └── sidebar.tsx

services/

├── api.ts
└── auth.ts

hooks/

├── useTasks.ts
└── useAuth.ts
```

---

# 8. Design System

Interface construída com:

- TailwindCSS
- shadcn/ui
- Lucide Icons

---

# 9. Gerenciamento de Estado

Será utilizado:

**TanStack Query**

Responsável por:

- cache de requisições
- sincronização com backend
- refetch automático
- loading states

Exemplo de uso:

```
useQuery({
  queryKey: ['tasks'],
  queryFn: fetchTasks
})
```

---

# 10. Modelo de Dados

## Banco SQL - PostgreSQL (RDS)

Tabela: `users`

Campos:

```
id UUID
name TEXT
email TEXT UNIQUE
password_hash TEXT
created_at TIMESTAMP
```

Prisma schema exemplo:

```
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
}
```

---

## Banco NoSQL - DynamoDB

Tabela: `tasks`

Partition Key:

```
user_id
```

Sort Key:

```
task_id
```

Campos:

```
task_id
user_id
title
description
status
created_at
```

Status possíveis:

```
pending
completed
```

---

# 11. Fluxo de Autenticação

Registro:

1. Usuário envia dados
2. Backend valida
3. Senha é criptografada com bcrypt
4. Usuário salvo no RDS

Login:

1. Backend valida credenciais
2. JWT é gerado
3. Token retornado ao frontend

Requisições protegidas utilizam:

```
Authorization: Bearer TOKEN
```

NestJS utiliza:

```
AuthGuard
```

---

# 12. Fluxo de Tarefas

Criar tarefa:

```
POST /tasks
```

Backend salva tarefa no DynamoDB.

Listar tarefas:

```
GET /tasks
```

Consulta pelo `user_id`.

Atualizar tarefa:

```
PATCH /tasks/:id
```

Excluir tarefa:

```
DELETE /tasks/:id
```

---

# 13. Deploy

Frontend:

```
Next build
→ upload para S3
→ distribuição via CloudFront
```

Backend:

```
Docker container
→ deploy em EC2 ou ECS
```

---

# 14. CI/CD

Pipeline via **GitHub Actions**.

Fluxo:

```
git push
   |
GitHub Actions
   |
build
   |
test
   |
deploy AWS
```

Backend:

```
build docker
push ECR
deploy ECS
```

Frontend:

```
build next
deploy S3
invalidate CloudFront
```

---

# 15. Monitoramento

Logs enviados para:

```
AWS CloudWatch
```

Permite:

- monitorar erros
- acompanhar execução
- visualizar logs de containers

---

# 16. Segurança

Boas práticas aplicadas:

- bcrypt para senhas
- JWT authentication
- variáveis em secrets
- HTTPS via CloudFront
- IAM com permissões mínimas

---

# 17. Objetivos de Aprendizado

Com este projeto será possível aprender:

Frontend

- Next.js
- TanStack Query
- shadcn
- Tailwind

Backend

- NestJS
- Prisma
- JWT
- Arquitetura modular

AWS

- S3
- CloudFront
- EC2 ou ECS
- RDS
- DynamoDB
- CloudWatch
- IAM
- CI/CD

---

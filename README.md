# Atividade: BD Gerenciado (Primário/Replica)

Grupo:
Bruno Algarte
Cristian Nascimento
Eduardo Vilas Boas
Rafael Silva


Este projeto demonstra:
- **INSERT** no **host primário** (write)
- **10 SELECTs individuais** na **réplica** (read) a cada ciclo
- Alternativa via **API (Express)** com rotas `POST /produtos` (write) e `GET /produto/:id` (read)

## 1) Pré-requisitos
- Node.js 18+
- Acesso a um MySQL gerenciado com **dois endpoints**: primário (write) e réplica (read)
- Credenciais (usuário e senha) fornecidas pelo professor

## 2) Instalação
```bash
npm install
```

## 3) Configuração
Copie `.env.example` para `.env` e preencha com as credenciais/hosts reais.

## 4) Criação do schema
Rode o conteúdo de `sql/schema.sql` **no host primário** (write).

## 5) Loop (INSERT + SELECTs)
```bash
npm run start:loop
```
- Faz 1 INSERT no primário por ciclo
- Em seguida faz 10 SELECTs (id-1..id-10) na réplica

## 6) API (opcional)
```bash
npm run start:api
```
- `POST /produtos` body JSON: `{ "descricao": "Geladeira X", "categoria": "eletro", "valor": 1999.90 }`
- `GET /produto/30` lê o produto de id 30 **na réplica**

## Dicas
- Em provedores cloud, a replicação pode levar alguns ms/s. Por isso existe um `await sleep(200)` antes dos SELECTs.
- Se o provedor exigir SSL, ative `DB_SSL=true` no `.env` e, se necessário, aponte `DB_SSL_CA` para o certificado.
- Se receber erro de autenticação, confirme usuário/senha/host e se o **firewall** da instância permite o seu IP.

---

© 2025-11-06
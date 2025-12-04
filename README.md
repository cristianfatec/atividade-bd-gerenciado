# 🗄️ Banco de Dados Gerenciado — Atividade 01 (FATEC)

Este repositório contém a implementação da **Atividade 01 – Banco de Dados Gerenciado**, desenvolvida para a disciplina **Computação em Nuvem 2** do curso de **Desenvolvimento de Software Multiplataforma (DSM)** da **FATEC**.

O objetivo da atividade é demonstrar o uso de um ambiente MySQL com **replicação**, utilizando dois hosts distintos:

- **Host primário (WRITE)** → responsável pelas operações de escrita (INSERT)
- **Host réplica (READ)** → responsável pelas operações de leitura (SELECT)

A aplicação insere registros periódicos na tabela `produto` e, após cada inserção, realiza múltiplos SELECTs direcionados à réplica, simulando o funcionamento de um sistema distribuído com **consistência eventual**.

---

## 👥 Integrantes do Grupo

- **Bruno Algarte**  
- **Cristian Nascimento**  
- **Eduardo Vilas Boas**  
- **Rafael Silva**

---

## 🎯 Propósito da Atividade

- Compreender o funcionamento de **bancos de dados gerenciados**  
- Aplicar o conceito de **replicação MySQL** separando leitura e escrita  
- Observar o comportamento de **consistência eventual** entre primário e réplica  
- Desenvolver uma aplicação que executa inserções e leituras distribuídas  

---

## 📌 Tecnologias Utilizadas

- MySQL (primário + réplica)  
- Linguagem definida pelo grupo (Node.js, Python, C#, etc.)  
- Git e GitHub para versionamento  

---

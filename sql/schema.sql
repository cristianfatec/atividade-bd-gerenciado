-- sql/schema.sql

-- Crie o database caso não exista e selecione-o
CREATE DATABASE IF NOT EXISTS `aula-db`;
USE `aula-db`;

-- Tabela de exemplo pedida no enunciado
CREATE TABLE IF NOT EXISTS produto (
  id INT AUTO_INCREMENT,
  descricao VARCHAR(50) NOT NULL,
  categoria VARCHAR(10) NOT NULL,
  valor NUMERIC(15,2) NOT NULL,
  criado_em DATETIME DEFAULT NOW(),
  criado_por VARCHAR(20) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (descricao, criado_por)
);
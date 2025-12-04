// server.js
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const fs = require('fs');

const app = express();
app.use(express.json());

const {
  DB_NAME, DB_USER, DB_PASS,
  DB_HOST_WRITE, DB_HOST_READ,
  DB_PORT, DB_SSL, DB_SSL_CA,
  GRUPO
} = process.env;

// SSL options 
let ssl;
if (DB_SSL === 'true') {
  ssl = DB_SSL_CA
    ? { ca: fs.readFileSync(DB_SSL_CA) }
    : { minVersion: 'TLSv1.2', rejectUnauthorized: true };
}

const poolWrite = mysql.createPool({
  host: DB_HOST_WRITE,
  port: DB_PORT ? Number(DB_PORT) : 3306,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  ssl
});

const poolRead = mysql.createPool({
  host: DB_HOST_READ,
  port: DB_PORT ? Number(DB_PORT) : 3306,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  ssl
});

// POST /produtos -> escreve no primário
app.post('/produtos', async (req, res) => {
  try {
    const { descricao, categoria, valor } = req.body;
    if (!descricao || !categoria || valor == null) {
      return res.status(400).json({ error: 'descricao, categoria, valor são obrigatórios' });
    }
    const [result] = await poolWrite.execute(
      `INSERT INTO produto (descricao, categoria, valor, criado_por) VALUES (?, ?, ?, ?)`,
      [descricao, categoria, valor, GRUPO || 'Grupo']
    );
    const id = result.insertId;
    res.status(201).json({ id, descricao, categoria, valor, criado_por: GRUPO || 'Grupo' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /produto/:id -> lê na réplica
app.get('/produto/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [rows] = await poolRead.execute(
      `SELECT id, descricao, categoria, valor, criado_em, criado_por FROM produto WHERE id = ?`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API ON :${PORT}`));
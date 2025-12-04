// app.js
require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');

const {
  DB_NAME, DB_USER, DB_PASS,
  DB_HOST_WRITE, DB_HOST_READ,
  DB_PORT, DB_SSL, DB_SSL_CA,
  GRUPO
} = process.env;

// SSL 
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
  waitForConnections: true,
  connectionLimit: 5,
  ssl
});

const poolRead = mysql.createPool({
  host: DB_HOST_READ,
  port: DB_PORT ? Number(DB_PORT) : 3306,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  ssl
});

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

function gerarProduto(seq) {
  return {
    descricao: `Produto-${seq}-${Date.now()}`,
    categoria: ['eletro', 'moveis', 'info', 'diversos'][seq % 4],
    valor: (Math.random() * 1000 + 1).toFixed(2),
    criado_por: GRUPO || 'Grupo'
  };
}

async function inserirProduto(prod) {
  const sql = `
    INSERT INTO produto (descricao, categoria, valor, criado_por)
    VALUES (?, ?, ?, ?)
  `;
  const params = [prod.descricao, prod.categoria, prod.valor, prod.criado_por];
  const [result] = await poolWrite.execute(sql, params);
  return result.insertId;
}

async function selecionarPorId(id) {
  const sql = `SELECT id, descricao, categoria, valor, criado_em, criado_por FROM produto WHERE id = ?`;
  const [rows] = await poolRead.execute(sql, [id]);
  return rows[0] || null;
}

async function main() {
  console.log('Iniciando loop: INSERT no primário e 10 SELECTs na réplica…');

  let seq = 1;
  while (true) {
    try {
      const produto = gerarProduto(seq);

      // 1) INSERT no primário
      const insertId = await inserirProduto(produto);
      console.log(`INSERT OK -> id=${insertId} | ${produto.descricao} | ${produto.categoria} | R$ ${produto.valor} | criado_por=${produto.criado_por}`);

      // 2) Aguarde um pouquinho para a replicação 
      await sleep(200);

      // 3) 10 SELECTs individuais na réplica: id-1 até id-10
      const limite = Math.max(1, insertId - 10);
      for (let id = insertId - 1; id >= limite; id--) {
        const row = await selecionarPorId(id);
        if (row) {
          console.log(`SELECT OK [replica] id=${row.id} | ${row.descricao} | ${row.categoria} | R$ ${row.valor} | ${row.criado_em} | ${row.criado_por}`);
        } else {
          console.log(`SELECT vazio [replica] id=${id}`);
        }
      }

      seq++;
      await sleep(1000); // intervalo entre ciclos (1s)

    } catch (err) {
      console.error('Erro no ciclo:', err?.message ?? err);
      await sleep(2000);
    }
  }
}

process.on('SIGINT', async () => {
  console.log('\nEncerrando…');
  await poolWrite.end().catch(() => {});
  await poolRead.end().catch(() => {});
  process.exit(0);
});

main();
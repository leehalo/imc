const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Db = require('./js/Db');
const app = express();
const port = 3000; // Port fix corrected

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname)));

// Rota para página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para criar um novo registro (Create)
app.post('/salvar', async (req, res) => {
    const { nome, peso, altura, imc, classificacao } = req.body;
    let conn;

    try {
        conn = await Db.connect();

        const query = 'INSERT INTO imc_table (nome, peso, altura, imc, classificacao) VALUES (?, ?, ?, ?, ?)';
        await conn.query(query, [nome, peso, altura, imc, classificacao]);
        res.send('Dados salvos com sucesso');
    } catch (err) {
        res.status(500).send('Erro ao salvar os dados no banco de dados');
        console.log(err);
    } finally {
        if (conn) conn.end();
    }
});

// Rota para listar todos os registros (Read)
app.get('/registros', async (req, res) => {
    let conn;
    try {
        conn = await Db.connect();
        const rows = await conn.query('SELECT * FROM imc_table');
        res.json(rows);
    } catch (err) {
        res.status(500).send('Erro ao listar os registros');
        console.log(err);
    } finally {
        if (conn) conn.end();
    }
});

// Rota para atualizar um registro (Update)
app.put('/atualizar/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, peso, altura, imc, classificacao } = req.body;
    let conn;

    try {
        conn = await Db.connect();

        const query = 'UPDATE imc_table SET nome = ?, peso = ?, altura = ?, imc = ?, classificacao = ? WHERE id = ?';
        await conn.query(query, [nome, peso, altura, imc, classificacao, id]);
        res.send('Registro atualizado com sucesso');
    } catch (err) {
        res.status(500).send('Erro ao atualizar o registro');
        console.log(err);
    } finally {
        if (conn) conn.end();
    }
});

// Rota para excluir um registro (Delete)
app.delete('/excluir/:id', async (req, res) => {
    const { id } = req.params;
    let conn;

    try {
        conn = await Db.connect();
        const query = 'DELETE FROM imc_table WHERE id = ?';
        await conn.query(query, [id]);
        res.send('Registro excluído com sucesso');
    } catch (err) {
        res.status(500).send('Erro ao excluir o registro');
        console.log(err);
    } finally {
        if (conn) conn.end();
    }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

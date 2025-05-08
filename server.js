// ROTAS PARA RECEITAS.HTML -----------------------------------------------
app.get('/api/receitas', (req, res) => {
  const query = 'SELECT * FROM receitas';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar receitas:', err);
      res.status(500).send('Erro ao buscar receitas');
    } else {
      res.json(results);
    }
  });
});

// Rota para buscar uma receita específica por ID
app.get('/api/receitas/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM receitas WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar receita:', err);
            res.status(500).send('Erro ao buscar receita');
        } else if (results.length === 0) {
            res.status(404).json({ message: 'Receita não encontrada.' });
        } else {
            res.json(results[0]);
        }
    });
});

app.post('/api/receitas', upload.single('imagem'), (req, res) => {
    const { titulo, categoria, descricao, ingredientes } = req.body;
    const imagem = req.file ? `/uploads/${req.file.filename}` : '/images/default-recipe.jpg';
  
    const query = 'INSERT INTO receitas (titulo, categoria, imagem, descricao, ingredientes) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [titulo, categoria, imagem, descricao || '', ingredientes || ''], (err) => {
      if (err) {
        console.error('Erro ao adicionar receita:', err);
        res.status(500).json({ message: 'Erro ao adicionar receita: ' + err.message });
      } else {
        res.json({ message: 'Receita adicionada com sucesso!' });
      }
    });
  });

  app.put('/api/receitas/:id', upload.single('imagem'), (req, res) => {
    const { id } = req.params;
    const { titulo, categoria, descricao, ingredientes } = req.body;
    const imagem = req.file ? `/uploads/${req.file.filename}` : null;
  
    const query = imagem
      ? 'UPDATE receitas SET titulo = ?, categoria = ?, descricao = ?, ingredientes = ?, imagem = ? WHERE id = ?'
      : 'UPDATE receitas SET titulo = ?, categoria = ?, descricao = ?, ingredientes = ? WHERE id = ?';
  
    const params = imagem
      ? [titulo, categoria, descricao, ingredientes, imagem, id]
      : [titulo, categoria, descricao, ingredientes, id];
  
    db.query(query, params, (err, results) => {
      if (err) {
        console.error('Erro ao atualizar receita:', err);
        res.status(500).send('Erro ao atualizar receita');
      } else if (results.affectedRows === 0) {
        res.status(404).json({ message: 'Receita não encontrada.' });
      } else {
        res.json({ message: 'Receita atualizada com sucesso!' });
      }
    });
  });

app.delete('/api/receitas/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM receitas WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) {
      console.error('Erro ao remover receita:', err);
      res.status(500).send('Erro ao remover receita');
    } else {
      res.json({ message: 'Receita removida com sucesso!' });
    }
  });
});

// FIM DE ROTAS PARA RECEITAS.HTML -----------------------------------------------

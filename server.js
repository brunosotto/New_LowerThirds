const express = require('express');
const { WebSocketServer } = require('ws');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'panels.json');

// Garantir que o diretório data existe
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// API: obter dados dos painéis (JSON)
app.get('/api/settings', (req, res) => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      res.json(JSON.parse(data));
    } else {
      res.json(null);
    }
  } catch (e) {
    console.error('[API] Erro ao ler settings:', e);
    res.status(500).json({ error: 'Erro ao ler dados' });
  }
});

// API: salvar dados dos painéis (JSON)
app.post('/api/settings', (req, res) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2), 'utf8');
    res.json({ ok: true });
  } catch (e) {
    console.error('[API] Erro ao salvar settings:', e);
    res.status(500).json({ error: 'Erro ao salvar dados' });
  }
});

// Rotas para as páginas
app.get('/panel', (req, res) => {
  res.sendFile(path.join(__dirname, 'obs_control_panel.html'));
});

app.get('/source', (req, res) => {
  res.sendFile(path.join(__dirname, 'obs_lower_thirds_source.html'));
});

// Iniciar servidor HTTP
const server = app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`  Panel:  http://localhost:${PORT}/panel`);
  console.log(`  Source: http://localhost:${PORT}/source`);
});

// WebSocket Server - relay entre panel e source
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws, req) => {
  const clientType = req.url?.includes('source') ? 'source' : 'panel';
  console.log(`[WS] Cliente conectado (${clientType})`);

  ws.on('message', (data) => {
    try {
      const msg = data.toString();
      // Broadcast para todos os outros clientes (relay)
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === 1) {
          client.send(msg);
        }
      });
    } catch (e) {
      console.error('[WS] Erro ao processar mensagem:', e);
    }
  });

  ws.on('close', () => {
    console.log(`[WS] Cliente desconectado (${clientType})`);
  });

  ws.on('error', (err) => {
    console.error('[WS] Erro:', err.message);
  });
});

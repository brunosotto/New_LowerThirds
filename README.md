# OBS Lower Thirds System

Sistema profissional de Lower Thirds para transmissões, baseado em navegador, com painel de controle dinâmico e comunicação em tempo real via WebSocket.

## Como subir o projeto

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar o servidor
npm start
```

O servidor sobe em **http://localhost:3000**. Acesse:

- **Panel (controle):** http://localhost:3000/panel  
- **Source (OBS):** http://localhost:3000/source  

> **Acesso remoto:** O painel de controle pode ser acessado de outro dispositivo na mesma rede. Basta usar o IP do servidor: `http://IP_DO_SERVIDOR:3000/panel` (ex.: `http://192.168.1.100:3000/panel`).

---

## Funcionalidades

### Comunicação e persistência
- **WebSocket:** comunicação em tempo real entre painel e source via servidor Node
- **Persistência no servidor:** dados salvos em `data/panels.json` (JSON)
- **Fallback para localStorage:** se o servidor não estiver disponível, usa armazenamento local
- **Salvamento ao clicar Show/Hide:** dados gravados imediatamente
- **Feedback visual:** toasts indicando salvamento e carregamento

### Lower thirds
- **Painéis dinâmicos:** adicionar ou remover painéis conforme necessário
- **11 animações:** Slide, Bounce, Fade, Swing, Flip, Elastic, Zoom, Rotate, Wave, Glitch, Curtain, Scroll
- **Typewriter:** efeito de digitação no texto
- **Timer automático:** duração configurável por painel

### Logos
- **Suporte a logos:** arquivos locais (Browse) ou URLs
- **Posição:** esquerda ou direita
- **Tamanho ajustável:** controle de tamanho do logo
- **Logo sem caixa:** opção para exibir o logo sem background, borda ou separador

### Tipografia e cores
- **Fontes:** Montserrat, Poppins, Roboto, Open Sans, Lato, Oswald, Raleway, etc.
- **Tamanhos:** tamanhos independentes para nome e título
- **Cores:** cores personalizadas para nome e título

### Estilo visual
- **Backgrounds:** gradientes, cores sólidas, transparente ou customizado
- **Transparência:** controle de opacidade
- **Configurações globais:** aplicar estilo a todos os painéis de uma vez

### Auto Sequence
- Sequência automática entre lower thirds com intervalo configurável

---

## Configuração no OBS

### 1. Adicionar o Source
1. Abra o OBS Studio
2. Adicione uma nova fonte **Browser**
3. Nome: "Lower Thirds"
4. **Desmarque** "Local file"
5. URL: `http://localhost:3000/source`
6. Largura: 1920 | Altura: 1080
7. Deixe "Custom CSS" vazio
8. Clique em OK

### 2. Painel de controle (opcional)
1. No OBS: View > Docks > Custom Browser Docks...
2. Nome: Lower Thirds Control
3. URL: `http://localhost:3000/panel`
4. Clique em Apply e posicione o dock onde preferir

> **Importante:** o servidor precisa estar rodando (`npm start`) para o painel e o source funcionarem.

---

## Estrutura do projeto

```
New_LowerThirds/
├── server.js              # Servidor Node/Express + WebSocket
├── obs_control_panel.html  # Painel de controle
├── obs_lower_thirds_source.html  # Source para OBS
├── data/
│   └── panels.json        # Dados persistidos (criado automaticamente)
├── package.json
└── README.md
```

---

## API

- `GET /api/settings` — retorna os dados dos painéis (JSON)
- `POST /api/settings` — salva os dados dos painéis (JSON)
- `WS /ws` — WebSocket para relay entre panel e source

---

Happy Streaming!

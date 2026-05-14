# IA Studio - Projeto I DWFE

SPA em React para interação com um motor de IA, criada para o Projeto I de Desenvolvimento Web Front-End.

## Funcionalidades

- Layout com header, footer e menu.
- Landing page.
- Alternância de tema claro/escuro.
- Login e registo simulados em memória de sessão.
- Página principal com prompt, seleção de modelo e comunicação assíncrona com API.
- Fallback local quando não existe chave de API configurada.
- Histórico das pesquisas da sessão.
- Dashboard com número de pedidos, erros, tempo médio, tempo mínimo/máximo e utilização por modelo.
- Roteamento dinâmico no cliente com `react-router-dom`.

## Como executar

```bash
npm install
npm run dev
```

Para usar a API real da Hugging Face com Qwen, cria um ficheiro `.env` com base em `.env.example`:

```bash
HF_TOKEN=coloca_o_token_aqui
HF_MODEL=Qwen/Qwen2.5-72B-Instruct
```

Depois executa:

```bash
npm run build
npm start
```

Sem token, a aplicação continua funcional com respostas simuladas para permitir avaliação da interface, histórico e dashboard.

## Arquitetura

- `src/context/AppContext.jsx`: estado global de tema, autenticação, histórico e métricas.
- `src/services/ai.js`: chamada assíncrona ao backend local.
- `server.js`: backend local com endpoint `/api/chat`, integração Hugging Face/Qwen e tratamento de erros.
- `src/pages`: páginas principais da SPA.
- `src/components`: componentes reutilizáveis de layout e estatísticas.
- `src/styles.css`: sistema visual responsivo com variáveis de tema.

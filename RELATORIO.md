# Relatório - Projeto I DWFE

## Problema e domínio

O projeto consiste numa interface web para interação com um motor de inteligência artificial. A aplicação permite ao utilizador autenticar-se, escrever prompts, selecionar um modelo de IA, consultar respostas, rever o histórico da sessão e acompanhar métricas de utilização.

## Solução desenvolvida

A solução chama-se **IA Studio** e foi implementada como uma SPA em React. O conteúdo muda dinamicamente sem recarregamento completo da página, usando rotas no lado do cliente. A aplicação tem tema claro/escuro, navegação persistente, validação simples de formulários, tratamento de erros de API e atualização imediata do histórico e dashboard.

## Arquitetura

A arquitetura separa interface, estado e comunicação externa:

- `components`: elementos reutilizáveis como header, footer e cartões de estatísticas.
- `pages`: páginas da aplicação, incluindo landing page, autenticação, assistente, histórico e dashboard.
- `context`: estado partilhado através de hooks React.
- `services`: lógica de comunicação com API de IA.

O estado é guardado em memória durante a sessão, cumprindo o requisito de persistência apenas até encerramento ou recarregamento do browser.

## Escolhas técnicas

Foi usado React com Vite pela rapidez de desenvolvimento e organização simples. A navegação usa `react-router-dom`, permitindo roteamento dinâmico no cliente. O tema é aplicado com variáveis CSS para garantir consistência nos vários componentes. A comunicação com IA está isolada em `src/services/ai.js`, o que facilita trocar o fornecedor ou modelo no futuro.

## Utilização

1. Instalar dependências com `npm install`.
2. Executar com `npm run dev`.
3. Entrar ou criar conta na página de autenticação.
4. Aceder ao assistente, escrever um prompt e escolher o modelo.
5. Consultar o histórico e o dashboard após os pedidos.

## API e tratamento de erros

A aplicação usa `fetch` para comunicar com um backend local em `/api/chat`. Esse backend chama a API Hugging Face Inference Providers através do endpoint compatível com OpenAI Chat Completions, usando o modelo `Qwen/Qwen2.5-72B-Instruct`. Quando `HF_TOKEN` não está configurado, é usada uma resposta simulada, mantendo a aplicação demonstrável. Erros de rede, respostas inválidas e códigos HTTP de falha são capturados e apresentados ao utilizador.

## Cronologia de desenvolvimento

- Leitura do enunciado e identificação dos requisitos funcionais e não funcionais.
- Criação da estrutura React/Vite.
- Implementação de autenticação, rotas e estado global.
- Implementação do assistente de IA, histórico e dashboard.
- Aplicação de UI responsiva com tema claro/escuro.
- Documentação da arquitetura e modo de utilização.

import http from 'node:http';
import { readFileSync, statSync } from 'node:fs';
import { createReadStream, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');
const hfEndpoint = 'https://router.huggingface.co/v1/chat/completions';
const defaultModel = 'Qwen/Qwen2.5-72B-Instruct';
const port = Number(process.env.PORT || 5173);

function loadLocalEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!existsSync(envPath)) return;

  const lines = readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const index = trimmed.indexOf('=');
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    value = value.replace(/^["']|["']$/g, '');
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadLocalEnv();

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
};

function fallbackAnswer(prompt, model) {
  return [
    `Resposta simulada pelo modelo ${model}.`,
    `Pedido analisado: "${prompt}".`,
    'O servidor esta ligado, mas HF_TOKEN nao esta configurado no ficheiro .env.',
  ].join('\n\n');
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

async function handleChat(req, res) {
  try {
    const { prompt, model } = await readJson(req);
    const selectedModel = model || process.env.HF_MODEL || defaultModel;

    if (!prompt || prompt.trim().length < 2) {
      return sendJson(res, 400, { error: 'Escreve um prompt antes de enviar.' });
    }

    if (!process.env.HF_TOKEN) {
      return sendJson(res, 200, {
        answer: fallbackAnswer(prompt, selectedModel),
        model: selectedModel,
        source: 'simulacao',
      });
    }

    const response = await fetch(hfEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          {
            role: 'system',
            content: 'Responde em portugues europeu, de forma clara e objetiva.',
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 400,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      return sendJson(res, response.status, {
        error: `Falha na API Hugging Face (${response.status}): ${details.slice(0, 220)}`,
      });
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      return sendJson(res, 502, { error: 'A API devolveu uma resposta sem conteudo valido.' });
    }

    return sendJson(res, 200, {
      answer,
      model: selectedModel,
      source: 'huggingface-qwen',
    });
  } catch (error) {
    return sendJson(res, 500, { error: error.message });
  }
}

async function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const safePath = path.normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '');
  let filePath = path.join(distDir, safePath === '/' ? 'index.html' : safePath);

  if (!filePath.startsWith(distDir)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  if (!existsSync(filePath)) {
    filePath = path.join(distDir, 'index.html');
  } else if (statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
    if (!existsSync(filePath)) {
      filePath = path.join(distDir, 'index.html');
    }
  }

  const ext = path.extname(filePath);
  res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'application/octet-stream' });
  createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === 'POST' && req.url === '/api/chat') {
    return handleChat(req, res);
  }

  return serveStatic(req, res);
});

if (!existsSync(path.join(distDir, 'index.html'))) {
  console.warn('Pasta dist nao encontrada. Executa "npm run build" antes de "npm start".');
}

server.listen(port, () => {
  console.log(`IA Studio online em http://localhost:${port}`);
});

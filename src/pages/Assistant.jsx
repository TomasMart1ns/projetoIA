import React from 'react';
import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import Icon from '../components/Icon.jsx';
import { askAI } from '../services/ai.js';

const models = ['Qwen/Qwen2.5-72B-Instruct', 'Qwen/Qwen2.5-32B-Instruct', 'Qwen/Qwen2.5-7B-Instruct'];

export default function Assistant() {
  const { addHistory, recordMetric, user } = useApp();
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState(models[0]);
  const [result, setResult] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const canSubmit = useMemo(() => prompt.trim().length >= 5 && status !== 'loading', [prompt, status]);

  async function submit(event) {
    event.preventDefault();
    if (!canSubmit) return;

    const started = performance.now();
    setStatus('loading');
    setError('');
    setResult('');

    try {
      const response = await askAI({ prompt, model });
      const latency = Math.round(performance.now() - started);
      setResult(response.answer);
      recordMetric({ latency, ok: true });
      addHistory({
        prompt,
        answer: response.answer,
        model: response.model,
        source: response.source,
        latency,
        user: user.email,
      });
      setStatus('success');
    } catch (requestError) {
      const latency = Math.round(performance.now() - started);
      recordMetric({ latency, ok: false });
      setError(requestError.message);
      setStatus('error');
    }
  }

  return (
    <section className="workspace">
      <div className="section-heading">
        <p className="eyebrow">Assistente</p>
        <h1>Interação com motor de IA</h1>
      </div>

      <form className="prompt-panel" onSubmit={submit}>
        <label>
          Modelo
          <select value={model} onChange={(event) => setModel(event.target.value)}>
            {models.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          Prompt
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Escreve uma pergunta ou tarefa para a IA..."
            rows="8"
          />
        </label>

        <button className="primary-action" type="submit" disabled={!canSubmit}>
          {status === 'loading' ? <Icon name="wand" /> : <Icon name="send" />}
          {status === 'loading' ? 'A gerar...' : 'Enviar'}
        </button>
      </form>

      <article className="result-panel">
        <h2>Resultado</h2>
        {error && <p className="error">{error}</p>}
        {!error && result && <pre>{result}</pre>}
        {!error && !result && <p className="muted">O resultado da IA aparece aqui depois do envio.</p>}
      </article>
    </section>
  );
}

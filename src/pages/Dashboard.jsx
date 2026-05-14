import React from 'react';
import StatCard from '../components/StatCard.jsx';
import { useApp } from '../context/AppContext.jsx';

function formatMs(value) {
  if (value === null || Number.isNaN(value)) return '0 ms';
  return `${Math.round(value)} ms`;
}

export default function Dashboard() {
  const { metrics, history } = useApp();
  const average = metrics.requests > 0 ? metrics.totalLatency / metrics.requests : 0;
  const successRate = metrics.requests > 0 ? Math.round(((metrics.requests - metrics.failures) / metrics.requests) * 100) : 0;
  const modelUsage = history.reduce((acc, item) => {
    acc[item.model] = (acc[item.model] || 0) + 1;
    return acc;
  }, {});

  return (
    <section className="workspace">
      <div className="section-heading">
        <p className="eyebrow">Dashboard</p>
        <h1>Utilização da API</h1>
      </div>

      <div className="stats-grid">
        <StatCard label="Pedidos" value={metrics.requests} accent="#2f80ed" />
        <StatCard label="Tempo médio" value={formatMs(average)} accent="#00a676" />
        <StatCard label="Erros" value={metrics.failures} accent="#e45858" />
        <StatCard label="Sucesso" value={`${successRate}%`} accent="#f2a541" />
      </div>

      <div className="dashboard-grid">
        <article className="panel">
          <h2>Tempos de resposta</h2>
          <dl className="metric-list">
            <div>
              <dt>Mais rápido</dt>
              <dd>{formatMs(metrics.fastest)}</dd>
            </div>
            <div>
              <dt>Mais lento</dt>
              <dd>{formatMs(metrics.slowest)}</dd>
            </div>
            <div>
              <dt>Total acumulado</dt>
              <dd>{formatMs(metrics.totalLatency)}</dd>
            </div>
          </dl>
        </article>

        <article className="panel">
          <h2>Modelos utilizados</h2>
          {Object.keys(modelUsage).length === 0 && <p className="muted">Sem dados suficientes.</p>}
          {Object.entries(modelUsage).map(([model, count]) => (
            <div className="usage-row" key={model}>
              <span>{model}</span>
              <strong>{count}</strong>
            </div>
          ))}
        </article>
      </div>
    </section>
  );
}

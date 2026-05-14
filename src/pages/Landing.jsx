import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';

export default function Landing() {
  return (
    <section className="landing">
      <div className="landing-copy">
        <p className="eyebrow">Projeto I · Interface web com IA</p>
        <h1>IA Studio</h1>
        <p>
          Uma aplicação SPA para conversar com um modelo de inteligência artificial, acompanhar pesquisas e
          analisar métricas de utilização em tempo real.
        </p>
        <Link className="primary-action" to="/entrar">
          Começar <Icon name="arrowRight" />
        </Link>
      </div>

      <div className="feature-grid" aria-label="Funcionalidades principais">
        <article>
          <Icon name="sparkles" />
          <h2>Prompt inteligente</h2>
          <p>Seleciona o modelo, envia pedidos e recebe resultados dinâmicos.</p>
        </article>
        <article>
          <Icon name="history" />
          <h2>Histórico</h2>
          <p>Consulta todas as pesquisas realizadas durante a sessão.</p>
        </article>
        <article>
          <Icon name="gauge" />
          <h2>Métricas</h2>
          <p>Vê pedidos, erros e tempos médios de carregamento da API.</p>
        </article>
      </div>
    </section>
  );
}

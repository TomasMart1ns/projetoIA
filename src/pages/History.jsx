import { useApp } from "../context/AppContext.jsx";
import Icon from "../components/Icon.jsx";

export default function History() {
  const { history, clearHistory } = useApp();

  return (
    <section className="workspace">
      <div className="section-heading row">
        <div>
          <p className="eyebrow">Histórico</p>
          <h1>Pesquisas da sessão</h1>
        </div>
        <button
          className="secondary-action"
          type="button"
          onClick={clearHistory}
          disabled={history.length === 0}
        >
          <Icon name="trash" /> Limpar
        </button>
      </div>

      <div className="history-list">
        {history.length === 0 && (
          <p className="muted">Ainda não existem pesquisas registadas.</p>
        )}
        {history.map((item) => (
          <article className="history-card" key={item.id}>
            <div className="history-meta">
              <span>{new Date(item.createdAt).toLocaleString("pt-PT")}</span>
              <span>{item.model}</span>
              <span>{item.latency} ms</span>
              <span>{item.source}</span>
            </div>
            <h2>{item.prompt}</h2>
            <p>{item.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

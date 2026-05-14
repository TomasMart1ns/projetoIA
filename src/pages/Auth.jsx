import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import Icon from "../components/Icon.jsx";

export default function Auth() {
  const { user, login, register } = useApp();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  if (user) {
    return <Navigate to="/assistente" replace />;
  }

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  function submit(event) {
    event.preventDefault();
    setError("");

    if (!form.email.includes("@") || form.password.length < 4) {
      setError(
        "Indica um email válido e uma password com pelo menos 4 caracteres.",
      );
      return;
    }

    if (mode === "register" && form.name.trim().length < 2) {
      setError("Indica o teu nome para concluir o registo.");
      return;
    }

    try {
      if (mode === "register") {
        register(form);
      } else {
        login(form);
      }
    } catch (authError) {
      setError(authError.message);
    }
  }

  return (
    <section className="auth-layout">
      <div>
        <p className="eyebrow">Área reservada</p>
        <h1>{mode === "login" ? "Entrar na aplicação" : "Criar conta"}</h1>
        <p>
          O acesso permite guardar o histórico e associar as métricas de
          utilização à sessão atual.
        </p>
      </div>

      <form className="panel form-panel" onSubmit={submit}>
        <div className="segmented">
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            <Icon name="login" /> Login
          </button>
          <button
            type="button"
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
          >
            <Icon name="userPlus" /> Registo
          </button>
        </div>

        {mode === "register" && (
          <label>
            Nome
            <input
              name="name"
              value={form.name}
              onChange={updateField}
              placeholder="O teu nome"
            />
          </label>
        )}
        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={updateField}
            placeholder="nome@email.pt"
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={updateField}
            placeholder="mínimo 4 caracteres"
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button className="primary-action full" type="submit">
          {mode === "login" ? "Entrar" : "Registar"}
        </button>
      </form>
    </section>
  );
}

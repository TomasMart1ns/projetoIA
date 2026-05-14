import { createContext, useContext, useMemo, useState } from "react";

const AppContext = createContext(null);

const initialMetrics = {
  requests: 0,
  failures: 0,
  totalLatency: 0,
  fastest: null,
  slowest: null,
};

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function loadAccounts() {
  try {
    return JSON.parse(localStorage.getItem("ia-studio-accounts")) || [];
  } catch {
    return [];
  }
}

function saveAccounts(accounts) {
  localStorage.setItem("ia-studio-accounts", JSON.stringify(accounts));
}

export function AppProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState(loadAccounts);
  const [history, setHistory] = useState([]);
  const [metrics, setMetrics] = useState(initialMetrics);

  function register(profile) {
    const email = normalizeEmail(profile.email);

    if (accounts.some((account) => account.email === email)) {
      throw new Error(
        "Este email ja esta registado. Faz login ou usa outro email.",
      );
    }

    const nextAccount = {
      name: profile.name.trim(),
      email,
      password: profile.password,
      createdAt: new Date().toISOString(),
    };
    const nextAccounts = [...accounts, nextAccount];

    setAccounts(nextAccounts);
    saveAccounts(nextAccounts);

    const nextUser = {
      name: nextAccount.name,
      email: nextAccount.email,
      createdAt: nextAccount.createdAt,
    };
    setUser(nextUser);
    return nextUser;
  }

  function login(profile) {
    const email = normalizeEmail(profile.email);
    const account = accounts.find((item) => item.email === email);

    if (!account) {
      throw new Error("Conta nao encontrada. Regista-te antes de fazer login.");
    }

    if (account.password !== profile.password) {
      throw new Error("Password incorreta.");
    }

    const nextUser = {
      name: account.name,
      email: account.email,
      createdAt: account.createdAt,
    };
    setUser(nextUser);
    return nextUser;
  }

  function logout() {
    setUser(null);
  }

  function toggleTheme() {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  }

  function addHistory(item) {
    setHistory((current) => [
      { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...item },
      ...current,
    ]);
  }

  function clearHistory() {
    setHistory([]);
  }

  function recordMetric({ latency, ok }) {
    setMetrics((current) => ({
      requests: current.requests + 1,
      failures: ok ? current.failures : current.failures + 1,
      totalLatency: current.totalLatency + latency,
      fastest:
        current.fastest === null ? latency : Math.min(current.fastest, latency),
      slowest:
        current.slowest === null ? latency : Math.max(current.slowest, latency),
    }));
  }

  const value = useMemo(
    () => ({
      theme,
      user,
      accounts,
      history,
      metrics,
      register,
      login,
      logout,
      toggleTheme,
      addHistory,
      clearHistory,
      recordMetric,
    }),
    [theme, user, accounts, history, metrics],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp deve ser usado dentro de AppProvider");
  }
  return context;
}

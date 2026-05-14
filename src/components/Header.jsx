import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import Icon from './Icon.jsx';

export default function Header() {
  const { theme, toggleTheme, user, logout } = useApp();

  return (
    <header className="site-header">
      <Link className="brand" to="/">
        <Icon name="bot" />
        <span>IA Studio</span>
      </Link>

      <nav className="nav" aria-label="Menu principal">
        <NavLink to="/">Início</NavLink>
        {user && <NavLink to="/assistente">Assistente</NavLink>}
        {user && <NavLink to="/historico">Histórico</NavLink>}
        {user && <NavLink to="/dashboard">Dashboard</NavLink>}
        {!user && <NavLink to="/entrar">Entrar</NavLink>}
      </nav>

      <div className="header-actions">
        <button className="icon-button" type="button" onClick={toggleTheme} aria-label="Alternar tema">
          {theme === 'light' ? <Icon name="moon" /> : <Icon name="sun" />}
        </button>
        {user && (
          <button className="icon-button" type="button" onClick={logout} aria-label="Terminar sessão">
            <Icon name="logout" />
          </button>
        )}
      </div>
    </header>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import '../assets/css/LoginPage.css';

/* ── SVG Icons (inline, no dependency) ─────────────────────────── */

const IconBuilding = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="1" />
    <path d="M9 22V12h6v10M2 22h20M12 2v4" />
    <rect x="8" y="6" width="2" height="2" />
    <rect x="14" y="6" width="2" height="2" />
    <rect x="8" y="11" width="2" height="2" />
    <rect x="14" y="11" width="2" height="2" />
  </svg>
);

const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="11" width="14" height="11" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    <circle cx="12" cy="16" r="1" fill="currentColor" />
  </svg>
);

const IconEye = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconEyeOff = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const IconArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconHelp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const IconGlobe = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

/* ── Component ──────────────────────────────────────────────────── */

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Identifiants incorrects');
      }

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('userNom', data.nom);
      localStorage.setItem('userPrenom', data.prenom);

      if (data.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/prof/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* ── Panneau gauche ── */}
      <aside className="login-left">

        <p className="left-badge">Institution d'Excellence</p>

        <div className="left-content">
          <h1 className="left-title">
            Institut<br />
            Polytechnique<br />
            privé des<br />
            Sciences<br />
            Avancées<br />
            de Sfax
          </h1>
        </div>

        {/* Watermark logo */}
        <div className="watermark-logo" aria-hidden="true">
          <span className="wm-top">Polytechnique</span>
          <span className="wm-sub">DES SCIENCES AVANCÉES</span>
          <span className="wm-sfax">SFAX</span>
        </div>

        <footer className="left-footer">
          <div className="left-accent-line" />
          <span className="left-copyright">© 2026 Portail Académique</span>
        </footer>

      </aside>

      {/* ── Panneau droit ── */}
      <main className="login-right">
        <div className="login-card">

          {/* Icône institution */}
          <div className="card-icon">
            <IconBuilding />
          </div>

          <h2 className="card-title">Authentification</h2>

          <form className="login-form" onSubmit={handleSubmit} noValidate>

            {/* Identifiant */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Nom d'utilisateur ou email
              </label>
              <div className="input-wrapper">
                <span className="input-icon"><IconUser /></span>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="identifiant@ipsas.tn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Mot de passe
              </label>
              <div className="input-wrapper">
                <span className="input-icon"><IconLock /></span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="eye-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="form-options">
              <label className="checkbox-label" htmlFor="remember">
                <input
                  id="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Rester connecté
              </label>
              <a href="#forgot" className="forgot-link">
                Mot de passe oublié ?
              </a>
            </div>

            {/* Affichage de l'erreur */}
            {error && (
              <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center', background: '#fef2f2', padding: '0.5rem', borderRadius: '6px' }}>
                {error}
              </div>
            )}

            {/* Bouton submit */}
            <button type="submit" className="btn-submit" id="btn-login" disabled={loading}>
              {loading ? 'Connexion...' : 'Se Connecter'}
              <IconArrowRight />
            </button>

          </form>

          {/* Pied de carte */}
          <div className="card-footer">
            <span className="footer-notice">Accès réservé au personnel de l'Institut</span>
            <div className="footer-icons">
              <button className="footer-icon-btn" aria-label="Aide" title="Aide">
                <IconHelp />
              </button>
              <button className="footer-icon-btn" aria-label="Langue" title="Changer de langue">
                <IconGlobe />
              </button>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
}

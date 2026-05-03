import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import '../../assets/css/admin/GestionUtilisateursPage.css';

/* ── Icônes ─────────────────────────────────────────────── */
const Ico = {
  Search:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Bell:     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  User:     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Plus:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Filter:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  X:        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Trash:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Check:    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  ChevronLeft: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  ChevronRight: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
};

/* ─── Modal d'ajout utilisateur ──────────────────────────── */
function AddUserModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({ nom: '', prenom: '', login: '', mot_de_passe: '', role: 'professeur' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nom.trim() || !formData.prenom.trim() || !formData.login.trim() || !formData.mot_de_passe.trim()) return;
    onAdd(formData);
  };

  return (
    <div className="gu-modal-overlay" onClick={onClose}>
      <div className="gu-modal" onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
          <h3 className="gu-modal-title" style={{ margin:0 }}>Nouvel Utilisateur</h3>
          <button onClick={onClose} style={{ border:'none', background:'none', cursor:'pointer', color:'#9ca3af', display:'flex' }}>{Ico.X}</button>
        </div>
        <form className="gu-modal-form" onSubmit={handleSubmit}>
          <div className="gu-modal-row">
            <div className="gu-modal-field">
              <label className="gu-modal-label">Nom</label>
              <input name="nom" required className="gu-modal-input" placeholder="Ex: Ben Salah" value={formData.nom} onChange={handleChange} />
            </div>
            <div className="gu-modal-field">
              <label className="gu-modal-label">Prénom</label>
              <input name="prenom" required className="gu-modal-input" placeholder="Ex: Ali" value={formData.prenom} onChange={handleChange} />
            </div>
          </div>
          <div className="gu-modal-field">
            <label className="gu-modal-label">Login (Identifiant)</label>
            <input name="login" required className="gu-modal-input" placeholder="Ex: ali.bensalah" value={formData.login} onChange={handleChange} />
          </div>
          <div className="gu-modal-row">
            <div className="gu-modal-field">
              <label className="gu-modal-label">Mot de passe</label>
              <input name="mot_de_passe" type="password" required className="gu-modal-input" placeholder="••••••••" value={formData.mot_de_passe} onChange={handleChange} />
            </div>
            <div className="gu-modal-field">
              <label className="gu-modal-label">Rôle</label>
              <select name="role" className="gu-modal-select" value={formData.role} onChange={handleChange}>
                <option value="professeur">Professeur</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>
          </div>
          <div className="gu-modal-btns">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-modal-submit">Créer l'utilisateur</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Composant Principal ────────────────────────────────── */
export default function GestionUtilisateursPage({ activePage, onNavigate, onLogout }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fireToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/utilisateurs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = search.trim()
    ? users.filter(u => 
        (u.nom || '').toLowerCase().includes(search.toLowerCase()) || 
        (u.prenom || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.login || '').toLowerCase().includes(search.toLowerCase())
      )
    : users;

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handleAddUser = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = data.role === 'admin' ? '/utilisateurs/admin' : '/utilisateurs/professeur';
      const res = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        fetchUsers();
        setShowModal(false);
        fireToast(`✅ Utilisateur ajouté avec succès`);
      } else {
        const errData = await res.json();
        fireToast(`❌ Erreur: ${errData.detail || "Erreur"}`);
      }
    } catch (err) { fireToast(`❌ Erreur de connexion`); }
  };

  const handleDelete = async (id, nom, prenom) => {
    if (window.confirm(`Supprimer ${prenom} ${nom} ?`)) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://127.0.0.1:8000/utilisateurs/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) { fetchUsers(); fireToast(`🗑️ Utilisateur supprimé`); }
      } catch (err) { fireToast(`❌ Erreur de connexion`); }
    }
  };

  return (
    <div className="gu-page-container" style={{display:'flex', flexDirection:'column', width:'100%'}}>
      <div className="gu-content">
        {/* Top bar */}
        <div className="gu-topbar">
          <div className="topbar-search-wrap">
            <span className="topbar-search-icon">{Ico.Search}</span>
            <input className="topbar-search" placeholder="Rechercher un utilisateur..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="topbar-actions">
            <button className="topbar-icon-btn" title="Notifications">{Ico.Bell}<span className="notif-dot" /></button>
            <button className="topbar-icon-btn" title="Profil">{Ico.User}</button>
          </div>
        </div>

        {/* Main content */}
        <div className="gu-main">
          
          {/* Breadcrumb */}
          <div className="gu-breadcrumb">
            <span>Administration</span>
            {Ico.ChevronRight}
            <span className="crumb-active">Gestion des Utilisateurs</span>
          </div>

          {/* Header */}
          <div className="gu-header">
            <div>
              <h1 className="gu-page-title">Gestion des Utilisateurs</h1>
              <p className="gu-page-subtitle">
                Administration centrale des comptes et des permissions.
                Gérez les accès professeurs et administrateurs de la plateforme IPSAS.
              </p>
            </div>
            <button className="btn-add-user" onClick={() => setShowModal(true)}>
              {Ico.Plus} Nouvel utilisateur
            </button>
          </div>

          {/* Table Card */}
          <div>
            <div className="gu-section-header">
              <h2 className="gu-section-title">Comptes actifs ({filtered.length})</h2>
            </div>

            <div className="gu-table-card">
              <table className="gu-table">
                <thead>
                  <tr>
                    <th>Utilisateur</th>
                    <th>Identifiant (Login)</th>
                    <th>Rôle</th>
                    <th style={{ textAlign:'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ padding:'2rem', textAlign:'center', color:'#9ca3af', fontSize:'0.88rem' }}>
                        Aucun utilisateur trouvé
                      </td>
                    </tr>
                  )}
                  {paginated.map((u, idx) => (
                    <tr key={u.id || u.login || idx}>
                      <td>
                        <div className="user-id-cell">
                          <div className="user-avatar-icon">{(u.prenom || ' ')[0]}{(u.nom || ' ')[0]}</div>
                          <span className="user-name-text">{u.prenom} {u.nom}</span>
                        </div>
                      </td>
                      <td style={{ fontFamily:'monospace', fontSize:'0.85rem', color:'#6b7280' }}>{u.login}</td>
                      <td>
                        <span className={`role-badge ${u.role}`}>
                          <span className="dot" />
                          {u.role === 'admin' ? 'Admin' : 'Professeur'}
                        </span>
                      </td>
                      <td style={{ textAlign:'right' }}>
                        <div style={{ display:'flex', justifyContent:'flex-end', gap:'0.5rem' }}>
                          <button className="btn-table-icon" onClick={() => handleDelete(u.id, u.nom, u.prenom)} title="Supprimer">
                            {Ico.Trash}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="gu-table-footer">
                  <span className="gu-table-info">
                    Affichage de <b>{startIndex + 1}</b> à <b>{Math.min(startIndex + itemsPerPage, filtered.length)}</b> sur <b>{filtered.length}</b> utilisateurs
                  </span>
                  <div className="gu-pag-btns">
                    <button className="gu-pag-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>{Ico.ChevronLeft}</button>
                    {Array.from({length:totalPages}, (_,i) => (
                      <button key={i+1}
                        className={`gu-pag-btn ${currentPage === i + 1 ? 'active' : ''}`}
                        onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                    ))}
                    <button className="gu-pag-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>{Ico.ChevronRight}</button>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>

      {showModal && <AddUserModal onClose={() => setShowModal(false)} onAdd={handleAddUser} />}
      {toast && <div className="gu-toast">{Ico.Check}{toast}</div>}
    </div>
  </div>
);
}

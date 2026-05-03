import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import '../../assets/css/admin/GestionSeancesPage.css';

/* ─── Icônes ─────────────────────────────────────────────── */
const Ico = {
  Search:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Bell:     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  User:     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Plus:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Filter:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  X:        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Clock:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Trash:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Edit:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Check:    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  ChevronRight: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
};

/* ─── Modal de modification séance ─────────────────────── */
function EditSeanceModal({ seance, onClose, onUpdate }) {
  const [heure_debut, setHeureDebut] = useState(seance?.heure_debut || '');
  const [heure_fin,   setHeureFin]   = useState(seance?.heure_fin   || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!heure_debut || !heure_fin) return;
    onUpdate({ id: seance.id, heure_debut, heure_fin });
  };

  return (
    <div className="gs-modal-overlay" onClick={onClose}>
      <div className="gs-modal" onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
          <h3 className="gs-modal-title" style={{ margin:0 }}>Modifier la Séance {seance?.id}</h3>
          <button onClick={onClose} style={{ border:'none', background:'none', cursor:'pointer', color:'#9ca3af', display:'flex' }}>{Ico.X}</button>
        </div>
        <form className="gs-modal-form" onSubmit={handleSubmit}>
          <div className="gs-modal-row">
            <div className="gs-modal-field">
              <label className="gs-modal-label">Heure de début</label>
              <input type="time" required className="gs-modal-input" value={heure_debut} onChange={e => setHeureDebut(e.target.value)} />
            </div>
            <div className="gs-modal-field">
              <label className="gs-modal-label">Heure de fin</label>
              <input type="time" required className="gs-modal-input" value={heure_fin} onChange={e => setHeureFin(e.target.value)} />
            </div>
          </div>
          <div className="gs-modal-btns">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-modal-submit">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Composant Principal ────────────────────────────────── */
export default function GestionSeancesPage({ activePage, onNavigate, onLogout }) {
  const [seances, setSeances] = useState([]);
  const [search, setSearch] = useState('');
  const [editingSeance, setEditingSeance] = useState(null);
  const [toast, setToast] = useState('');

  const fireToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchSeances = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/seances`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSeances(Array.isArray(data) ? data : []);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchSeances();
  }, []);

  const sortedSeances = [...seances].sort((a, b) => (a.heure_debut || '').localeCompare(b.heure_debut || ''));
  const filtered = search.trim()
    ? sortedSeances.filter(s => (s.id || '').toLowerCase().includes(search.toLowerCase()))
    : sortedSeances;

  const handleUpdateSeance = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const payload = {
        id: data.id,
        heure_debut: data.heure_debut.length === 5 ? `${data.heure_debut}:00` : data.heure_debut,
        heure_fin: data.heure_fin.length === 5 ? `${data.heure_fin}:00` : data.heure_fin
      };
      const res = await fetch(`${API_BASE_URL}/seances/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchSeances();
        setEditingSeance(null);
        fireToast(`✅ Séance mise à jour`);
      } else {
        const errData = await res.json();
        fireToast(`❌ Erreur: ${errData.detail || "Erreur"}`);
      }
    } catch (err) { fireToast(`❌ Erreur de connexion`); }
  };



  return (
    <div className="gs-page-container" style={{display:'flex', flexDirection:'column', width:'100%'}}>
      <div className="gs-content">
        {/* Top bar */}
        <div className="gs-topbar">
          <div className="topbar-search-wrap">
            <span className="topbar-search-icon">{Ico.Search}</span>
            <input className="topbar-search" placeholder="Rechercher une séance..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="topbar-actions">
            <button className="topbar-icon-btn">{Ico.Bell}</button>
            <button className="topbar-icon-btn">{Ico.User}</button>
          </div>
        </div>

        {/* Main content */}
        <div className="gs-main">
          
          {/* Breadcrumb */}
          <div className="gs-breadcrumb">
            <span>Administration</span>
            {Ico.ChevronRight}
            <span className="crumb-active">Gestion des Séances</span>
          </div>

          {/* Header */}
          <div className="gs-header">
            <div>
              <h1 className="gs-page-title">Gestion des Séances</h1>
              <p className="gs-page-subtitle">Configurez les créneaux horaires standards de l'établissement.</p>
            </div>
          </div>

          {/* Table Card */}
          <div>
            <div className="gs-section-header">
              <h2 className="gs-section-title">Créneaux horaires ({filtered.length})</h2>
            </div>

            <div className="gs-table-card">
              <table className="gs-table">
                <thead>
                  <tr>
                    <th>Identifiant</th>
                    <th>Début</th>
                    <th>Fin</th>
                    <th style={{ textAlign:'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ padding:'2rem', textAlign:'center', color:'#9ca3af', fontSize:'0.88rem' }}>
                        Aucune séance configurée
                      </td>
                    </tr>
                  )}
                  {filtered.map((s, idx) => (
                    <tr key={s.id || idx}>
                      <td>
                        <div className="seance-id-cell">
                          <div className="seance-icon-box">🕒</div>
                          <span className="seance-id-text">{s.id}</span>
                        </div>
                      </td>
                      <td><span className="time-badge">{s.heure_debut}</span></td>
                      <td><span className="time-badge">{s.heure_fin}</span></td>
                      <td style={{ textAlign:'right' }}>
                        <div style={{ display:'flex', justifyContent:'flex-end', gap:'0.5rem' }}>
                          <button className="btn-table-icon" onClick={() => setEditingSeance(s)} title="Modifier">
                            {Ico.Edit}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      {editingSeance && <EditSeanceModal seance={editingSeance} onClose={() => setEditingSeance(null)} onUpdate={handleUpdateSeance} />}
      {toast && <div className="gs-toast">{Ico.Check}{toast}</div>}
    </div>
  </div>
);
}

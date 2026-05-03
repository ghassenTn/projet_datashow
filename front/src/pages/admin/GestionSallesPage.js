import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import '../../assets/css/admin/GestionSallesPage.css';

/* ─── Icônes ─────────────────────────────────────────────── */
const Ico = {
  Search:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Bell:     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  User:     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Plus:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Filter:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  X:        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Building: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22V12h6v10M2 22h20"/><rect x="8" y="6" width="2" height="2"/><rect x="14" y="6" width="2" height="2"/><rect x="8" y="11" width="2" height="2"/><rect x="14" y="11" width="2" height="2"/></svg>,
  Trash:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Check:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Cross:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  ChevronRight: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
};

/* ─── Modal d'ajout salle ────────────────────────────────── */
function AddSalleModal({ onClose, onAdd }) {
  const [numero, setNumero] = useState('');
  const [equipee_tv, setEquipeeTv] = useState(false);
  const [equipee_datashow, setEquipeeDatashow] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!numero.trim()) return;
    onAdd({ numero: numero.trim(), equipee_tv, equipee_datashow });
  };

  return (
    <div className="gsa-modal-overlay" onClick={onClose}>
      <div className="gsa-modal" onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
          <h3 className="gsa-modal-title" style={{ margin:0 }}>Nouvelle Salle</h3>
          <button onClick={onClose} style={{ border:'none', background:'none', cursor:'pointer', color:'#9ca3af', display:'flex' }}>{Ico.X}</button>
        </div>
        <form className="gsa-modal-form" onSubmit={handleSubmit}>
          <div className="gsa-modal-field">
            <label className="gsa-modal-label">Numéro/Nom de la salle</label>
            <input required className="gsa-modal-input" placeholder="Ex: Salle A11, Amphi 1..." value={numero} onChange={e => setNumero(e.target.value)} />
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.8rem' }}>
            <label className="gsa-modal-label">Équipements</label>
            <label className="modal-check-wrap">
              <input type="checkbox" className="modal-check-input" checked={equipee_tv} onChange={e => setEquipeeTv(e.target.checked)} />
              <span className="modal-check-label">Équipée TV</span>
            </label>
            <label className="modal-check-wrap">
              <input type="checkbox" className="modal-check-input" checked={equipee_datashow} onChange={e => setEquipeeDatashow(e.target.checked)} />
              <span className="modal-check-label">Équipée Data Show</span>
            </label>
          </div>
          <div className="gsa-modal-btns">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-modal-submit">Créer la salle</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Composant Principal ────────────────────────────────── */
export default function GestionSallesPage({ activePage, onNavigate, onLogout }) {
  const [salles, setSalles] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState('');

  const fireToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchSalles = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/salles`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSalles(Array.isArray(data) ? data : []);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchSalles();
  }, []);

  const filtered = search.trim()
    ? salles.filter(s => (s.numero || '').toLowerCase().includes(search.toLowerCase()))
    : salles;

  const handleAddSalle = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/salles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        fetchSalles();
        setShowModal(false);
        fireToast(`✅ Salle "${data.numero}" ajoutée`);
      } else {
        const errData = await res.json();
        fireToast(`❌ Erreur: ${errData.detail || "Erreur"}`);
      }
    } catch (err) { fireToast(`❌ Erreur de connexion`); }
  };

  const handleDelete = async (numero) => {
    if (window.confirm(`Supprimer la salle "${numero}" ?`)) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/salles/${numero}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) { fetchSalles(); fireToast(`🗑️ Salle supprimée`); }
      } catch (err) { fireToast(`❌ Erreur de connexion`); }
    }
  };

  return (
    <div className="gsa-page-container" style={{display:'flex', flexDirection:'column', width:'100%'}}>
      <div className="gsa-content">
        {/* Top bar */}
        <div className="gsa-topbar">
          <div className="topbar-search-wrap">
            <span className="topbar-search-icon">{Ico.Search}</span>
            <input className="topbar-search" placeholder="Rechercher une salle..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="topbar-actions">
            <button className="topbar-icon-btn">{Ico.Bell}</button>
            <button className="topbar-icon-btn">{Ico.User}</button>
          </div>
        </div>

        {/* Main content */}
        <div className="gsa-main">
          
          {/* Breadcrumb */}
          <div className="gsa-breadcrumb">
            <span>Administration</span>
            {Ico.ChevronRight}
            <span className="crumb-active">Gestion des Salles</span>
          </div>

          {/* Header */}
          <div className="gsa-header">
            <div>
              <h1 className="gsa-page-title">Gestion des Salles</h1>
              <p className="gsa-page-subtitle">Administration des locaux et de leurs équipements audiovisuels.</p>
            </div>
            <button className="btn-add-salle" onClick={() => setShowModal(true)}>
              {Ico.Plus} Nouvelle salle
            </button>
          </div>

          {/* Table Card */}
          <div>
            <div className="gsa-section-header">
              <h2 className="gsa-section-title">Salles enregistrées ({filtered.length})</h2>
            </div>

            <div className="gsa-table-card">
              <table className="gsa-table">
                <thead>
                  <tr>
                    <th>Local</th>
                    <th>Équipée TV</th>
                    <th>Équipée Data Show</th>
                    <th style={{ textAlign:'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ padding:'2rem', textAlign:'center', color:'#9ca3af', fontSize:'0.88rem' }}>
                        Aucune salle trouvée
                      </td>
                    </tr>
                  )}
                  {filtered.map((s, idx) => (
                    <tr key={s.numero || idx}>
                      <td>
                        <div className="salle-id-cell">
                          <div className="salle-icon-box">{Ico.Building}</div>
                          <span className="salle-id-text">{s.numero}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`equip-badge ${s.equipee_tv ? 'yes' : 'no'}`}>
                          {s.equipee_tv ? Ico.Check : Ico.Cross} {s.equipee_tv ? 'Oui' : 'Non'}
                        </span>
                      </td>
                      <td>
                        <span className={`equip-badge ${s.equipee_datashow ? 'yes' : 'no'}`}>
                          {s.equipee_datashow ? Ico.Check : Ico.Cross} {s.equipee_datashow ? 'Oui' : 'Non'}
                        </span>
                      </td>
                      <td style={{ textAlign:'right' }}>
                        <div style={{ display:'flex', justifyContent:'flex-end', gap:'0.5rem' }}>
                          <button className="btn-table-icon" onClick={() => handleDelete(s.numero)} title="Supprimer">
                            {Ico.Trash}
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

      {showModal && <AddSalleModal onClose={() => setShowModal(false)} onAdd={handleAddSalle} />}
      {toast && <div className="gsa-toast">{Ico.Check}{toast}</div>}
    </div>
  </div>
);
}

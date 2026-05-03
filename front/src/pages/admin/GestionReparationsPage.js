import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import '../../assets/css/admin/GestionReparationsPage.css';

/* ─── Icônes ─────────────────────────────────────────────── */
const Ico = {
  Search:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Bell:     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  User:     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Plus:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Filter:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  X:        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Alert:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Check:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Trash:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  ChevronRight: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
};

/* ─── Modal d'ajout réparation ──────────────────────────── */
function AddRepModal({ onClose, onAdd, datashows }) {
  const [datashow_id, setDsId] = useState('');
  const [date_reparation, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description_panne, setDesc] = useState('');
  const [action_realisee, setAction] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!datashow_id || !description_panne.trim()) return;
    onAdd({ 
      datashow_id: parseInt(datashow_id), 
      date_reparation, 
      description_panne: description_panne.trim(), 
      action_realisee: action_realisee.trim() || null 
    });
  };

  return (
    <div className="grp-modal-overlay" onClick={onClose}>
      <div className="grp-modal" onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
          <h3 className="grp-modal-title" style={{ margin:0 }}>Nouvelle Intervention</h3>
          <button onClick={onClose} style={{ border:'none', background:'none', cursor:'pointer', color:'#9ca3af', display:'flex' }}>{Ico.X}</button>
        </div>
        <form className="grp-modal-form" onSubmit={handleSubmit}>
          
          <div className="grp-modal-field">
            <label className="grp-modal-label">Appareil concerné</label>
            <select required className="grp-modal-select" value={datashow_id} onChange={e => setDsId(e.target.value)}>
              <option value="">Sélectionner un Data Show...</option>
              {datashows.map(ds => (
                <option key={ds.id} value={ds.id}>{ds.numero_unique} ({ds.etat})</option>
              ))}
            </select>
          </div>

          <div className="grp-modal-field">
            <label className="grp-modal-label">Date de l'intervention</label>
            <input type="date" required className="grp-modal-input" value={date_reparation} onChange={e => setDate(e.target.value)} />
          </div>

          <div className="grp-modal-field">
            <label className="grp-modal-label">Description de la panne</label>
            <textarea className="grp-modal-textarea" placeholder="Ex: Surchauffe, image floue..." value={description_panne} onChange={e => setDesc(e.target.value)} />
          </div>

          <div className="grp-modal-field">
            <label className="grp-modal-label">Action réalisée</label>
            <input className="grp-modal-input" placeholder="Ex: Nettoyage ventilateur, Changement lampe..." value={action_realisee} onChange={e => setAction(e.target.value)} />
          </div>

          <div className="grp-modal-btns">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-modal-submit">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Composant Principal ────────────────────────────────── */
export default function GestionReparationsPage({ activePage, onLogout }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const filterDsId = searchParams.get('dsId');

  const [reparations, setReparations] = useState([]);
  const [datashows, setDatashows] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState('');

  const fireToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      // Fetch Datashows for mapping
      const dsRes = await fetch('http://127.0.0.1:8000/datashows', { headers });
      const dsData = await dsRes.json();
      setDatashows(Array.isArray(dsData) ? dsData : []);

      // Fetch Reparations
      const repRes = await fetch('http://127.0.0.1:8000/reparations', { headers });
      const repData = await repRes.json();
      setReparations(Array.isArray(repData) ? repData : []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getDsNum = (id) => {
    const ds = datashows.find(d => d.id === id);
    return ds ? ds.numero_unique : `ID: ${id}`;
  };

  const filtered = reparations.filter(r => {
    if (filterDsId && r.datashow_id !== parseInt(filterDsId)) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return getDsNum(r.datashow_id).toLowerCase().includes(q) ||
           r.description_panne.toLowerCase().includes(q);
  });

  const handleAddRep = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://127.0.0.1:8000/reparations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        fetchData();
        setShowModal(false);
        fireToast(`✅ Intervention enregistrée`);
      } else {
        const errData = await res.json();
        fireToast(`❌ Erreur: ${errData.detail || "Erreur"}`);
      }
    } catch (err) { fireToast(`❌ Erreur de connexion`); }
  };

  return (
    <div className="grp-page-container" style={{display:'flex', flexDirection:'column', width:'100%'}}>
      <div className="grp-content">
        <div className="grp-topbar">
          <div className="topbar-search-wrap">
            <span className="topbar-search-icon">{Ico.Search}</span>
            <input className="topbar-search" placeholder="Rechercher par n° de matériel ou panne..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="topbar-actions">
            <button className="topbar-icon-btn">{Ico.Bell}</button>
            <button className="topbar-icon-btn">{Ico.User}</button>
          </div>
        </div>

        <div className="grp-main">
          <div className="grp-breadcrumb">
            <span>Gestion Technique</span>
            {Ico.ChevronRight}
            <span className="crumb-active">Historique des Réparations</span>
          </div>

          <div className="grp-header">
            <div>
              <h1 className="grp-page-title">Gestion des Réparations</h1>
              <p className="grp-page-subtitle">Suivi complet des interventions techniques sur le parc de Data Shows.</p>
            </div>
            <button className="btn-add-rep" onClick={() => setShowModal(true)}>
              {Ico.Plus} Nouvelle intervention
            </button>
          </div>

          <div>
            <div className="grp-section-header">
              <h2 className="grp-section-title">
                {filterDsId 
                  ? `Interventions pour ${getDsNum(parseInt(filterDsId))}` 
                  : `Toutes les interventions (${filtered.length})`
                }
              </h2>
              {filterDsId && (
                <button className="grp-clear-filter" onClick={() => navigate('/admin/reparations')}>
                  Effacer le filtre
                </button>
              )}
            </div>

            <div className="grp-table-card">
              <table className="grp-table">
                <thead>
                  <tr>
                    <th>Matériel</th>
                    <th>Date</th>
                    <th>Description de la panne</th>
                    <th>Action réalisée</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ padding:'2rem', textAlign:'center', color:'#9ca3af' }}>
                        Aucun historique disponible
                      </td>
                    </tr>
                  )}
                  {filtered.map((r, idx) => (
                    <tr key={r.id || idx}>
                      <td>
                        <div className="rep-id-cell">
                          <div className="rep-icon-box">{Ico.Alert}</div>
                          <span className="rep-device-text">{getDsNum(r.datashow_id)}</span>
                        </div>
                      </td>
                      <td className="rep-date-text">{r.date_reparation}</td>
                      <td><p className="rep-desc-text">{r.description_panne}</p></td>
                      <td>
                        <div className="rep-action-text">
                          {Ico.Check} {r.action_realisee || 'En attente'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      {showModal && <AddRepModal onClose={() => setShowModal(false)} onAdd={handleAddRep} datashows={datashows} />}
      {toast && <div className="grp-toast">{Ico.Check}{toast}</div>}
    </div>
  </div>
);
}

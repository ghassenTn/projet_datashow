import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import '../../assets/css/admin/GestionToutesReservationsPage.css';

/* ── Icônes ─────────────────────────────────────────────── */
const Ico = {
  Search:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Bell:     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  User:     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Calendar: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Clock:    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Building: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22V12h6v10M2 22h20"/><rect x="8" y="6" width="2" height="2"/><rect x="14" y="6" width="2" height="2"/><rect x="8" y="11" width="2" height="2"/><rect x="14" y="11" width="2" height="2"/></svg>,
  Monitor:  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  Filter:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  X:        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Check:    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  ChevronRight: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  ChevronLeft: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  Trash:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
};

/* ─── Composant Principal ────────────────────────────────── */
export default function GestionToutesReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fireToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/reservations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setReservations(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancel = async (id) => {
    if (window.confirm(`Annuler cette réservation ?`)) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://127.0.0.1:8000/reservations/${id}/annuler`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          fetchReservations();
          fireToast(`✅ Réservation annulée`);
        } else {
          const errData = await res.json();
          fireToast(`❌ Erreur: ${errData.detail || 'Impossible d\'annuler'}`);
        }
      } catch (err) {
        fireToast(`❌ Erreur réseau lors de l'annulation`);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Supprimer définitivement cette réservation ?`)) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://127.0.0.1:8000/reservations/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          fetchReservations();
          fireToast(`🗑️ Réservation supprimée`);
        } else {
          const errData = await res.json();
          fireToast(`❌ Erreur: ${errData.detail || 'Impossible de supprimer'}`);
        }
      } catch (err) {
        fireToast(`❌ Erreur réseau lors de la suppression`);
      }
    }
  };

  const filtered = search.trim()
    ? reservations.filter(r => 
        (r.professeur?.nom || '').toLowerCase().includes(search.toLowerCase()) || 
        (r.professeur?.prenom || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.salle_id || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.data_show?.numero_unique || '').toLowerCase().includes(search.toLowerCase())
      )
    : reservations;

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

  const fmtDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' });

  return (
    <div className="gtr-page-container">
      <div className="gtr-content">
        {/* Top bar */}
        <div className="gtr-topbar">
          <div className="topbar-search-wrap">
            <span className="topbar-search-icon">{Ico.Search}</span>
            <input className="topbar-search" placeholder="Chercher un prof, une salle, un DS..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="topbar-actions">
            <button className="topbar-icon-btn" title="Notifications">{Ico.Bell}<span className="notif-dot" /></button>
            <button className="topbar-icon-btn" title="Profil">{Ico.User}</button>
          </div>
        </div>

        {/* Main content */}
        <div className="gtr-main">
          
          {/* Breadcrumb */}
          <div className="gtr-breadcrumb">
            <span>Administration</span>
            {Ico.ChevronRight}
            <span className="crumb-active">Toutes les réservations</span>
          </div>

          {/* Header */}
          <div className="gtr-header">
            <div>
              <h1 className="gtr-page-title">Historique des Réservations</h1>
              <p className="gtr-page-subtitle">
                Consultez et gérez l'ensemble des réservations effectuées sur la plateforme IPSAS.
                Filtrez par professeur, salle ou matériel.
              </p>
            </div>
          </div>

          {/* Table Card */}
          <div className="gtr-table-card">
            <div className="gtr-table-header">
              <h2 className="gtr-table-title">Réservations ({filtered.length})</h2>
              <div className="gtr-table-actions">
                 <button className="gtr-table-btn">{Ico.Filter} Filtrer</button>
              </div>
            </div>

            <div className="gtr-table-responsive">
              <table className="gtr-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Professeur</th>
                  <th>Salle & Séance</th>
                  <th>Matériel (DS)</th>
                  <th>Type</th>
                  <th>État</th>
                  <th style={{ textAlign:'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                   <tr><td colSpan="7" style={{ textAlign:'center', padding:'3rem', color:'#6b7280' }}>Chargement des données...</td></tr>
                ) : paginated.length === 0 ? (
                  <tr><td colSpan="7" style={{ textAlign:'center', padding:'3rem', color:'#9ca3af' }}>Aucune réservation trouvée</td></tr>
                ) : paginated.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', fontWeight:600, color:'#111827' }}>
                        {Ico.Calendar}
                        {fmtDate(r.date_reservation)}
                      </div>
                    </td>
                    <td>
                      <div className="gtr-prof-cell">
                        <div className="gtr-prof-avatar">{(r.professeur?.prenom || ' ')[0]}{(r.professeur?.nom || ' ')[0]}</div>
                        <div style={{ display:'flex', flexDirection:'column', justifyContent:'center' }}>
                          <div style={{ fontWeight:700, color:'#111827', lineHeight:1.2 }}>{r.professeur?.prenom} {r.professeur?.nom}</div>
                          <div style={{ fontSize:'0.72rem', color:'#9ca3af', marginTop:'0.1rem' }}>ID: #{r.professeur_id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display:'flex', flexDirection:'column', gap:'0.2rem' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', fontWeight:600, color:'#374151' }}>
                          {Ico.Building} {r.salle_id}
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', fontSize:'0.8rem', color:'#6b7280' }}>
                          {Ico.Clock} {r.seance_id}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="gtr-ds-badge">
                        {Ico.Monitor}
                        {r.data_show?.numero_unique || `DS #${r.datashow_id}`}
                      </div>
                    </td>
                    <td>
                      {r.est_hors_emploi ? (
                        <span className="gtr-type-badge hors">Hors Emploi</span>
                      ) : (
                        <span className="gtr-type-badge normal">Emploi du temps</span>
                      )}
                    </td>
                    <td>
                      {r.etat === 1 ? (
                        <span className="gtr-status-badge active">Confirmée</span>
                      ) : (
                        <span className="gtr-status-badge cancelled">Annulée</span>
                      )}
                    </td>
                    <td style={{ textAlign:'right' }}>
                      <div style={{ display:'flex', justifyContent:'flex-end', gap:'0.4rem' }}>
                        {r.etat === 1 && (
                          <button className="gtr-action-btn cancel" onClick={() => handleCancel(r.id)} title="Annuler">
                             {Ico.X}
                          </button>
                        )}
                        <button className="gtr-action-btn delete" onClick={() => handleDelete(r.id)} title="Supprimer">
                           {Ico.Trash}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="gtr-table-footer">
                <span className="gtr-table-info">
                  Affichage de <b>{startIndex + 1}</b> à <b>{Math.min(startIndex + itemsPerPage, filtered.length)}</b> sur <b>{filtered.length}</b>
                </span>
                <div className="gtr-pag-btns">
                  <button className="gtr-pag-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>{Ico.ChevronLeft}</button>
                  {Array.from({length:totalPages}, (_,i) => (
                    <button key={i+1}
                      className={`gtr-pag-btn ${currentPage === i + 1 ? 'active' : ''}`}
                      onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                  ))}
                  <button className="gtr-pag-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>{Ico.ChevronRight}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {toast && <div className="gtr-toast">{Ico.Check}{toast}</div>}
    </div>
  );
}

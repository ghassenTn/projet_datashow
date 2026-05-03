import React, { useState, useEffect } from 'react';
import '../../assets/css/admin/GestionReclamationsPage.css';

/* ─── Icônes SVG ─────────────────────────────────────────── */
const Ico = {
  Search:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Filter:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  Message:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Check:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Alert:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  Clock:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  X:        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Calendar: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  ArrowRight: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Eye: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Trash: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
};

export default function GestionReclamationsPage({ activePage, onNavigate, onLogout }) {
  const [reclamations, setReclamations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [filterUrgence, setFilterUrgence] = useState('');
  const [selected, setSelected] = useState(null);
  const [reponse, setReponse] = useState('');
  const [toast, setToast] = useState('');

  const fetchReclamations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://127.0.0.1:8000/reclamations/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setReclamations(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReclamations();
  }, []);

  const fireToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleTreat = async () => {
    if (!selected || !reponse.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://127.0.0.1:8000/reclamations/${selected.id}/traiter?reponse=${encodeURIComponent(reponse)}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fireToast('✅ Réclamation traitée');
        setSelected(null);
        setReponse('');
        fetchReclamations();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette réclamation ?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://127.0.0.1:8000/reclamations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fireToast('🗑️ Réclamation supprimée');
        fetchReclamations();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = reclamations.filter(r => {
    const q = search.toLowerCase();
    
    // Status label for search
    const statusLabel = String(r.etat).toLowerCase() === 'en_attente' ? 'en attente' : 'traitée';
    
    // Urgency label for search
    const urgencyLabel = r.urgence === 'urgent' ? 'urgent' : r.urgence === 'moyen' ? 'moyen' : 'faible';

    // Filter by search (all columns)
    const matchesSearch = !q || (
      (r.description && r.description.toLowerCase().includes(q)) ||
      String(r.id).toLowerCase().includes(q) ||
      (r.date_reclamation && r.date_reclamation.includes(q)) ||
      (r.professeur_id && String(r.professeur_id).includes(q)) ||
      (r.professeur && r.professeur.nom && r.professeur.nom.toLowerCase().includes(q)) ||
      (r.professeur && r.professeur.prenom && r.professeur.prenom.toLowerCase().includes(q)) ||
      (r.datashow_id && String(r.datashow_id).includes(q)) ||
      (r.reservation_id && String(r.reservation_id).includes(q)) ||
      (r.type_probleme && r.type_probleme.toLowerCase().includes(q)) ||
      urgencyLabel.includes(q) ||
      statusLabel.includes(q)
    );
    
    // Filter by status dropdown
    const matchesStatut = !filterStatut || String(r.etat).toLowerCase() === filterStatut.toLowerCase();
    
    // Filter by urgency dropdown
    const matchesUrgence = !filterUrgence || String(r.urgence).toLowerCase() === filterUrgence.toLowerCase();

    return matchesSearch && matchesStatut && matchesUrgence;
  });

  const stats = {
    total: reclamations.length,
    attente: reclamations.filter(r => String(r.etat).toLowerCase() === 'en_attente').length,
    traitees: reclamations.filter(r => String(r.etat).toLowerCase() === 'traitee').length,
  };

  return (
    <div className="rec-page-container" style={{display:'flex', flexDirection:'column', width:'100%'}}>
      <div className="rec-main">
        <div className="rec-header">
          <div>
            <h1 className="rec-page-title">Gestion des Réclamations</h1>
            <p className="rec-page-subtitle">Consultez et répondez aux signalements des professeurs.</p>
          </div>
        </div>

        <div className="rec-stats">
          <div className="stat-card">
            <div className="stat-icon blue">{Ico.Message}</div>
            <div>
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">{Ico.Clock}</div>
            <div>
              <div className="stat-value">{stats.attente}</div>
              <div className="stat-label">En attente</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">{Ico.Check}</div>
            <div>
              <div className="stat-value">{stats.traitees}</div>
              <div className="stat-label">Traitées</div>
            </div>
          </div>
        </div>

        <div className="rec-filters">
          <div className="search-wrap">
            <span className="search-icon">{Ico.Search}</span>
            <input 
              className="search-input" 
              placeholder="Rechercher par description ou ID..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </div>
          
          <div className="filter-select-wrap">
            <select 
              className="filter-select"
              value={filterStatut}
              onChange={e => setFilterStatut(e.target.value)}
            >
              <option value="">Tous les statuts</option>
              <option value="en_attente">En attente</option>
              <option value="traitee">Traitée</option>
            </select>
            <span className="filter-chevron"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:13, height:13}}><polyline points="6 9 12 15 18 9"/></svg></span>
          </div>

          <div className="filter-select-wrap">
            <select 
              className="filter-select"
              value={filterUrgence}
              onChange={e => setFilterUrgence(e.target.value)}
            >
              <option value="">Toutes les urgences</option>
              <option value="faible">🟢 Faible</option>
              <option value="moyen">🟡 Moyen</option>
              <option value="urgent">🔴 Urgent</option>
            </select>
            <span className="filter-chevron"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:13, height:13}}><polyline points="6 9 12 15 18 9"/></svg></span>
          </div>
        </div>

        <div className="rec-card">
          <table className="rec-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Professeur</th>
                <th>Appareil</th>
                <th>Réservation</th>
                <th>Type</th>
                <th>Urgence</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9">
                    <div className="rec-empty">
                      <div className="loading-spinner" />
                      <p>Chargement des réclamations...</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="9">
                    <div className="rec-empty">
                      {Ico.Alert}
                      <p>Aucune réclamation trouvée.</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.map(r => {
                const isEnAttente = String(r.etat).toLowerCase() === 'en_attente';
                const urgLabel = r.urgence === 'urgent' ? '🔴 Urgent' : r.urgence === 'moyen' ? '🟡 Moyen' : '🟢 Faible';
                const urgClass = r.urgence === 'urgent' ? 'urgent' : r.urgence === 'moyen' ? 'moyen' : 'faible';

                return (
                  <tr key={r.id}>
                    <td className="rec-id">#REC-{r.id}</td>
                    <td>
                      <div style={{display:'flex', alignItems:'center', gap:6, fontSize:'0.85rem'}}>
                        {Ico.Calendar} {new Date(r.date_reclamation).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <div style={{display:'flex', alignItems:'center', gap:8}}>
                        <div style={{width:28, height:28, borderRadius:'50%', background:'#f3f4f6', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.75rem', fontWeight:700, color:'#1635b0'}}>
                          {r.professeur ? r.professeur.nom.charAt(0) : '?'}
                        </div>
                        <span style={{fontWeight:500}}>
                          {r.professeur ? `${r.professeur.prenom} ${r.professeur.nom}` : `Professeur #${r.professeur_id}`}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span style={{fontWeight:600}}>{r.datashow_id ? `DS-${r.datashow_id}` : '—'}</span>
                    </td>
                    <td>
                      <span style={{fontWeight:500, color:'#1635b0'}}>{r.reservation_id ? `#RES-${r.reservation_id}` : '—'}</span>
                    </td>
                    <td>
                      <div style={{maxWidth:180, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}} title={r.type_probleme}>
                        {r.type_probleme || 'Signalement'}
                      </div>
                    </td>
                    <td>
                      <span className={`urgency-badge ${urgClass}`}>{urgLabel}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${isEnAttente ? 'en-attente' : 'resolu'}`}>
                        <span className="dot" />
                        {isEnAttente ? 'En attente' : 'Traitée'}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        {isEnAttente ? (
                          <button className="btn-action" onClick={() => { setSelected(r); setReponse(r.reponse_admin || ''); }}>
                            Répondre {Ico.ArrowRight}
                          </button>
                        ) : (
                          <button className="btn-action secondary" onClick={() => { setSelected(r); setReponse(r.reponse_admin || ''); }}>
                            Détails {Ico.Eye}
                          </button>
                        )}
                        <button className="btn-action delete-only" 
                          onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }}
                          title="Supprimer la réclamation">
                          {Ico.Trash}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">
                {String(selected.etat).toLowerCase() === 'traitee' ? 'Détails de la réclamation' : 'Traiter la réclamation'} #REC-{selected.id}
              </span>
              <button className="modal-close-btn" onClick={() => setSelected(null)}>{Ico.X}</button>
            </div>
            
            <div className="modal-info-box">
              <div className="modal-info-grid">
                <div><strong>Data Show :</strong> <span style={{color:'#1635b0', fontWeight:700}}>{selected.datashow_id ? `DS-${selected.datashow_id}` : 'N/A'}</span></div>
                <div><strong>Type :</strong> {selected.type_probleme || 'Non spécifié'}</div>
                <div><strong>Urgence :</strong> {selected.urgence || 'N/A'}</div>
              </div>
              <div className="modal-label" style={{marginTop:'0.5rem'}}>Description du professeur :</div>
              <p style={{margin:0, color:'#4b5563', lineHeight:1.5}}>{selected.description}</p>
            </div>

            {String(selected.etat).toLowerCase() === 'traitee' ? (
              <div className="modal-view-section">
                <div className="modal-label">Réponse de l'administration</div>
                <div className="modal-text-display">
                  {selected.reponse_admin || "Aucune réponse n'a été fournie."}
                </div>
              </div>
            ) : (
              <>
                <div className="modal-label">Réponse de l'administration</div>
                <textarea 
                  className="modal-textarea" 
                  placeholder="Saisissez votre réponse ou les actions entreprises..."
                  value={reponse}
                  onChange={e => setReponse(e.target.value)}
                />
              </>
            )}

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setSelected(null)}>
                {String(selected.etat).toLowerCase() === 'traitee' ? 'Fermer' : 'Annuler'}
              </button>
              {String(selected.etat).toLowerCase() !== 'traitee' && (
                <div style={{display:'flex', gap:10}}>
                  <button className="btn-delete-modal" 
                    onClick={() => { handleDelete(selected.id); setSelected(null); }}
                    style={{
                      background:'#fee2e2', color:'#dc2626', border:'1px solid #fecaca',
                      padding:'0 1.25rem', borderRadius:8, fontWeight:600, cursor:'pointer'
                    }}>
                    Supprimer
                  </button>
                  <button className="btn-submit" onClick={handleTreat}>Confirmer le traitement</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast">
          {Ico.Check} {toast}
        </div>
      )}
    </div>
  );
}

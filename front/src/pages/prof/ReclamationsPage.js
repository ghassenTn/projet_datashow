import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/prof/ReclamationsPage.css';

/* ── Icons ───────────────────────────────────────────────── */
const IconPlus          = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>);
const IconSearch        = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>);
const IconChevron       = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>);
const IconChevronLeft   = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>);
const IconChevronRight  = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>);
const IconEye           = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>);
const IconTrash         = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>);
const IconX             = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
const IconAlertTriangle = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>);
const IconClock         = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>);
const IconCheckCircle   = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>);
const IconInfo          = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>);

/* ── Static mock data ────────────────────────────────────── */
const MOCK = [
  { id:'REC-001', date:'2026-05-01', datashow:'DataShow DS-01', type:'Panne matérielle',         urgence:'urgent', statut:'en-cours',   description:'Le projecteur ne s\'allume plus depuis ce matin. Aucun signal vidéo ni son.' },
  { id:'REC-002', date:'2026-04-28', datashow:'Projecteur PR-01', type:"Qualité d'image médiocre", urgence:'moyen',  statut:'resolu',     description:'L\'image est floue et pixelisée même après réglage du focus.' },
  { id:'REC-003', date:'2026-04-25', datashow:'DataShow DS-02', type:'Câble ou connectique manquant', urgence:'faible', statut:'rejete',  description:'Le câble VGA est manquant. Impossible de connecter le PC.' },
  { id:'REC-004', date:'2026-05-03', datashow:'DataShow DS-03', type:'Absence du matériel',      urgence:'urgent', statut:'en-attente', description:'Le datashow réservé n\'était pas dans la salle au moment de la séance.' },
  { id:'REC-005', date:'2026-04-20', datashow:'Projecteur PR-02', type:'Problème logiciel',      urgence:'moyen',  statut:'resolu',     description:'Firmware planté, le menu ne répond plus aux commandes de la télécommande.' },
  { id:'REC-006', date:'2026-05-04', datashow:'DataShow DS-01', type:'Panne matérielle',         urgence:'urgent', statut:'en-cours',   description:'Le ventilateur fait un bruit anormal et la lampe clignote.' },
];

const STATUT_MAP = {
  'en-attente':{ label: 'En attente',cls: 'en-attente' },
  'traitee':   { label: 'Traitée',   cls: 'traitee'    },
};

const URGENCE_MAP = {
  faible: { label: '🟢 Faible', cls: 'faible' },
  moyen:  { label: '🟡 Moyen',  cls: 'moyen'  },
  urgent: { label: '🔴 Urgent', cls: 'urgent' },
};

const PER_PAGE = 5;

/* ── Detail Modal ────────────────────────────────────────── */
function DetailModal({ rec, onClose, onDelete }) {
  if (!rec) return null;
  const sLabel = rec.etat === 'en_attente' ? 'En attente' : 'Traitée';
  const cls = rec.etat === 'en_attente' ? 'en-attente' : 'resolu';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Détail de la réclamation</span>
          <button className="modal-close" onClick={onClose}><IconX /></button>
        </div>
        {[
          ['Référence', `#REC-${rec.id}`],
          ['Date', new Date(rec.date_reclamation).toLocaleDateString()],
        ].map(([k,v]) => (
          <div key={k} className="modal-row">
            <span className="modal-key">{k}</span>
            <span className="modal-val">{v}</span>
          </div>
        ))}
        <div className="modal-row">
          <span className="modal-key">Statut</span>
          <span className={`status-badge ${cls}`}><span className="dot"/>{sLabel}</span>
        </div>
        <div className="modal-row">
          <span className="modal-key">Appareil</span>
          <span className="modal-val">{rec.datashow_id ? `DS-${rec.datashow_id}` : 'N/A'}</span>
        </div>
        <div className="modal-row">
          <span className="modal-key">Réservation</span>
          <span className="modal-val">{rec.reservation_id ? `#RES-${rec.reservation_id}` : 'Aucune'}</span>
        </div>
        <div className="modal-desc">
          <div className="modal-desc-label">Description détaillée</div>
          {rec.description}
        </div>
        {rec.reponse_admin && (
          <div className="modal-desc" style={{marginTop:'1.5rem', background:'#f0fdf4', borderColor:'#bbf7d0'}}>
            <div className="modal-desc-label" style={{color:'#16a34a'}}>Réponse de l'administration</div>
            {rec.reponse_admin}
          </div>
        )}
        <div style={{display:'flex', gap:'1rem', marginTop:'1.5rem'}}>
          <button className="modal-btn-close" onClick={onClose} style={{flex:1}}>Fermer</button>
          <button className="modal-btn-delete" 
            onClick={() => { onDelete(rec.id); onClose(); }}
            style={{
              flex:1, background:'#fee2e2', color:'#dc2626', border:'1px solid #fecaca',
              borderRadius:8, fontWeight:600, cursor:'pointer'
            }}>
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────── */
export default function ReclamationsPage({ role }) {
  const navigate = useNavigate();
  const [reclamations, setReclamations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch]       = useState('');
  const [filterStatut, setFilter] = useState('');
  const [currentPage, setPage]    = useState(1);
  const [selected, setSelected]   = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Session expirée. Veuillez vous reconnecter.");
        setLoading(false);
        return;
      }

      // Fetch Reclamations
      try {
        const recsRes = await fetch('http://127.0.0.1:8000/reclamations/mes-reclamations', { 
          headers: { 'Authorization': `Bearer ${token}` } 
        });
        if (recsRes.ok) {
          const data = await recsRes.json();
          setReclamations(Array.isArray(data) ? data : []);
        } else if (recsRes.status === 403) {
          setError("V3: Accès restreint. Vos signalements sont traités par l'équipe technique.");
        } else {
          setError("V3: Erreur de chargement des données.");
        }
      } catch (err) {
        console.error("Erreur fetch reclamations:", err);
        setError("V3: Connexion au serveur impossible.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = useMemo(() => ({
    total:    reclamations.length,
    attente:  reclamations.filter(r => r.etat && String(r.etat).toUpperCase() === 'EN_ATTENTE').length,
    traitees: reclamations.filter(r => r.etat && String(r.etat).toUpperCase() === 'TRAITEE').length,
  }), [reclamations]);

  const filtered = useMemo(() => {
    let list = Array.isArray(reclamations) ? reclamations : [];
    if (filterStatut) {
      const fs = filterStatut.toLowerCase();
      if (fs === 'en-attente') {
        list = list.filter(r => r.etat && String(r.etat).toUpperCase() === 'EN_ATTENTE');
      } else if (fs === 'traitee') {
        list = list.filter(r => r.etat && String(r.etat).toUpperCase() === 'TRAITEE');
      }
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(r =>
        String(r.id).toLowerCase().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q)) ||
        (r.datashow_id && String(r.datashow_id).includes(q)) ||
        (r.reservation_id && String(r.reservation_id).includes(q))
      );
    }
    return list;
  }, [reclamations, search, filterStatut]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((currentPage-1)*PER_PAGE, currentPage*PER_PAGE);

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette réclamation ?")) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://127.0.0.1:8000/reclamations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setReclamations(prev => prev.filter(r => r.id !== id));
      } else {
        alert("Erreur lors de la suppression.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau.");
    }
  };

  const fmtDate = d => {
    if (!d) return '—';
    const date = new Date(d);
    return isNaN(date.getTime()) ? '—' : date.toLocaleDateString('fr-FR', {day:'2-digit', month:'short', year:'numeric'});
  };

  return (
    <div className="rec-page-container" style={{display:'flex', flexDirection:'column', width:'100%'}}>
      <main className="rec-main">
        {/* Header */}
        <div className="rec-header">
          <div>
            <h1 className="rec-page-title">Mes Réclamations</h1>
            <p className="rec-page-subtitle">Suivi de vos signalements de problèmes sur les équipements Data Show.</p>
          </div>
          <button className="btn-new-rec" id="btn-new-reclamation"
            onClick={() => navigate('/prof/nouvelle-reclamation')}>
            <IconPlus /> Nouvelle réclamation
          </button>
        </div>



        {/* Stats */}
        <div className="rec-stats">
          {[
            { label:'Total',      value: stats.total,    icon:<IconAlertTriangle />, cls:'blue'   },
            { label:'En attente', value: stats.attente,  icon:<IconClock />,         cls:'orange' },
            { label:'Traitées',   value: stats.traitees, icon:<IconCheckCircle />,   cls:'green'  },
          ].map(({ label, value, icon, cls }) => (
            <div key={label} className="stat-card">
              <div className={`stat-icon ${cls}`}>{icon}</div>
              <div>
                <div className="stat-value">{value}</div>
                <div className="stat-label">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="rec-filters">
          <div className="search-wrap">
            <span className="search-icon"><IconSearch /></span>
            <input id="rec-search" type="text" className="search-input"
              placeholder="Rechercher par ID, appareil, type..."
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <div className="filter-select-wrap">
            <select id="filter-statut" className="filter-select"
              value={filterStatut} onChange={e => { setFilter(e.target.value); setPage(1); }}>
              <option value="">Tous les statuts</option>
              <option value="en-attente">En attente</option>
              <option value="traitee">Traitée</option>
            </select>
            <span className="filter-chevron"><IconChevron /></span>
          </div>
          <div className="filter-select-wrap">
            <select className="filter-select"
              onChange={e => { setFilter(''); setSearch(e.target.value === 'urgent' ? '' : ''); }}>
              <option value="">Toutes les urgences</option>
              <option value="faible">🟢 Faible</option>
              <option value="moyen">🟡 Moyen</option>
              <option value="urgent">🔴 Urgent</option>
            </select>
            <span className="filter-chevron"><IconChevron /></span>
          </div>
        </div>

        {/* Table */}
        <div className="rec-card">
          <table className="rec-table" aria-label="Liste des réclamations">
            <thead>
              <tr>
                <th>Référence</th>
                <th>Date</th>
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
                  <td colSpan={8}>
                    <div className="rec-empty">
                      <div className="loading-spinner" />
                      <p>Chargement des réclamations...</p>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8}>
                    <div className="rec-empty" style={{color:'#1a2b6d', background:'#f0f4ff', border:'1px dashed #1a2b6d', padding:'2rem', borderRadius:12}}>
                      <IconInfo />
                      <p style={{maxWidth:500, margin:'0 auto', marginTop:10}}>{error}</p>
                    </div>
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="rec-empty">
                      <IconAlertTriangle />
                      <p>Aucune réclamation trouvée.</p>
                      {reclamations.length > 0 && (
                        <p style={{fontSize:'0.8rem', color:'#9ca3af', marginTop:'0.5rem'}}>
                          ({reclamations.length} réclamation{reclamations.length > 1 ? 's' : ''} au total, mais masquée{reclamations.length > 1 ? 's' : ''} par les filtres)
                        </p>
                      )}
                      {reclamations.length === 0 && (
                        <p style={{fontSize:'0.8rem', color:'#9ca3af', marginTop:'0.5rem'}}>
                          (Vous n'avez pas encore soumis de réclamation)
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : paginated.map(r => {
                const etatUpper = r.etat ? String(r.etat).toUpperCase() : '';
                const sLabel = etatUpper === 'EN_ATTENTE' ? 'En attente' : 'Traitée';
                const cls = etatUpper === 'EN_ATTENTE' ? 'en-attente' : 'traitee';
                
                let urgenceCls = 'faible';
                let urgenceLabel = '🟢 Faible';
                if (r.urgence === 'moyen') {
                  urgenceCls = 'moyen';
                  urgenceLabel = '🟡 Moyen';
                } else if (r.urgence === 'urgent') {
                  urgenceCls = 'urgent';
                  urgenceLabel = '🔴 Urgent';
                }
                
                return (
                  <tr key={r.id}>
                    <td><span className="rec-id">#REC-{r.id}</span></td>
                    <td>
                      <div className="rec-date-main">{fmtDate(r.date_reclamation)}</div>
                    </td>
                    <td style={{fontWeight:600}}>{r.datashow_id ? `DS-${r.datashow_id}` : '—'}</td>
                    <td style={{fontWeight:500, color:'#1635b0'}}>
                      {r.reservation_id ? `#RES-${r.reservation_id}` : '—'}
                    </td>
                    <td style={{maxWidth:'160px'}}>
                      <span style={{fontSize:'0.83rem'}}>{r.type_probleme || 'Signalement'}</span>
                    </td>
                    <td>
                      <span className={`urgency-badge ${urgenceCls}`}>{urgenceLabel}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${cls}`}>
                        <span className="dot"/>{sLabel}
                      </span>
                    </td>
                    <td>
                      <div className="rec-action-btns">
                        <button className="rec-btn-action rec-view"
                          id={`btn-view-${r.id}`}
                          title="Détails"
                          onClick={() => setSelected(r)}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:17, height:17}}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        <button className="rec-btn-action rec-delete"
                          id={`btn-delete-${r.id}`}
                          title="Supprimer"
                          onClick={() => handleDelete(r.id)}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:17, height:17}}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="rec-pagination">
            <span className="pagination-info">
              {filtered.length === 0
                ? 'Aucun résultat'
                : `${Math.min((currentPage-1)*PER_PAGE+1, filtered.length)}–${Math.min(currentPage*PER_PAGE, filtered.length)} sur ${filtered.length}`
              }
            </span>
            <div className="pagination-btns">
              <button className="page-btn" disabled={currentPage===1}
                onClick={() => setPage(p => p-1)}><IconChevronLeft /></button>
              {Array.from({length:totalPages}, (_,i) => (
                <button key={i+1}
                  className={`page-btn ${currentPage===i+1 ? 'active' : ''}`}
                  onClick={() => setPage(i+1)}>{i+1}</button>
              ))}
              <button className="page-btn" disabled={currentPage===totalPages}
                onClick={() => setPage(p => p+1)}><IconChevronRight /></button>
            </div>
          </div>
        </div>
      </main>

      {selected && <DetailModal rec={selected} onClose={() => setSelected(null)} onDelete={handleDelete} />}
    </div>
  );
}

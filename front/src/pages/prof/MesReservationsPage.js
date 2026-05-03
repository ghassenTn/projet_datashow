import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/prof/MesReservationsPage.css';

/* ── Icons ───────────────────────────────────────────────── */

const IconPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const IconChevron = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const IconChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const IconChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const IconEye = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const IconList = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const STATUT_MAP = {
  confirmee:  { label: 'Confirmée',  cls: 'confirmee' },
  'en-attente': { label: 'En attente', cls: 'en-attente' },
  annulee:    { label: 'Annulée',    cls: 'annulee'  },
};

const PER_PAGE = 5;

/* ── Detail Modal ────────────────────────────────────────── */

function DetailModal({ reservation: r, onClose }) {
  if (!r) return null;
  const { label, cls } = STATUT_MAP[r.statut];
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '1rem'
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: '14px', padding: '2rem',
        width: '100%', maxWidth: '440px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
          <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:'1.3rem', fontWeight:800, color:'#111827' }}>
            Détail de la réservation
          </h3>
          <button onClick={onClose} style={{
            border:'none', background:'none', cursor:'pointer',
            color:'#9ca3af', display:'flex'
          }}><IconX /></button>
        </div>
        {[
          ['Référence',    r.id],
          ['Date',         new Date(r.date).toLocaleDateString('fr-FR', { weekday:'long', year:'numeric', month:'long', day:'numeric' })],
          ['Séance',       `${r.seance} — ${r.horaire}`],
          ['Salle',        r.salle],
          ['Data Show',    r.datashow],
          ['Rattrapage',   r.rattrapage ? 'Oui' : 'Non'],
        ].map(([k, v]) => (
          <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'0.65rem 0', borderBottom:'1px solid #f3f4f6' }}>
            <span style={{ fontSize:'0.83rem', color:'#6b7280', fontWeight:500 }}>{k}</span>
            <span style={{ fontSize:'0.86rem', color:'#111827', fontWeight:600, textAlign:'right' }}>{v}</span>
          </div>
        ))}
        <div style={{ display:'flex', justifyContent:'space-between', padding:'0.65rem 0' }}>
          <span style={{ fontSize:'0.83rem', color:'#6b7280', fontWeight:500 }}>Statut</span>
          <span className={`status-badge ${cls}`}>
            <span className="dot"/>{label}
          </span>
        </div>
        <button onClick={onClose} style={{
          marginTop:'1.5rem', width:'100%', padding:'0.75rem',
          background:'#1635b0', color:'#fff', border:'none', borderRadius:'8px',
          fontFamily:'Inter,sans-serif', fontSize:'0.9rem', fontWeight:600, cursor:'pointer'
        }}>
          Fermer
        </button>
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────── */

export default function MesReservationsPage() {
  const navigate = useNavigate();
  const [search, setSearch]     = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [currentPage, setCurrentPage]   = useState(1);
  const [selected, setSelected] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/reservations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Erreur lors de la récupération des réservations');
      const data = await response.json();
      
      // Mapper les données du backend vers le format du frontend
      const mapped = data.map(res => ({
        id: `RES-${res.id.toString().padStart(3, '0')}`,
        backendId: res.id,
        date: res.date_reservation,
        jour: new Date(res.date_reservation).toLocaleDateString('fr-FR', { weekday: 'long' }),
        seance: res.seance_id,
        horaire: res.seance ? `${res.seance.heure_debut.substring(0, 5)} - ${res.seance.heure_fin.substring(0, 5)}` : 'N/A',
        salle: res.salle_id,
        datashow: res.data_show ? `DataShow ${res.data_show.numero_unique}` : 'N/A',
        statut: res.etat === 0 ? 'annulee' : 'confirmee', // etat 0 = annulée, 1 = active
        rattrapage: res.est_hors_emploi
      }));

      setReservations(mapped);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* Stats */
  const stats = useMemo(() => ({
    total:      reservations.length,
    confirmees: reservations.filter(r => r.statut === 'confirmee').length,
    annulees:   reservations.filter(r => r.statut === 'annulee').length,
  }), [reservations]);

  /* Filtered list */
  const filtered = useMemo(() => {
    let list = reservations;
    if (filterStatut) list = list.filter(r => r.statut === filterStatut);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(r =>
        r.id.toLowerCase().includes(q) ||
        r.salle.toLowerCase().includes(q) ||
        r.datashow.toLowerCase().includes(q) ||
        r.seance.toLowerCase().includes(q) ||
        r.date.includes(q)
      );
    }
    return list;
  }, [reservations, search, filterStatut]);

  /* Pagination */
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const handleCancel = async (backendId) => {
    console.log("Tentative d'annulation pour l'ID:", backendId);
    if (!window.confirm('Voulez-vous vraiment annuler cette réservation ?')) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/reservations/${backendId}/annuler`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erreur lors de l\'annulation');
      }
      
      console.log("Annulation réussie pour:", backendId);
      // Mettre à jour le statut localement
      setReservations(prev =>
        prev.map(r => r.backendId === backendId ? { ...r, statut: 'annulee' } : r)
      );
    } catch (err) {
      console.error("Erreur annulation:", err);
      alert(err.message);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  return (
    <div className="mr-page-container" style={{display:'flex', flexDirection:'column', width:'100%'}}>
      <main className="mr-main">

        {/* Header */}
        <div className="mr-header">
          <div className="mr-title-block">
            <h1 className="mr-page-title">Mes Réservations</h1>
            <p className="mr-page-subtitle">Suivez et gérez toutes vos demandes de réservation de Data Show.</p>
          </div>
          <button className="btn-new-res" id="btn-new-reservation"
            onClick={() => navigate('/prof/reservation')}>
            <IconPlus />
            Nouvelle réservation
          </button>
        </div>

        {/* Stats */}
        <div className="mr-stats">
          {[
            { label: 'Total', value: stats.total,      icon: <IconList />,  cls: 'blue'  },
            { label: 'Confirmées', value: stats.confirmees, icon: <IconCheck />, cls: 'green' },
            { label: 'Annulées',   value: stats.annulees,   icon: <IconX />,     cls: 'red'   },
          ].map(({ label, value, icon, cls }) => (
            <div key={label} className="stat-card">
              <div className={`stat-icon ${cls}`}>{icon}</div>
              <div className="stat-info">
                <div className="stat-value">{value}</div>
                <div className="stat-label">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mr-filters">
          <div className="search-wrap">
            <span className="search-icon"><IconSearch /></span>
            <input
              id="res-search"
              type="text"
              className="search-input"
              placeholder="Rechercher par salle, séance, ID..."
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="filter-select-wrap">
            <select
              id="filter-statut"
              className="filter-select"
              value={filterStatut}
              onChange={e => { setFilterStatut(e.target.value); setCurrentPage(1); }}
            >
              <option value="">Tous les statuts</option>
              <option value="confirmee">Confirmée</option>
              <option value="annulee">Annulée</option>
            </select>
            <span className="filter-chevron"><IconChevron /></span>
          </div>
        </div>

        {/* Table */}
        <div className="mr-card">
          <table className="mr-table" aria-label="Liste des réservations">
            <thead>
              <tr>
                <th>Référence</th>
                <th>Date</th>
                <th>Séance</th>
                <th>Salle</th>
                <th>Data Show</th>
                <th>Type</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8}>
                    <div className="mr-empty">
                      <div className="loading-spinner" />
                      <p>Chargement de vos réservations...</p>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8}>
                    <div className="mr-empty" style={{ color: '#ef4444' }}>
                      <p>{error}</p>
                      <button onClick={fetchReservations} className="btn-retry">Réessayer</button>
                    </div>
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="mr-empty">
                      <IconCalendar />
                      <p>Aucune réservation trouvée.</p>
                    </div>
                  </td>
                </tr>
              ) : paginated.map(r => {
                const { label, cls } = STATUT_MAP[r.statut];
                return (
                  <tr key={r.id}>
                    <td><span className="res-id">{r.id}</span></td>
                    <td>
                      <div className="res-date">{formatDate(r.date)}</div>
                      <div className="res-date-sub">{r.jour}</div>
                    </td>
                    <td>{r.seance} <span style={{color:'#9ca3af',fontSize:'0.78rem'}}>({r.horaire})</span></td>
                    <td>{r.salle}</td>
                    <td>{r.datashow}</td>
                    <td>
                      <span style={{
                        fontSize: '0.75rem', fontWeight: 600, padding: '0.22rem 0.6rem',
                        borderRadius: '20px',
                        background: r.rattrapage ? '#f3f0ff' : '#f3f4f6',
                        color: r.rattrapage ? '#7c3aed' : '#6b7280'
                      }}>
                        {r.rattrapage ? 'Rattrapage' : 'Normal'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${cls}`}>
                        <span className="dot"/>{label}
                      </span>
                    </td>
                    <td>
                      <div className="mr-action-btns">
                        <button className="mr-btn-action mr-view"
                          title="Détails"
                          id={`btn-view-${r.id}`}
                          onClick={() => {
                            console.log("Click détails:", r);
                            setSelected(r);
                          }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:17, height:17}}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        {r.statut === 'confirmee' && (
                          <button className="mr-btn-action mr-cancel"
                            title="Annuler"
                            id={`btn-cancel-${r.id}`}
                            onClick={() => handleCancel(r.backendId)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:17, height:17}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="mr-pagination">
            <span className="pagination-info">
              {filtered.length === 0
                ? 'Aucun résultat'
                : `${Math.min((currentPage-1)*PER_PAGE+1, filtered.length)}–${Math.min(currentPage*PER_PAGE, filtered.length)} sur ${filtered.length} réservation${filtered.length > 1 ? 's' : ''}`
              }
            </span>
            <div className="pagination-btns">
              <button className="page-btn" onClick={() => setCurrentPage(p => p-1)}
                disabled={currentPage === 1} aria-label="Page précédente">
                <IconChevronLeft />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i+1}
                  className={`page-btn ${currentPage === i+1 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(i+1)}>
                  {i+1}
                </button>
              ))}
              <button className="page-btn" onClick={() => setCurrentPage(p => p+1)}
                disabled={currentPage === totalPages} aria-label="Page suivante">
                <IconChevronRight />
              </button>
            </div>
          </div>
        </div>

      </main>

      {/* Modal de détail */}
      {selected && <DetailModal reservation={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';
import '../../assets/css/admin/GestionParcPage.css';

/* ── Icons ───────────────────────────────────────────────── */
const IconSearch    = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>);
const IconBell      = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>);
const IconHelp      = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>);
const IconMonitor   = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>);
const IconCheck     = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>);
const IconTool      = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>);
const IconPlus      = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>);
const IconFilter    = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>);
const IconDownload  = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>);
const IconEdit      = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>);
const IconHistory   = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/></svg>);
const IconExternalLink = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>);
const IconChevRight = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>);
const IconChevLeft  = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>);
const IconCheckCircle = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>);
const IconX         = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
const IconTrash     = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>);

/* ── Mapping states ─────────────────────────────────────── */
const ETAT_MAP = {
  disponible:  { label:'Disponible',   cls:'disponible'  },
  en_panne:    { label:'En panne',     cls:'en-panne'    },
};

const PER_PAGE = 5;

/* ── DataShow Modal (Add/Edit) ───────────────────────────── */
function DataShowModal({ onClose, onSave, initialData = null }) {
  const [form, setForm] = useState(initialData || { numero_unique:'', date_achat:'', etat:'disponible' });
  const isEdit = !!initialData;
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const isValid = form.numero_unique && form.date_achat;

  return (
    <div className="gp-modal-overlay" onClick={onClose}>
      <div className="gp-modal" onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
          <h3 className="gp-modal-title" style={{ margin:0 }}>
            {isEdit ? 'Modifier le Data Show' : 'Ajouter un Data Show'}
          </h3>
          <button onClick={onClose} style={{ border:'none', background:'none', cursor:'pointer', color:'#9ca3af', display:'flex' }}><IconX /></button>
        </div>
        <div className="gp-modal-form">
          <div className="gp-modal-field">
            <label className="gp-modal-label">N° Unique *</label>
            <input className="gp-modal-input" placeholder="DS-2026-001"
              value={form.numero_unique} onChange={e => set('numero_unique', e.target.value)} />
          </div>
          <div className="gp-modal-field">
            <label className="gp-modal-label">Date d'achat *</label>
            <input type="date" className="gp-modal-input"
              value={form.date_achat} onChange={e => set('date_achat', e.target.value)} />
          </div>
          <div className="gp-modal-field">
            <label className="gp-modal-label">État</label>
            <select className="gp-modal-select"
              value={form.etat} onChange={e => set('etat', e.target.value)}>
              <option value="disponible">Disponible</option>
              <option value="en_panne">En panne</option>
            </select>
          </div>
          <div className="gp-modal-btns">
            <button className="btn-modal-cancel" onClick={onClose}>Annuler</button>
            <button className="btn-modal-submit" disabled={!isValid} onClick={() => { if(isValid) { onSave(form); } }}>
              {isEdit ? 'Enregistrer les modifications' : 'Ajouter l\'appareil'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Delete Confirmation Modal ───────────────────────────── */
function DeleteConfirmModal({ onClose, onDelete, device }) {
  return (
    <div className="gp-modal-overlay" onClick={onClose}>
      <div className="gp-modal" style={{ maxWidth:'400px' }} onClick={e => e.stopPropagation()}>
        <div style={{ textAlign:'center', padding:'1rem 0' }}>
          <div style={{ color:'#dc2626', marginBottom:'1rem' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h3 className="gp-modal-title" style={{ marginBottom:'0.5rem' }}>Supprimer l'appareil ?</h3>
          <p style={{ color:'#6b7280', fontSize:'0.9rem', marginBottom:'1.5rem' }}>
            Êtes-vous sûr de vouloir supprimer le Data Show <strong>{device.numero_unique}</strong> ? Cette action est irréversible.
          </p>
          <div className="gp-modal-btns">
            <button className="btn-modal-cancel" onClick={onClose}>Annuler</button>
            <button className="btn-modal-submit" style={{ background:'#dc2626' }} onClick={() => { onDelete(device.id); }}>
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────── */
export default function GestionParcPage() {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [repairs, setRepairs]     = useState([]);
  const [search, setSearch]       = useState('');
  const [currentPage, setPage]    = useState(1);
  const [loading, setLoading]     = useState(true);
  
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit'
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [toast, setToast] = useState(null);

  const token = localStorage.getItem('token');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const dsRes = await fetch(`${API_BASE_URL}/datashows`, { headers });
      const dsData = await dsRes.json();
      setInventory(Array.isArray(dsData) ? dsData : []);

      const repRes = await fetch(`${API_BASE_URL}/reparations`, { headers });
      const repData = await repRes.json();
      setRepairs(Array.isArray(repData) ? repData : []);
    } catch (err) { 
      console.error(err); 
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showFeedback = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* Stats */
  const stats = useMemo(() => ({
    total:       inventory.length,
    disponibles: inventory.filter(d => d.etat === 'disponible').length,
    pannes:      inventory.filter(d => d.etat !== 'disponible').length,
  }), [inventory]);

  const pct = stats.total > 0 ? Math.round((stats.disponibles / stats.total) * 100) : 0;

  /* Filter */
  const filtered = useMemo(() => {
    if (!search.trim()) return inventory;
    const q = search.toLowerCase();
    return inventory.filter(d => d.numero_unique.toLowerCase().includes(q));
  }, [inventory, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((currentPage-1)*PER_PAGE, currentPage*PER_PAGE);

  const fmtDate = d => new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' });

  const toggleEtat = async (id, currentEtat) => {
    try {
      const nextEtat = currentEtat === 'disponible' ? 'en_panne' : 'disponible';
      const res = await fetch(`${API_BASE_URL}/datashows/${id}/etat?etat=${nextEtat}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData();
        showFeedback(`État mis à jour : ${nextEtat === 'disponible' ? 'Disponible' : 'En panne'}`);
      }
    } catch (err) { console.error(err); }
  };

  const handleAdd = async (form) => {
    try {
      const res = await fetch(`${API_BASE_URL}/datashows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        fetchData();
        setModalMode(null);
        showFeedback('Data Show ajouté avec succès !');
      } else {
        alert("Erreur lors de l'ajout. Vérifiez le numéro unique.");
      }
    } catch (err) { console.error(err); }
  };

  const handleEdit = async (form) => {
    try {
      const res = await fetch(`${API_BASE_URL}/datashows/${selectedDevice.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        fetchData();
        setModalMode(null);
        showFeedback('Modifications enregistrées !');
      }
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/datashows/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData();
        setShowDeleteModal(false);
        showFeedback('Appareil supprimé du parc.');
      }
    } catch (err) { console.error(err); }
  };

  const getDsNum = (id) => {
    const ds = inventory.find(d => d.id === id);
    return ds ? ds.numero_unique : `ID: ${id}`;
  };

  if (loading && inventory.length === 0) {
    return (
      <div className="gp-content" style={{ display:'flex', alignItems:'center', justifyContent:'center', height: '100%' }}>
        Chargement du parc...
      </div>
    );
  }

  return (
    <div className="gp-page-container" style={{display:'flex', flexDirection:'column', width:'100%'}}>
      <div className="gp-content">
        {/* Top bar */}
        <div className="gp-topbar">
          <div className="topbar-search-wrap">
            <span className="topbar-search-icon"><IconSearch /></span>
            <input className="topbar-search" placeholder="Rechercher un appareil..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <div className="topbar-actions">
            <button className="topbar-icon-btn" title="Notifications">
              <IconBell />
              <span className="notif-dot" />
            </button>
            <button className="topbar-icon-btn" title="Aide"><IconHelp /></button>
          </div>
        </div>

        {/* Main content */}
        <div className="gp-main">

          {/* Breadcrumb */}
          <div className="gp-breadcrumb">
            <span>Gestion Technique</span>
            <IconChevRight />
            <span className="crumb-active">Parc Data Show</span>
          </div>

          {/* Header */}
          <div className="gp-header">
            <div>
              <h1 className="gp-page-title">Gestion du Parc de Data Shows</h1>
              <p className="gp-page-subtitle">
                Administration centrale des équipements de projection.
                Suivi de l'état, maintenance préventive et historique des interventions techniques.
              </p>
            </div>
            <button className="btn-add-ds" id="btn-add-datashow"
              onClick={() => { setSelectedDevice(null); setModalMode('add'); }}>
              <IconPlus /> Ajouter un Data Show
            </button>
          </div>

          {/* Stats */}
          <div className="gp-stats">
            <div className="gp-stat-card">
              <div>
                <div className="gp-stat-label">Total Appareils</div>
                <div className="gp-stat-value">{String(stats.total).padStart(2,'0')}</div>
              </div>
              <div className="gp-stat-icon blue"><IconMonitor /></div>
            </div>
            <div className="gp-stat-card">
              <div>
                <div className="gp-stat-label">Disponibles</div>
                <div className="gp-stat-value green">{String(stats.disponibles).padStart(2,'0')}</div>
                <div className="gp-stat-sub">{pct}%</div>
              </div>
              <div className="gp-stat-icon green"><IconCheck /></div>
            </div>
            <div className="gp-stat-card">
              <div>
                <div className="gp-stat-label">
                  En Panne / Réparation
                  {stats.pannes > 0 && <span className="stat-alert-badge">ALERTE</span>}
                </div>
                <div className="gp-stat-value red">{String(stats.pannes).padStart(2,'0')}</div>
              </div>
              <div className="gp-stat-icon red"><IconTool /></div>
            </div>
          </div>

          {/* Inventory */}
          <div>
            <div className="gp-section-header">
              <h2 className="gp-section-title">Inventaire Actif</h2>
              <div className="gp-section-actions">
                <button className="gp-icon-btn" title="Filtrer"><IconFilter /></button>
                <button className="gp-icon-btn" title="Exporter"><IconDownload /></button>
              </div>
            </div>

            <div className="gp-table-card">
              <table className="gp-table" aria-label="Inventaire des Data Shows">
                <thead>
                  <tr>
                    <th>N° Unique</th>
                    <th>Date d'achat</th>
                    <th>État</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 && (
                    <tr><td colSpan="4" style={{ textAlign:'center', padding:'2rem', color:'#9ca3af' }}>Aucun matériel trouvé</td></tr>
                  )}
                  {paginated.map(device => {
                    const state = ETAT_MAP[device.etat] || { label: device.etat, cls: 'en-panne' };
                    const isPanne = device.etat !== 'disponible';
                    return (
                      <tr key={device.id}>
                        <td>
                          <div className="device-id-cell">
                            <div className="device-icon"><IconMonitor /></div>
                            <span className="device-id-link">{device.numero_unique}</span>
                          </div>
                        </td>
                        <td>{fmtDate(device.date_achat)}</td>
                        <td>
                          <span className={`etat-badge ${state.cls}`}>
                            <span className="dot" />{state.label}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button className="btn-table-icon" title="Modifier" 
                              onClick={() => { setSelectedDevice(device); setModalMode('edit'); }}>
                              <IconEdit />
                            </button>
                            <button className="btn-table-icon delete" title="Supprimer"
                              onClick={() => { setSelectedDevice(device); setShowDeleteModal(true); }}>
                              <IconTrash />
                            </button>
                            <button className="btn-table-icon" title="Historique" onClick={() => navigate('/admin/reparations?dsId=' + device.id)}><IconHistory /></button>
                            {isPanne
                              ? <button className="btn-reparer" onClick={() => toggleEtat(device.id, device.etat)}>RÉPARER</button>
                              : <button className="btn-signaler" onClick={() => toggleEtat(device.id, device.etat)}>SIGNALER PANNE</button>
                            }
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="gp-table-footer">
                <span className="gp-table-info">
                  Affichage de {Math.min((currentPage-1)*PER_PAGE+1, filtered.length)}-{Math.min(currentPage*PER_PAGE, filtered.length)} sur {filtered.length} appareils
                </span>
                <div className="gp-pag-btns">
                  <button className="gp-pag-btn" disabled={currentPage===1} onClick={() => setPage(p=>p-1)}><IconChevLeft /></button>
                  {Array.from({length:totalPages}, (_,i) => (
                    <button key={i+1}
                      className={`gp-pag-btn ${currentPage===i+1?'active':''}`}
                      onClick={() => setPage(i+1)}>{i+1}</button>
                  ))}
                  <button className="gp-pag-btn" disabled={currentPage===totalPages} onClick={() => setPage(p=>p+1)}><IconChevRight /></button>
                </div>
              </div>
            </div>
          </div>

          {/* Repairs timeline (DYNAMIC) */}
          <div>
            <div className="gp-section-header">
              <h2 className="gp-section-title">Dernières Réparations</h2>
            </div>

            <div className="gp-repairs-list">
              {repairs.length === 0 && <p style={{ color:'#9ca3af', fontSize:'0.85rem' }}>Aucune réparation enregistrée.</p>}
              {repairs.slice(0, 3).map((r, i) => {
                const d = new Date(r.date_reparation);
                const day = d.getDate();
                const month = d.toLocaleDateString('fr-FR', { month:'short' }).toUpperCase();
                return (
                  <div key={r.id || i} className="repair-item">
                    <div className={`repair-bar green`} />
                    <div className="repair-date">
                      <span className={`repair-day`}>{day}</span>
                      <span className="repair-month">{month}</span>
                    </div>
                    <div className="repair-body">
                      <div>
                        <div className="repair-meta-label">N° Appareil</div>
                        <span className="repair-device-link">{getDsNum(r.datashow_id)}</span>
                      </div>
                      <div>
                        <div className="repair-meta-label">Description de la panne</div>
                        <p className="repair-desc">{r.description_panne}</p>
                      </div>
                      <div>
                        <div className="repair-meta-label">Action réalisée</div>
                        <div className="repair-action">
                          <IconCheckCircle />
                          {r.action_realisee || 'Intervention en cours'}
                        </div>
                      </div>
                      <button className="repair-link-btn" title="Voir détail" onClick={() => navigate('/admin/reparations')}><IconExternalLink /></button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="gp-history-link" onClick={() => navigate('/admin/reparations')} style={{ cursor:'pointer' }}>
              <span>Voir tout l'historique de maintenance</span>
            </div>
          </div>

        </div>

      {modalMode && (
        <DataShowModal 
          initialData={selectedDevice} 
          onClose={() => setModalMode(null)} 
          onSave={modalMode === 'add' ? handleAdd : handleEdit} 
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal 
          device={selectedDevice} 
          onClose={() => setShowDeleteModal(false)} 
          onDelete={handleDelete} 
        />
      )}

      {toast && (
        <div className={`gp-toast ${toast.type}`}>
          <IconCheckCircle />
          {toast.msg}
        </div>
      )}
    </div>
  </div>
);
}

import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';

/* ─── Icônes SVG inline ──────────────────────────────────── */
const Ico = {
  Search:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Bell:     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  User:     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Plus:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Cal:      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Clip:     <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>,
  Shield:   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
  Filter:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  More:     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>,
  ChevDown: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  Info:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  Check:    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  X:        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Trash:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>,
};

/* ─── Styles inline (auto-suffisant) ────────────────────── */
const S = {
  page:    { display:'flex', height:'100vh', width:'100%', fontFamily:"'Inter',sans-serif", overflow:'hidden', background:'#f4f6fb' },
  content: { flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 },

  /* topbar */
  topbar:  { background:'#fff', borderBottom:'1px solid #e5e7eb', padding:'0.75rem 2rem', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem', flexShrink:0 },
  searchWrap: { position:'relative', flex:1, maxWidth:420 },
  searchIcon: { position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#9ca3af', display:'flex', pointerEvents:'none' },
  searchInput: { width:'100%', padding:'0.6rem 1rem 0.6rem 2.5rem', border:'1.5px solid #e5e7eb', borderRadius:9, fontFamily:'inherit', fontSize:'0.85rem', color:'#374151', background:'#f9fafb', outline:'none' },
  topbarRight: { display:'flex', alignItems:'center', gap:'0.5rem' },
  topbarBtn:  { width:36, height:36, borderRadius:'50%', border:'1.5px solid #e5e7eb', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#6b7280', position:'relative' },
  notifDot:   { position:'absolute', top:5, right:5, width:8, height:8, background:'#ef4444', borderRadius:'50%', border:'2px solid #fff' },

  /* main scroll */
  main: { flex:1, overflowY:'auto', padding:'2rem 2.5rem 3rem', display:'flex', flexDirection:'column', gap:'1.8rem' },

  /* hero */
  hero:      { display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'2rem', flexWrap:'wrap' },
  pill:      { display:'inline-flex', padding:'0.3rem 0.85rem', background:'#eff6ff', color:'#1d4ed8', border:'1px solid #bfdbfe', borderRadius:20, fontSize:'0.68rem', fontWeight:800, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.7rem' },
  h1:        { fontFamily:"'Playfair Display',serif", fontSize:'2.1rem', fontWeight:800, color:'#111827', lineHeight:1.15, marginBottom:'0.6rem', maxWidth:480 },
  subtitle:  { fontSize:'0.88rem', color:'#6b7280', lineHeight:1.6, maxWidth:480 },
  btnGenHero: { display:'flex', alignItems:'center', gap:'0.55rem', padding:'0.9rem 1.5rem', background:'#1a2b6d', color:'#fff', border:'none', borderRadius:10, fontFamily:'inherit', fontSize:'0.92rem', fontWeight:700, cursor:'pointer', whiteSpace:'nowrap', lineHeight:1.35, textAlign:'center', minWidth:190 },

  /* stats */
  statsGrid: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.2rem' },
  statCard:  { background:'#fff', borderRadius:12, padding:'1.3rem 1.5rem', boxShadow:'0 1px 3px rgba(0,0,0,0.04),0 4px 12px rgba(0,0,0,0.06)', display:'flex', alignItems:'center', gap:'1rem' },
  statIcon:  (bg,color) => ({ width:46, height:46, borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, background:bg, color }),
  statLabel: { fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#9ca3af', marginBottom:4 },
  statVal:   { fontSize:'2rem', fontWeight:800, color:'#111827', lineHeight:1 },

  /* calendar card */
  calCard:   { background:'#fff', borderRadius:14, boxShadow:'0 1px 3px rgba(0,0,0,0.04),0 6px 20px rgba(0,0,0,0.07)' },
  calHeader: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.3rem 1.6rem 1.1rem', borderBottom:'1px solid #f3f4f6' },
  calTitle:  { fontFamily:"'Playfair Display',serif", fontSize:'1.25rem', fontWeight:700, color:'#111827' },
  calActions:{ display:'flex', gap:'0.4rem' },
  hdrBtn:    { width:32, height:32, borderRadius:7, border:'1.5px solid #e5e7eb', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#6b7280' },

  /* week row */
  weekRow:   (open) => ({
    display:'flex', alignItems:'center', gap:'1rem',
    padding:'1.1rem 1.6rem',
    borderBottom:'1px solid #f3f4f6',
    background:'#fff',
    opacity: open ? 1 : 0.55,
    cursor:'default',
  }),
  weekIcon:  (open) => ({ width:38, height:38, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, background: open ? '#f0f4ff' : '#f3f4f6', color: open ? '#1a2b6d' : '#9ca3af' }),
  weekInfo:  { flex:1, minWidth:0 },
  weekName:  (open) => ({ fontSize:'0.97rem', fontWeight:700, color: open ? '#111827' : '#6b7280', marginBottom:2 }),
  weekDesc:  { fontSize:'0.78rem', color:'#9ca3af', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' },
  badge:     (open) => ({ padding:'0.25rem 0.75rem', borderRadius:20, fontSize:'0.7rem', fontWeight:800, letterSpacing:'0.08em', textTransform:'uppercase', whiteSpace:'nowrap', border:'1px solid', background: open ? '#f0fdf4' : '#fef2f2', color: open ? '#16a34a' : '#dc2626', borderColor: open ? '#bbf7d0' : '#fecaca' }),

  /* toggle */
  toggleWrap: { position:'relative', width:48, height:26, flexShrink:0, cursor:'pointer' },
  toggleInput:{ opacity:0, width:0, height:0, position:'absolute' },

  /* load more */
  loadMore:  { textAlign:'center', padding:'1rem', borderTop:'1px solid #f3f4f6' },
  btnMore:   { background:'none', border:'none', fontFamily:'inherit', fontSize:'0.88rem', fontWeight:600, color:'#1d4ed8', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:'0.35rem' },

  /* info box */
  infoBox:   { display:'flex', gap:'0.85rem', background:'#f0f9ff', border:'1px solid #bae6fd', borderRadius:12, padding:'1.2rem 1.4rem' },
  infoIcon:  { color:'#0284c7', flexShrink:0, marginTop:1 },
  infoTitle: { fontSize:'0.88rem', fontWeight:700, color:'#1d4ed8', marginBottom:'0.35rem' },
  infoText:  { fontSize:'0.82rem', color:'#374151', lineHeight:1.65 },

  /* modal */
  overlay:   { position:'fixed', inset:0, background:'rgba(0,0,0,0.35)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999, padding:'1rem' },
  modal:     { background:'#fff', borderRadius:14, padding:'2rem', width:'100%', maxWidth:460, boxShadow:'0 20px 60px rgba(0,0,0,0.18)' },
  modalHdr:  { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' },
  modalTitle:{ fontFamily:"'Playfair Display',serif", fontSize:'1.2rem', fontWeight:800, color:'#111827' },
  modalClose:{ border:'none', background:'none', cursor:'pointer', color:'#9ca3af', display:'flex' },
  modalForm: { display:'flex', flexDirection:'column', gap:'1rem' },
  modalField:{ display:'flex', flexDirection:'column', gap:'0.4rem' },
  modalLabel:{ fontSize:'0.78rem', fontWeight:600, color:'#374151' },
  modalInput:{ padding:'0.7rem 0.9rem', border:'1.5px solid #e5e7eb', borderRadius:8, fontFamily:'inherit', fontSize:'0.88rem', color:'#374151', background:'#fafafa', outline:'none' },
  modalInfo: { background:'#fffbeb', border:'1px solid #fde68a', borderRadius:8, padding:'0.75rem 0.9rem', fontSize:'0.78rem', color:'#92400e', lineHeight:1.5 },
  modalBtns: { display:'flex', gap:'0.8rem', marginTop:'0.3rem' },
  btnAnn:    { flex:1, padding:'0.78rem', background:'transparent', color:'#6b7280', border:'1.5px solid #e5e7eb', borderRadius:8, fontFamily:'inherit', fontSize:'0.9rem', fontWeight:500, cursor:'pointer' },
  btnGen:    { flex:1, padding:'0.78rem', background:'#1a2b6d', color:'#fff', border:'none', borderRadius:8, fontFamily:'inherit', fontSize:'0.9rem', fontWeight:600, cursor:'pointer' },

  /* toast */
  toast:     { position:'fixed', bottom:'1.5rem', right:'1.5rem', background:'#111827', color:'#fff', padding:'0.85rem 1.2rem', borderRadius:10, fontSize:'0.85rem', fontWeight:500, display:'flex', alignItems:'center', gap:'0.6rem', boxShadow:'0 10px 30px rgba(0,0,0,0.25)', zIndex:10000 },
};

/* ─── Toggle Switch ──────────────────────────────────────── */
function Toggle({ checked, onChange }) {
  return (
    <div style={S.toggleWrap} onClick={onChange} title={checked ? 'Fermer la semaine' : 'Ouvrir la semaine'}>
      <div style={{
        position:'absolute', inset:0, borderRadius:13,
        background: checked ? '#1d4ed8' : '#d1d5db',
        transition:'background 0.25s',
      }} />
      <div style={{
        position:'absolute', width:20, height:20, borderRadius:'50%',
        background:'#fff', top:3, left: checked ? 25 : 3,
        transition:'left 0.25s',
        boxShadow:'0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </div>
  );
}

/* ─── Modal ──────────────────────────────────────────────── */
function GenerateModal({ onClose, onGenerate }) {
  const nextMon = new Date();
  nextMon.setDate(nextMon.getDate() + ((1 + 7 - nextMon.getDay()) % 7 || 7));
  const [startDate, setStartDate] = useState(nextMon.toISOString().split('T')[0]);
  const [desc, setDesc]           = useState('');

  const handleGen = () => {
    if (!startDate) return;
    onGenerate({ date_lundi: startDate });
    onClose();
  };

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>
        <div style={S.modalHdr}>
          <span style={S.modalTitle}>Générer la semaine suivante</span>
          <button style={S.modalClose} onClick={onClose}>{Ico.X}</button>
        </div>
        <div style={S.modalForm}>
          <div style={S.modalField}>
            <label style={S.modalLabel}>Date de début (lundi)</label>
            <input type="date" style={S.modalInput} value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div style={S.modalField}>
            <label style={S.modalLabel}>Description</label>
            <input type="text" style={S.modalInput} placeholder="Ex : Semaine de révision..." value={desc} onChange={e => setDesc(e.target.value)} />
          </div>
          <div style={S.modalInfo}>⚠️ La semaine générée sera <strong>fermée</strong> par défaut.</div>
          <div style={S.modalBtns}>
            <button style={S.btnAnn} onClick={onClose}>Annuler</button>
            <button style={S.btnGen} onClick={handleGen}>Générer la semaine</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────── */
export default function GestionSemainesPage() {
  const [weeks,     setWeeks]     = useState([]);
  const [search,    setSearch]    = useState('');
  const [showAll,   setShowAll]   = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [toast,     setToast]     = useState('');

  const fetchWeeks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/semaines`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setWeeks(data);
      }
    } catch (err) {
      console.error("Erreur fetch semaines:", err);
    }
  };

  useEffect(() => {
    fetchWeeks();
  }, []);

  const nbOuvertes = weeks.filter(w => w.est_ouverte).length;

  const pool = showAll ? weeks : weeks.slice(0, 4);
  const rows = search.trim()
    ? pool.filter(w => w.date_lundi.includes(search))
    : pool;

  const fireToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const toggle = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const nextStatus = !currentStatus;
      const res = await fetch(`${API_BASE_URL}/semaines/${id}/toggle?est_ouverte=${nextStatus}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchWeeks();
        fireToast(nextStatus ? '✅ Semaine ouverte' : '🔒 Semaine fermée');
      }
    } catch (err) {
      console.error("Erreur toggle semaine:", err);
    }
  };

  const generate = async ({ date_lundi }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/semaines`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ date_lundi, est_ouverte: false })
      });
      if (res.ok) {
        fetchWeeks();
        fireToast('📅 Nouvelle semaine générée — fermée par défaut');
      } else {
        const err = await res.json();
        fireToast(`❌ Erreur: ${err.detail || 'Inconnue'}`);
      }
    } catch (err) {
      console.error("Erreur generate semaine:", err);
    }
  };

  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/semaines/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchWeeks();
        fireToast('🗑️ Semaine supprimée');
      } else {
        const errorData = await res.json();
        fireToast(`❌ Erreur: ${errorData.detail || 'Suppression impossible'}`);
      }
    } catch (err) {
      console.error("Erreur delete semaine:", err);
      fireToast('❌ Erreur de connexion au serveur');
    }
    setDeleteConfirm(null);
  };

  const fmtDate = (iso) => {
    const d = new Date(iso);
    return `Semaine du Lundi ${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;
  };

  return (
    <div style={S.content}>
        {/* ── Top bar ── */}
        <div style={S.topbar}>
          <div style={S.searchWrap}>
            <span style={S.searchIcon}>{Ico.Search}</span>
            <input style={S.searchInput} placeholder="Rechercher une semaine, une salle..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={S.topbarRight}>
            <button style={S.topbarBtn} type="button">
              {Ico.Bell}
              <span style={S.notifDot} />
            </button>
            <button style={S.topbarBtn} type="button">{Ico.User}</button>
          </div>
        </div>

        {/* ── Main ── */}
        <div style={S.main}>

          {/* Hero */}
          <div style={S.hero}>
            <div>
              <div style={S.pill}>Gestion Planning</div>
              <h1 style={S.h1}>Ouverture des Semaines<br/>de Réservation</h1>
              <p style={S.subtitle}>
                Activez ou désactivez les semaines pour autoriser ou bloquer les réservations
                des professeurs. Contrôlez l'accessibilité temporelle des ressources de l'institut.
              </p>
            </div>
            <button id="btn-generate-semaine" style={S.btnGenHero} type="button" onClick={() => setShowModal(true)}>
              {Ico.Plus} Générer la semaine suivante
            </button>
          </div>

          {/* Stats */}
          <div style={S.statsGrid}>
            {[
              { label:'Total des semaines',      val: String(weeks.length).padStart(2,'0'),  icon: Ico.Cal,    bg:'#f0f4ff', clr:'#1a2b6d' },
              { label:'Semaines ouvertes',       val: String(nbOuvertes).padStart(2,'0'),     icon: Ico.Check,  bg:'#f0fdf4', clr:'#16a34a' },
              { label:'Semaines fermées',        val: String(weeks.length - nbOuvertes).padStart(2,'0'), icon: Ico.X,     bg:'#fef2f2', clr:'#dc2626' },
            ].map(({ label, val, icon, bg, clr }) => (
              <div key={label} style={S.statCard}>
                <div style={S.statIcon(bg, clr)}>{icon}</div>
                <div>
                  <div style={S.statLabel}>{label}</div>
                  <div style={S.statVal}>{val}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Calendar */}
          <div style={S.calCard}>
            <div style={S.calHeader}>
              <span style={S.calTitle}>Calendrier des Semaines</span>
              <div style={S.calActions}>
                <button style={S.hdrBtn} type="button" title="Filtrer">{Ico.Filter}</button>
                <button style={S.hdrBtn} type="button" title="Plus">{Ico.More}</button>
              </div>
            </div>

            {/* Week rows */}
            {rows.length === 0 && (
              <div style={{ padding:'2rem', textAlign:'center', color:'#9ca3af', fontSize:'0.88rem' }}>
                Aucune semaine trouvée pour «&nbsp;{search}&nbsp;»
              </div>
            )}

            {rows.map((w, idx) => (
              <div key={w.id} style={{ ...S.weekRow(w.est_ouverte), borderBottom: idx === rows.length - 1 ? 'none' : '1px solid #f3f4f6' }}>
                <div style={S.weekIcon(w.est_ouverte)}>{Ico.Cal}</div>
                <div style={S.weekInfo}>
                  <div style={S.weekName(w.est_ouverte)}>{fmtDate(w.date_lundi)}</div>
                  <div style={S.weekDesc}>{w.est_ouverte ? 'Ouverte aux réservations' : 'Fermée aux réservations'}</div>
                </div>
                <span style={S.badge(w.est_ouverte)}>{w.est_ouverte ? 'Ouverte' : 'Fermée'}</span>
                <Toggle checked={w.est_ouverte} onChange={() => toggle(w.id, w.est_ouverte)} />
                <button 
                  style={{ ...S.hdrBtn, marginLeft: '0.5rem', borderColor: '#fee2e2', color: '#ef4444', position: 'relative', zIndex: 5 }} 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setDeleteConfirm(w.id); }}
                  title="Supprimer la semaine"
                >
                  {Ico.Trash}
                </button>
              </div>
            ))}

            {/* Load more */}
            {!showAll && !search.trim() && (
              <div style={S.loadMore}>
                <button id="btn-load-more-weeks" style={S.btnMore} type="button" onClick={() => setShowAll(true)}>
                  Charger plus de semaines {Ico.ChevDown}
                </button>
              </div>
            )}
          </div>

          {/* Confirmation Overlay */}
          {deleteConfirm && (
            <div style={S.overlay} onClick={() => setDeleteConfirm(null)}>
              <div style={S.modal} onClick={e => e.stopPropagation()}>
                <div style={S.modalHdr}>
                  <span style={S.modalTitle}>Confirmer la suppression</span>
                  <button style={S.modalClose} type="button" onClick={() => setDeleteConfirm(null)}>{Ico.X}</button>
                </div>
                <p style={{ fontSize:'0.9rem', color:'#374151', marginBottom:'1.5rem', lineHeight:1.5 }}>
                  Êtes-vous sûr de vouloir supprimer cette semaine ? <br/>
                  <strong style={{ color: '#ef4444' }}>Toutes les réservations associées seront également supprimées.</strong>
                </p>
                <div style={S.modalBtns}>
                  <button style={S.btnAnn} type="button" onClick={() => setDeleteConfirm(null)}>Annuler</button>
                  <button style={{ ...S.btnGen, background: '#ef4444' }} type="button" onClick={() => handleDelete(deleteConfirm)}>
                    Supprimer définitivement
                  </button>
                </div>
              </div>
            </div>
          )}


          {/* Info box */}
          <div style={S.infoBox}>
            <div style={S.infoIcon}>{Ico.Info}</div>
            <div>
              <div style={S.infoTitle}>Règle d'automatisation</div>
              <p style={S.infoText}>
                Par défaut, les nouvelles semaines générées sont <strong>fermées</strong>.
                Vous devez les activer manuellement pour permettre aux professeurs de visualiser
                les créneaux disponibles. Les réservations passées restent archivées et consultables.
              </p>
            </div>
          </div>

        </div>

      {showModal && <GenerateModal onClose={() => setShowModal(false)} onGenerate={generate} />}

      {toast && (
        <div style={S.toast}>
          {Ico.Check}
          {toast}
        </div>
      )}
    </div>
  );
}

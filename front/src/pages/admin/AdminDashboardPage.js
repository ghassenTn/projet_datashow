import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';

/* ─── Icônes ─────────────────────────────────────────────── */
const Ico = {
  Bell:     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  User:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Building: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22V12h6v10M2 22h20"/><rect x="8" y="6" width="2" height="2"/><rect x="14" y="6" width="2" height="2"/><rect x="8" y="11" width="2" height="2"/><rect x="14" y="11" width="2" height="2"/></svg>,
  Monitor:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  Alert:    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Clock:    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Tool:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  Calendar: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  ArrowRight: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
};

/* ─── Styles ─────────────────────────────────────────────── */
const S = {
  page:    { display:'flex', height:'100vh', width:'100%', fontFamily:"'Inter',sans-serif", overflow:'hidden', background:'#f4f6fb' },
  content: { flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 },
  topbar:  { background:'#fff', borderBottom:'1px solid #e5e7eb', padding:'0.75rem 2rem', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem', flexShrink:0 },
  topbarRight: { display:'flex', alignItems:'center', gap:'0.5rem' },
  topbarBtn:  { width:36, height:36, borderRadius:'50%', border:'1.5px solid #e5e7eb', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#6b7280', position:'relative' },
  notifDot:   { position:'absolute', top:5, right:5, width:8, height:8, background:'#ef4444', borderRadius:'50%', border:'2px solid #fff' },
  main: { flex:1, overflowY:'auto', padding:'2rem 2.5rem 3rem', display:'flex', flexDirection:'column', gap:'2rem' },
  
  hero:      { display:'flex', alignItems:'center', justifyContent:'space-between', gap:'2rem', flexWrap:'wrap' },
  h1:        { fontFamily:"'Playfair Display',serif", fontSize:'2.2rem', fontWeight:800, color:'#111827', lineHeight:1.2, marginBottom:'0.3rem' },
  subtitle:  { fontSize:'0.9rem', color:'#6b7280' },
  
  statsGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:'1.5rem' },
  statCard:  { background:'#fff', borderRadius:16, padding:'1.5rem', boxShadow:'0 4px 15px rgba(0,0,0,0.03)', display:'flex', alignItems:'center', gap:'1.2rem', transition:'transform 0.2s', cursor:'default' },
  statIcon:  (bg, color) => ({ width:52, height:52, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', background:bg, color:color, flexShrink:0 }),
  statLabel: { fontSize:'0.8rem', fontWeight:600, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.3rem' },
  statVal:   { fontSize:'2.2rem', fontWeight:800, color:'#111827', lineHeight:1, marginBottom:'0.4rem' },
  statDesc:  { fontSize:'0.75rem', fontWeight:500, color:'#9ca3af' },

  card:      { background:'#fff', borderRadius:16, boxShadow:'0 4px 15px rgba(0,0,0,0.03)', overflow:'hidden' },
  cardHdr:   { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.5rem', borderBottom:'1px solid #f3f4f6' },
  cardTitle: { fontFamily:"'Playfair Display',serif", fontSize:'1.3rem', fontWeight:700, color:'#111827' },
  cardLink:  { display:'flex', alignItems:'center', gap:'0.4rem', fontSize:'0.85rem', fontWeight:600, color:'#1d4ed8', textDecoration:'none', cursor:'pointer' },
  table:     { width:'100%', borderCollapse:'collapse', textAlign:'left' },
  th:        { padding:'1rem 1.5rem', fontSize:'0.75rem', fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.05em', borderBottom:'1px solid #f3f4f6', background:'#fafafa' },
  td:        { padding:'1.1rem 1.5rem', fontSize:'0.9rem', color:'#374151', borderBottom:'1px solid #f3f4f6' },
  trHover:   { transition:'background 0.15s' },
  badge:     (status) => {
    let bg = '#f3f4f6', clr = '#374151', border = '#e5e7eb';
    if (status === 'Confirmée') { bg = '#f0fdf4'; clr = '#16a34a'; border = '#bbf7d0'; }
    if (status === 'En cours')  { bg = '#eff6ff'; clr = '#1d4ed8'; border = '#bfdbfe'; }
    if (status === 'En attente'){ bg = '#fffbeb'; clr = '#d97706'; border = '#fde68a'; }
    return { padding:'0.35rem 0.8rem', borderRadius:20, fontSize:'0.75rem', fontWeight:700, border:`1px solid ${border}`, background:bg, color:clr, whiteSpace:'nowrap' };
  }
};

/* ─── Composant Principal ────────────────────────────────── */
export default function AdminDashboardPage({ activePage, onNavigate, onLogout }) {
  const [stats, setStats] = useState({
    professeurs: 0, seances: 0, salles: 0, datashows: 0, reparations: 0, reservations: 0, reclamations: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/stats/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Professeurs', val: stats.professeurs, desc: 'Inscrits', color: '#3b82f6', bg: '#eff6ff', icon: 'User' },
    { label: 'Séances',     val: stats.seances,     desc: 'Définies', color: '#8b5cf6', bg: '#f5f3ff', icon: 'Clock' },
    { label: 'Salles',      val: stats.salles,      desc: 'Salles de cours', color: '#10b981', bg: '#ecfdf5', icon: 'Building' },
    { label: 'Data Shows',  val: stats.datashows,   desc: 'Parc IPSAS', color: '#f59e0b', bg: '#fffbeb', icon: 'Monitor' },
    { label: 'Réparations', val: stats.reparations, desc: 'Actions', color: '#ec4899', bg: '#fdf2f8', icon: 'Tool' },
    { label: 'Réservations',val: stats.reservations,desc: 'Historique', color: '#6366f1', bg: '#eef2ff', icon: 'Calendar' },
    { label: 'Réclamations',val: stats.reclamations,desc: 'Signalements', color: '#ef4444', bg: '#fef2f2', icon: 'Alert' },
  ];

  return (
    <div style={S.content}>
      <div style={S.topbar}>
        <div style={{ flex: 1 }} /> {/* Spacer to keep right elements on the right */}
        <div style={S.topbarRight}>
          <button style={S.topbarBtn}>
            {Ico.Bell}
            <span style={S.notifDot} />
          </button>
          <button style={S.topbarBtn} onClick={() => onNavigate('admin-users')}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
        </div>
      </div>

      <div style={S.main}>
        <div style={S.hero}>
          <div>
            <h1 style={S.h1}>Bonjour, {localStorage.getItem('userPrenom')} {localStorage.getItem('userNom')}</h1>
            <p style={S.subtitle}>Voici un résumé global de l'IPSAS aujourd'hui.</p>
          </div>
        </div>

        <div style={S.statsGrid}>
          {statCards.map((stat, i) => (
            <div key={i} style={S.statCard} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={S.statIcon(stat.bg, stat.color)}>
                {Ico[stat.icon]}
              </div>
              <div>
                <div style={S.statLabel}>{stat.label}</div>
                <div style={S.statVal}>{stat.val}</div>
                <div style={S.statDesc}>{stat.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

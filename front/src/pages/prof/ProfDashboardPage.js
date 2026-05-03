import React, { useState, useEffect } from 'react';

/* ─── Icônes ─────────────────────────────────────────────── */
const Ico = {
  Bell:      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  User:      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Timetable: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
  Check:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Clock:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Alert:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  ArrowRight:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  XCircle:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
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
  statLabel: { fontSize:'0.75rem', fontWeight:600, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.3rem' },
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
};

/* ─── Composant Principal ────────────────────────────────── */
export default function ProfDashboardPage() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    activeRes: 0,
    cancelledRes: 0,
    pendingRec: 0,
    treatedRec: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const headers = { 'Authorization': `Bearer ${token}` };

        const [meRes, resRes, recRes] = await Promise.all([
          fetch('http://127.0.0.1:8000/utilisateurs/me', { headers }),
          fetch('http://127.0.0.1:8000/reservations', { headers }),
          fetch('http://127.0.0.1:8000/reclamations/mes-reclamations', { headers })
        ]);

        if (meRes.ok) setUser(await meRes.json());
        
        if (resRes.ok && recRes.ok) {
          const reservations = await resRes.json();
          const reclamations = await recRes.json();

          setStats({
            activeRes: reservations.filter(r => r.etat === 1).length,
            cancelledRes: reservations.filter(r => r.etat === 0).length,
            pendingRec: reclamations.filter(r => r.etat === 'en_attente').length,
            treatedRec: reclamations.filter(r => r.etat === 'traitee').length
          });
        }
      } catch (err) {
        console.error("Erreur lors du chargement des stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const kpis = [
    { label: 'Réservations actives', val: stats.activeRes, desc: 'Prêtes à l\'emploi', color: '#10b981', bg: '#ecfdf5', icon: 'Check' },
    { label: 'Réservations annulées', val: stats.cancelledRes, desc: 'Historique récent', color: '#6b7280', bg: '#f3f4f6', icon: 'XCircle' },
    { label: 'Réclamations en attente', val: stats.pendingRec, desc: 'En cours de traitement', color: '#f59e0b', bg: '#fffbeb', icon: 'Clock' },
    { label: 'Réclamations traitées', val: stats.treatedRec, desc: 'Problèmes résolus', color: '#8b5cf6', bg: '#f5f3ff', icon: 'Alert' },
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
          <button style={S.topbarBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
        </div>
      </div>

      <div style={S.main}>
        {/* Hero */}
        <div style={S.hero}>
          <div>
            <h1 style={S.h1}>Bonjour, {user ? `Pr. ${user.nom}` : 'Professeur'}</h1>
            <p style={S.subtitle}>Bienvenue sur votre espace enseignant. Voici l'état de vos services.</p>
          </div>
        </div>

        {/* KPI Grid */}
        <div style={S.statsGrid}>
          {kpis.map((stat, i) => (
            <div key={i} style={S.statCard} 
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'} 
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={S.statIcon(stat.bg, stat.color)}>
                {Ico[stat.icon]}
              </div>
              <div>
                <div style={S.statLabel}>{stat.label}</div>
                <div style={S.statVal}>{loading ? '...' : stat.val}</div>
                <div style={S.statDesc}>{stat.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


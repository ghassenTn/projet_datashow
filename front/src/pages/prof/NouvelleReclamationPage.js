import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/prof/NouvelleReclamationPage.css';

/* ── Icons ───────────────────────────────────────────────── */
const IconArrowLeft   = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>);
const IconChevron     = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>);
const IconSend        = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>);
const IconInfo        = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>);
const IconUpload      = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>);
const IconCheck       = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>);
const IconAlertTriangle = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>);

/* ── Static data ─────────────────────────────────────────── */
const DATASHOWS = ['DataShow DS-01', 'DataShow DS-02', 'DataShow DS-03', 'Projecteur PR-01', 'Projecteur PR-02'];
const TYPES     = ['Panne matérielle', 'Problème logiciel', "Absence du matériel", "Qualité d'image médiocre", 'Câble ou connectique manquant', 'Autre'];
const RESERVATIONS = ['RES-001 — 05/05/2026 Salle 101 (S1)', 'RES-002 — 06/05/2026 Amphi A (S3)', 'RES-003 — 07/05/2026 Labo 3 (S2)', 'Aucune réservation associée'];
const MAX_CHARS = 500;

/* ── Component ───────────────────────────────────────────── */
export default function NouvelleReclamationPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [datashows, setDatashows] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [datashow, setDatashow]       = useState('');
  const [type, setType]               = useState('');
  const [reservation, setReservation] = useState('');
  const [urgence, setUrgence]         = useState('moyen');
  const [description, setDescription] = useState('');
  const [fileName, setFileName]       = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [dsRes, resRes] = await Promise.all([
          fetch('http://127.0.0.1:8000/datashows', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://127.0.0.1:8000/reservations', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        if (dsRes.ok) setDatashows(await dsRes.json());
        if (resRes.ok) setReservations(await resRes.json());
      } catch (err) {
        console.error("Erreur chargement données:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const isValid = datashow && type && description.trim().length >= 20;

  const handleFile = (e) => {
    if (e.target.files[0]) setFileName(e.target.files[0].name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      const token = localStorage.getItem('token');
      const payload = {
        date_reclamation: new Date().toISOString().split('T')[0],
        description: description,
        type_probleme: type,
        urgence: urgence,
        datashow_id: datashow ? parseInt(datashow, 10) : null,
        reservation_id: reservation ? parseInt(reservation, 10) : null
      };
      
      const res = await fetch('http://127.0.0.1:8000/reclamations/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const error = await res.json();
        alert(`Erreur: ${error.detail || 'Impossible de soumettre la réclamation'}`);
      }
    } catch (err) {
      console.error("Erreur submission:", err);
      alert("Erreur de connexion au serveur");
    }
  };

  if (submitted) {
    return (
      <main className="nr-main">
        <div className="nr-card nr-success">
            <div className="success-icon"><IconCheck /></div>
            <h2 className="success-title">Réclamation soumise !</h2>
            <p className="success-sub">
              Votre réclamation a été enregistrée avec succès. Notre équipe technique
              la traitera dans les meilleurs délais.
            </p>
            <div className="success-btns">
              <button className="btn-success-primary"
                onClick={() => navigate('/prof/reclamations')}>
                Voir mes réclamations
              </button>
              <button className="btn-success-secondary"
                onClick={() => { setSubmitted(false); setDatashow(''); setType(''); setDescription(''); setFileName(''); }}>
                Nouvelle réclamation
              </button>
            </div>
          </div>
        </main>
    );
  }

  return (
    <div className="nr-page-container" style={{display:'flex', flexDirection:'column', width:'100%'}}>
      <main className="nr-main">
        {/* Header */}
        <div className="nr-header">
          <button className="btn-back" onClick={() => navigate('/prof/reclamations')} aria-label="Retour">
            <IconArrowLeft />
          </button>
          <div className="nr-title-block">
            <h1 className="nr-page-title">Soumettre une réclamation</h1>
            <p className="nr-page-subtitle">Signalez un problème sur un équipement Data Show.</p>
          </div>
        </div>

        <form className="nr-form-grid" onSubmit={handleSubmit} noValidate>
          {/* LEFT — Main form */}
          <div className="nr-card">
            <div className="nr-card-title">
              <IconAlertTriangle /> Informations de la réclamation
            </div>

            <div className="nr-form">
              {/* DataShow + Type */}
              <div className="field-row">
                <div className="field-group">
                  <label className="field-label" htmlFor="nr-datashow">
                    Data Show concerné <span className="field-required">*</span>
                  </label>
                  <div className="nr-select-wrap">
                    <select id="nr-datashow" className="nr-select" value={datashow}
                      onChange={e => setDatashow(e.target.value)} required>
                      <option value="">Sélectionner un appareil</option>
                      {datashows.map(d => <option key={d.id} value={d.id}>{d.numero_unique}</option>)}
                    </select>
                    <span className="nr-chevron"><IconChevron /></span>
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="nr-type">
                    Type de problème <span className="field-required">*</span>
                  </label>
                  <div className="nr-select-wrap">
                    <select id="nr-type" className="nr-select" value={type}
                      onChange={e => setType(e.target.value)} required>
                      <option value="">Sélectionner un type</option>
                      {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <span className="nr-chevron"><IconChevron /></span>
                  </div>
                </div>
              </div>

              {/* Réservation associée */}
              <div className="field-group">
                <label className="field-label" htmlFor="nr-reservation">
                  Réservation associée <span style={{color:'#9ca3af', fontWeight:400}}>(optionnel)</span>
                </label>
                <div className="nr-select-wrap">
                  <select id="nr-reservation" className="nr-select" value={reservation}
                    onChange={e => setReservation(e.target.value)}>
                    <option value="">Lier à une réservation</option>
                    {reservations.map(r => (
                      <option key={r.id} value={r.id}>
                        RES-{r.id} — {new Date(r.date_reservation).toLocaleDateString()} {r.salle_id} ({r.seance_id})
                      </option>
                    ))}
                  </select>
                  <span className="nr-chevron"><IconChevron /></span>
                </div>
              </div>

              {/* Niveau d'urgence */}
              <div className="field-group">
                <label className="field-label">Niveau d'urgence <span className="field-required">*</span></label>
                <div className="urgency-group">
                  {[
                    { val: 'faible',  label: '🟢 Faible' },
                    { val: 'moyen',   label: '🟡 Moyen' },
                    { val: 'urgent',  label: '🔴 Urgent' },
                  ].map(({ val, label }) => (
                    <label className="urgency-option" key={val}>
                      <input type="radio" name="urgence" value={val}
                        checked={urgence === val}
                        onChange={() => setUrgence(val)} />
                      <span className={`urgency-label ${val}`}>{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="field-group">
                <label className="field-label" htmlFor="nr-desc">
                  Description du problème <span className="field-required">*</span>
                </label>
                <textarea
                  id="nr-desc"
                  className="nr-textarea"
                  placeholder="Décrivez le problème rencontré avec le plus de détails possible (minimum 20 caractères)..."
                  value={description}
                  onChange={e => setDescription(e.target.value.slice(0, MAX_CHARS))}
                  rows={5}
                />
                <span className={`char-count ${description.length > MAX_CHARS * 0.9 ? 'near-limit' : ''}`}>
                  {description.length} / {MAX_CHARS}
                </span>
              </div>


            </div>
          </div>

          {/* RIGHT — Side panel */}
          <div className="nr-side">
            {/* Info */}
            <div className="info-box">
              <div className="info-box-title"><IconInfo /> À savoir</div>
              <ul>
                <li>Les réclamations urgentes sont traitées sous 24h.</li>
                <li>La description doit être précise et détaillée.</li>
              </ul>
            </div>

            {/* Submit */}
            <div className="submit-card">
              <button
                type="submit"
                id="btn-submit-reclamation"
                className="btn-submit-rec"
                disabled={!isValid}
              >
                <IconSend />
                Soumettre la réclamation
              </button>
              <button type="button" className="btn-cancel-rec"
                onClick={() => navigate('/prof/reclamations')}>
                Annuler
              </button>

              {!isValid && description.trim().length < 20 && description.length > 0 && (
                <p style={{fontSize:'0.74rem', color:'#d97706', marginTop:'0.7rem', textAlign:'center'}}>
                  ⚠️ La description doit contenir au moins 20 caractères.
                </p>
              )}
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

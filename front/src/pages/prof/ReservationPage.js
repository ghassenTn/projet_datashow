import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';
import '../../assets/css/prof/ReservationPage.css';

/* ── Constants & Helpers ─────────────────────────────────────── */

const JOURS_FR = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

const BACKEND_TO_JOUR = {
  'Lundi': 'Lundi',
  'Mardi': 'Mardi',
  'Mercredi': 'Mercredi',
  'Jeudi': 'Jeudi',
  'Vendredi': 'Vendredi',
  'Samedi': 'Samedi',
};

/* ── SVG Icons ─────────────────────────────────────────── */

const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconChevron = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconInfo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

/* ── Component ──────────────────────────────────────────── */

export default function ReservationPage() {
  const navigate = useNavigate();

  const [date, setDate]               = useState('');
  const [rattrapage, setRattrapage]   = useState(false);
  const [seance, setSeance]           = useState('');
  const [salle, setSalle]             = useState('');
  const [datashow, setDatashow]       = useState('');
  
  const [seances, setSeances]         = useState([]);
  const [salles, setSalles]           = useState([]);
  const [datashows, setDatashows]     = useState([]);
  const [mySchedule, setMySchedule]   = useState({});
  const [showWarning, setShowWarning] = useState(false);
  const [weekStatusError, setWeekStatusError] = useState('');
  const [loading, setLoading]         = useState(true);

  const token = localStorage.getItem('token');

  const [semaines, setSemaines]       = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      // 1. Fetch Seances
      const resSeances = await fetch(`${API_BASE_URL}/seances`, { headers });
      const dataSeances = await resSeances.json();
      setSeances(dataSeances.sort((a, b) => a.id.localeCompare(b.id)));

      // 2. Fetch Salles
      const resSalles = await fetch(`${API_BASE_URL}/salles`, { headers });
      const dataSalles = await resSalles.json();
      setSalles(dataSalles);

      // 3. Fetch DataShows
      const resDS = await fetch(`${API_BASE_URL}/datashows`, { headers });
      const dataDS = await resDS.json();
      setDatashows(dataDS);

      // 4. Fetch Semaines
      const resSem = await fetch(`${API_BASE_URL}/semaines`, { headers });
      const dataSem = await resSem.json();
      setSemaines(dataSem);

      // 5. Fetch My Timetable
      const resEmploi = await fetch(`${API_BASE_URL}/emplois/me`, { headers });
      const dataEmploi = await resEmploi.json();
      
      const scheduleMap = {};
      dataEmploi.forEach(item => {
        if (!scheduleMap[item.jour_de_la_semaine]) scheduleMap[item.jour_de_la_semaine] = {};
        scheduleMap[item.jour_de_la_semaine][item.seance_id] = item.salle_id;
      });
      setMySchedule(scheduleMap);

    } catch (err) {
      console.error("Erreur chargement données:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Logic to find matching semaine object for a given date
  const findMatchingSemaine = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    
    // Find the Monday of that week
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);

    return semaines.find(s => {
      const sDate = new Date(s.date_lundi);
      sDate.setHours(0, 0, 0, 0);
      return sDate.getTime() === monday.getTime();
    });
  };

  // Logic to auto-fill based on datetime
  const handleDateChange = (val) => {
    setDate(val);
    setWeekStatusError('');
    if (!val) return;

    const matchingSemaine = findMatchingSemaine(val);
    if (!matchingSemaine) {
      setWeekStatusError("Aucune semaine de réservation n'est définie pour cette date.");
    } else if (!matchingSemaine.est_ouverte) {
      setWeekStatusError("Les réservations sont fermées pour cette semaine.");
    }

    const d = new Date(val);
    const dayName = JOURS_FR[d.getDay()]; // e.g. "Lundi"
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const currentTimeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;

    // Find matching seance
    const foundSeance = seances.find(s => {
      return currentTimeStr >= s.heure_debut && currentTimeStr <= s.heure_fin;
    });

    if (foundSeance) {
      setSeance(foundSeance.id);
      
      // Check in my schedule
      const scheduledSalle = mySchedule[dayName] ? mySchedule[dayName][foundSeance.id] : null;
      if (scheduledSalle) {
        setSalle(scheduledSalle);
        setRattrapage(false);
        // Trigger warning if needed
        const sObj = salles.find(sl => sl.numero === scheduledSalle);
        setShowWarning(sObj?.equipee_tv || sObj?.equipee_datashow || false);
      } else {
        setSalle('');
        setRattrapage(true);
      }
    } else {
      setSeance('');
      setSalle('');
      setRattrapage(true);
    }
  };

  const handleSalleChange = (val) => {
    setSalle(val);
    const sObj = salles.find(sl => sl.numero === val);
    setShowWarning(sObj?.equipee_tv || sObj?.equipee_datashow || false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !seance || !salle || !datashow) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const matchingSemaine = findMatchingSemaine(date);
    if (!matchingSemaine) {
      alert("Aucune semaine de réservation n'est définie pour cette date.");
      return;
    }
    if (!matchingSemaine.est_ouverte) {
      alert("Les réservations sont fermées pour cette semaine.");
      return;
    }

    try {
      const payload = {
        date_reservation: date.split('T')[0],
        seance_id: seance,
        salle_id: salle,
        datashow_id: datashows.find(d => d.numero_unique === datashow)?.id || parseInt(datashow),
        semaine_id: matchingSemaine.id,
        est_hors_emploi: rattrapage
      };

      const res = await fetch(`${API_BASE_URL}/reservations`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("Réservation effectuée avec succès !");
        navigate('/prof/mes-reservations');
      } else {
        const errData = await res.json();
        alert(`Erreur : ${errData.detail || "Impossible d'effectuer la réservation"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Une erreur est survenue lors de la connexion au serveur.");
    }
  };

  if (loading) {
    return (
      <main className="res-main">Chargement...</main>
    );
  }

  return (
    <div className="res-page-container" style={{display:'flex', flexDirection:'column', width:'100%'}}>
      <main className="res-main">

        <h1 className="res-page-title">Réserver un Data Show</h1>
        <p className="res-page-subtitle">
          Veuillez remplir les informations ci-dessous pour effectuer votre demande.
        </p>

        <div className="res-card">
          <form className="res-form" onSubmit={handleSubmit} noValidate>

            {/* Date + Heure */}
            <div>
              <label className="field-label" htmlFor="res-date">
                Date et Heure de Réservation
              </label>
              <div className="date-input-wrap">
                <span className="date-input-icon"><IconCalendar /></span>
                <input
                  id="res-date"
                  type="datetime-local"
                  className="date-input"
                  value={date}
                  onChange={(e) => handleDateChange(e.target.value)}
                />
              </div>
            </div>

            {/* Toggle Rattrapage */}
            <div className="toggle-row">
              <span className="toggle-label">
                Réservation hors emploi du temps (Rattrapage)
              </span>
              <div className="toggle-right">
                <label className="toggle-switch" htmlFor="toggle-rattrapage">
                  <input
                    id="toggle-rattrapage"
                    type="checkbox"
                    checked={rattrapage}
                    onChange={(e) => setRattrapage(e.target.checked)}
                  />
                  <span className="toggle-track" />
                  <span className="toggle-thumb" />
                </label>
                <span className="toggle-state-text">
                  {rattrapage ? 'Oui' : 'Non'}
                </span>
              </div>
            </div>

            {/* Séance + Salle */}
            <div className="two-col">
              <div>
                <label className="field-label" htmlFor="res-seance">Séance</label>
                <div className="select-wrap">
                  <select
                    id="res-seance"
                    className="res-select"
                    value={seance}
                    onChange={(e) => setSeance(e.target.value)}
                  >
                    <option value="">Sélectionner une séance</option>
                    {seances.map(s => (
                      <option key={s.id} value={s.id}>{s.id} ({s.heure_debut.substring(0,5)} - {s.heure_fin.substring(0,5)})</option>
                    ))}
                  </select>
                  <span className="select-chevron"><IconChevron /></span>
                </div>
              </div>

              <div>
                <label className="field-label" htmlFor="res-salle">Salle</label>
                <div className="select-wrap">
                  <select
                    id="res-salle"
                    className="res-select"
                    value={salle}
                    onChange={(e) => handleSalleChange(e.target.value)}
                  >
                    <option value="">Sélectionner une salle</option>
                    {salles.map(s => (
                      <option key={s.numero} value={s.numero}>{s.numero}</option>
                    ))}
                  </select>
                  <span className="select-chevron"><IconChevron /></span>
                </div>
              </div>
            </div>

            {/* Data Show select */}
            <div>
              <label className="field-label" htmlFor="res-datashow">
                Sélectionner un Data Show
              </label>
              <div className={`select-wrap ${datashow ? 'select-highlight' : ''}`}>
                <select
                  id="res-datashow"
                  className="res-select"
                  value={datashow}
                  onChange={(e) => setDatashow(e.target.value)}
                >
                  <option value="">Choisir un appareil</option>
                  {datashows.filter(d => d.etat === 'disponible').map(d => (
                    <option key={d.id} value={d.numero_unique}>
                      DataShow {d.numero_unique}
                    </option>
                  ))}
                </select>
                <span className="select-chevron"><IconChevron /></span>
              </div>
            </div>

            {/* Alerte conditionnelle */}
            {showWarning && (
              <div className="alert-warning" role="alert">
                <span className="alert-icon"><IconInfo /></span>
                <span className="alert-text">
                  Avertissement : Cette salle est déjà équipée d'un Data show fixe.
                  La réservation reste possible si besoin d'un second appareil.
                </span>
              </div>
            )}

            {/* Alerte erreur semaine fermée */}
            {weekStatusError && (
              <div className="alert-error" role="alert">
                <span className="alert-error-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </span>
                <span className="alert-error-text">{weekStatusError}</span>
              </div>
            )}

            {/* Bouton confirmation */}
            <button 
              type="submit" 
              className="btn-confirm" 
              id="btn-confirm"
              disabled={!!weekStatusError}
              style={weekStatusError ? { opacity: 0.6, cursor: 'not-allowed', boxShadow: 'none' } : {}}
            >
              Confirmer la réservation
            </button>

          </form>
        </div>

        <footer className="res-footer">
          © 2026 IPSAS Sfax – Système de Gestion des Ressources Académiques
        </footer>

      </main>

    </div>
  );
}


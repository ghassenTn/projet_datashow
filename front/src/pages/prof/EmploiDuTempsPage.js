import React, { useState, useEffect, useMemo } from 'react';
import { API_BASE_URL } from '../../config';
import '../../assets/css/prof/EmploiDuTempsPage.css';

/* ── Constants & Helpers ─────────────────────────────────────── */

const JOURS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

const JOURS_LABELS = {
  lundi: 'Lundi',
  mardi: 'Mardi',
  mercredi: 'Mercredi',
  jeudi: 'Jeudi',
  vendredi: 'Vendredi',
  samedi: 'Samedi',
};

const JOUR_TO_BACKEND = {
  lundi: 'Lundi',
  mardi: 'Mardi',
  mercredi: 'Mercredi',
  jeudi: 'Jeudi',
  vendredi: 'Vendredi',
  samedi: 'Samedi',
};

const BACKEND_TO_JOUR = {
  'Lundi': 'lundi',
  'Mardi': 'mardi',
  'Mercredi': 'mercredi',
  'Jeudi': 'jeudi',
  'Vendredi': 'vendredi',
  'Samedi': 'samedi',
};

/* ── Sub-components ──────────────────────────────────────── */

const IconChevron = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

function DaySelect({ id, value, onChange, salles, disabled }) {
  return (
    <div className={`edt-select-wrap ${disabled ? 'disabled' : ''}`}>
      <select
        id={id}
        className={`edt-select ${value ? 'has-value' : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="">Choisir une salle</option>
        {salles.map(s => (
          <option key={s.numero} value={s.numero}>{s.numero}</option>
        ))}
      </select>
      <span className="edt-chevron"><IconChevron /></span>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────── */

export default function EmploiDuTempsPage({ onNavigate, onLogout }) {
  const [schedule, setSchedule] = useState({});
  const [seances, setSeances] = useState([]);
  const [salles, setSalles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const token = localStorage.getItem('token');

  const fetchInitialData = React.useCallback(async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      // 1. Fetch Seances
      const resSeances = await fetch(`${API_BASE_URL}/seances`, { headers });
      const dataSeances = await resSeances.json();
      setSeances(dataSeances.sort((a, b) => a.id.localeCompare(b.id)).slice(0, 6));

      // 2. Fetch Salles
      const resSalles = await fetch(`${API_BASE_URL}/salles`, { headers });
      const dataSalles = await resSalles.json();
      setSalles(dataSalles);



      // 4. Fetch My Timetable
      const resEmploi = await fetch(`${API_BASE_URL}/emplois/me`, { headers });
      const dataEmploi = await resEmploi.json();
      
      // Transform backend list to nested object { seance_id: { jour: salle_id } }
      const initialSchedule = {};
      dataEmploi.forEach(item => {
        if (!initialSchedule[item.seance_id]) initialSchedule[item.seance_id] = {};
        initialSchedule[item.seance_id][BACKEND_TO_JOUR[item.jour_de_la_semaine]] = item.salle_id;
      });
      setSchedule(initialSchedule);

    } catch (err) {
      console.error("Erreur lors du chargement des données:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const updateCell = (seanceCode, jour, value) => {
    setSchedule(prev => ({
      ...prev,
      [seanceCode]: {
        ...prev[seanceCode],
        [jour]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      const payload = [];
      Object.entries(schedule).forEach(([seanceId, jours]) => {
        Object.entries(jours).forEach(([jour, salleId]) => {
          if (salleId) {
            payload.push({
              jour_de_la_semaine: JOUR_TO_BACKEND[jour],
              seance_id: seanceId,
              salle_id: salleId
            });
          }
        });
      });

      const response = await fetch(`${API_BASE_URL}/emplois/me`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setToastMsg('Emploi du temps enregistré avec succès !');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        const errorData = await response.json();
        alert(`Erreur : ${errorData.detail || 'Impossible d\'enregistrer'}`);
      }
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      alert("Une erreur est survenue lors de la sauvegarde.");
    }
  };



  if (loading) {
    return (
      <main className="edt-main">
        <div className="loading-state">Chargement de l'emploi du temps...</div>
      </main>
    );
  }

  return (
    <div className="edt-page-container" style={{display:'flex', flexDirection:'column', width:'100%'}}>
      <main className="edt-main">
        <h1 className="edt-page-title">Gérer mon emploi du temps</h1>
        <p className="edt-page-subtitle">
          Sélectionnez les salles correspondantes à vos séances régulières pour activer
          le pré-remplissage automatique lors de la réservation.
        </p>



        <div className="edt-card">
          <table className="edt-table" aria-label="Emploi du temps">
            <thead>
              <tr>
                <th scope="col">Séance</th>
                {JOURS.map(j => (
                  <th key={j} scope="col">{JOURS_LABELS[j]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {seances.map(({ id, heure_debut, heure_fin }) => {
                const timeStr = `${heure_debut.substring(0, 5)} - ${heure_fin.substring(0, 5)}`;
                const rowData = schedule[id] || {};

                return (
                  <tr key={id}>
                    <td className="seance-cell">
                      <span className="seance-code">{id}</span>
                      <span className="seance-time">{timeStr}</span>
                    </td>
                    {JOURS.map(jour => (
                      <td key={jour} className="day-cell">
                        <DaySelect
                          id={`${id}-${jour}`}
                          value={rowData[jour] ?? ''}
                          onChange={(val) => updateCell(id, jour, val)}
                          salles={salles}
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="edt-actions">
          <button
            id="btn-save-schedule"
            className="btn-save"
            onClick={handleSave}
          >
            Enregistrer mon emploi du temps
          </button>
        </div>
      </main>

      {showToast && (
        <div className="edt-toast" role="status" aria-live="polite">
          <IconCheck />
          {toastMsg}
        </div>
      )}
    </div>
  );
}
